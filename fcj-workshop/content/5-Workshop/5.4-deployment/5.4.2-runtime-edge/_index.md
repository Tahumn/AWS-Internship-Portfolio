---
title: "ECS runtime, service discovery, and edge"
date: 2026-08-01
weight: 2
chapter: false
pre: " <b> 5.4.2. </b> "
---

## Container deployment model

One backend image is reused by nine ECS Fargate services. The task command selects Gateway, Auth, Finance, Notification API, Notification Worker, Planning, Recurring, OCR, or AI. Reusing the image prevents dependency drift while each ECS service still has an independent desired count, health state, deployment history, and task-definition revision.

![Nine independently managed ECS services](/images/5-Workshop/ECS_Service.png)

Services were deployed in dependency order: Auth and Finance first, then Notification API/Worker, Planning and Recurring, OCR and AI, and Gateway last. A create-service response was not considered success. For every workload, ECS events, stopped-task exit codes, CloudWatch startup logs, and `/health` were checked until `Desired=1`, `Running=1`, and `Pending=0`.

## Private service communication

The `cloud-finance.local` Cloud Map namespace supports ECS Service Connect aliases on port 8000. Only Gateway is registered in the ALB target group; domain services remain private. This preserves one public application entry point and avoids exposing each service through a separate load balancer.

The design was verified from inside the running Gateway task with ECS Exec:

~~~text
GET http://auth:8000/health
{"status":"ok","service":"auth"}
~~~

This test proves DNS resolution, the Service Connect proxy, security-group permission, and the Auth listener. A console label saying “enabled” would prove only configuration, not data-plane reachability.

## ALB, CloudFront, and WAF

The internet-facing ALB spans the two public subnets. Its IP target group forwards HTTP 8000 to private Gateway task ENIs and probes `/health`. CloudFront has two origin responsibilities: the default behavior reads the private S3 SPA origin through OAC, while non-cached `/api/*` and `/ws/*` behaviors forward dynamic traffic to the ALB. WAF is attached at CloudFront so filtering occurs before requests reach the regional origin.

![CloudFront origins for the S3 frontend and ALB backend](/images/5-Workshop/OriginAmazonCloudFront.png)

This view confirms that the demo CloudFront distribution uses two distinct origins: `frontend-s3`, with S3 type and Origin Access Control, and `backend-alb`, with Elastic Load Balancing type. The configuration separates static content from dynamic backend traffic while retaining one public entry point.

![Enabled CloudFront distribution used by the demo](/images/5-Workshop/CloudFront.png)

SPA routes require custom 403/404 responses to `/index.html` with response code 200. This is not an API error-masking rule; it is limited to client-side navigation so React Router can resolve the path. API behaviors must continue returning their real status codes.

## External integrations

Gemini and SES are reached from private application subnets through NAT. Gemini is used by AI and OCR; Tesseract remains part of OCR processing. SMTP credentials are injected from Secrets Manager. At capture time, SES delivery was validated for verified identities, while unrestricted production sending was still subject to AWS approval. The receipts/exports bucket is provisioned, but automatic OCR object persistence remains explicitly pending.

**Checkpoint:** all nine services are healthy; Gateway resolves private aliases; ALB target health is healthy; CloudFront serves the SPA; an unauthenticated `/api/v1/auth/me` request returns the expected `401` rather than a `504`.
