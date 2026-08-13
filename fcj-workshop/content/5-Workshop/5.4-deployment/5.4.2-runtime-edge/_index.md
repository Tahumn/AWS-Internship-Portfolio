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

![Gateway task-definition revision 4 resources](/images/5-Workshop/Gateway_Task_Definition_Resources.png)

Gateway revision 4 uses `awsvpc` network mode, separates the application task role from the task execution role, and allocates `0.25 vCPU` and `1 GiB` of memory. This is the deployed demo configuration, not a rightsizing result from a load test.

Services were deployed in dependency order: Auth and Finance first, then Notification API/Worker, Planning and Recurring, OCR and AI, and Gateway last. A create-service response was not considered success. For every workload, ECS events, stopped-task exit codes, CloudWatch startup logs, and `/health` were checked until `Desired=1`, `Running=1`, and `Pending=0`.

## Private service communication

The `cloud-finance.local` Cloud Map namespace supports ECS Service Connect aliases on port 8000. Only Gateway is registered in the ALB target group; domain services remain private. This preserves one public application entry point and avoids exposing each service through a separate load balancer.

The design was verified from inside the running Gateway task with ECS Exec:

~~~text
GET http://auth:8000/health
{"status":"ok","service":"auth"}
~~~

This test proves DNS resolution, the Service Connect proxy, security-group permission, and the Auth listener. A console label saying “enabled” would prove only configuration, not data-plane reachability.

![Gateway calling Auth through a private Service Connect alias](/images/5-Workshop/ServiceConnect_Private_Health.png)

The ECS Exec evidence records a request from the `gateway` container to `http://auth:8000/health`, an `HTTP 200` response, and a payload identifying the `auth` service. It verifies the private call path at test time; it is not interpreted as a long-term availability guarantee.

## ALB, CloudFront, and WAF

The internet-facing ALB spans the two public subnets. Its IP target group forwards HTTP 8000 to private Gateway task ENIs and probes `/health`. CloudFront has two origin responsibilities: the default behavior reads the private S3 SPA origin through OAC, while non-cached `/api/*` and `/ws/*` behaviors forward dynamic traffic to the ALB. WAF is attached at CloudFront so filtering occurs before requests reach the regional origin.

![Healthy Gateway target in the ALB target group](/images/5-Workshop/ALB_Target_Healthy.png)

The target group uses the `ip` target type and reports the Gateway healthy on its application port. This provides evidence for the ALB-to-Gateway path; the CloudFront captures below independently verify the edge layer.

![CloudFront origins for the S3 frontend and ALB backend](/images/5-Workshop/OriginAmazonCloudFront.png)

This view confirms that the demo CloudFront distribution uses two distinct origins: `frontend-s3`, with S3 type and Origin Access Control, and `backend-alb`, with Elastic Load Balancing type. The configuration separates static content from dynamic backend traffic while retaining one public entry point.

![Enabled CloudFront distribution used by the demo](/images/5-Workshop/CloudFront.png)

SPA routes require custom 403/404 responses to `/index.html` with response code 200. This is not an API error-masking rule; it is limited to client-side navigation so React Router can resolve the path. API behaviors must continue returning their real status codes.

## External integrations

Gemini and SES are reached from private application subnets through NAT. Gemini is used by AI and OCR; Tesseract remains part of OCR processing. SMTP credentials are injected from Secrets Manager. At capture time, SES delivery was validated for verified identities, while unrestricted production sending was still subject to AWS approval. The receipts/exports bucket is provisioned, but automatic OCR object persistence remains explicitly pending.

![ElastiCache Redis in the demo environment](/images/5-Workshop/ElastiCache_Redis_Overview.png)

Redis OSS 7.1 runs on one `cache.t4g.micro` node, is `Available`, and has encryption at rest and in transit enabled. It supports Redis/RQ and caching used by the current code. Because Multi-AZ and automatic failover are disabled, this is documented as a cost-conscious baseline rather than a production HA design.

**Checkpoint:** all nine services are healthy; Gateway resolves private aliases; ALB target health is healthy; CloudFront serves the SPA; an unauthenticated `/api/v1/auth/me` request returns the expected `401` rather than a `504`.
