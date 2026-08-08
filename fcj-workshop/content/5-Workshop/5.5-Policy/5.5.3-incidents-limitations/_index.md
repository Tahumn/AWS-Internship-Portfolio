---
title: "Incident analysis and production gaps"
date: 2026-08-01
weight: 3
chapter: false
pre: " <b> 5.5.3. </b> "
---

## ECS stability timeout

![GitHub Actions ECS stability waiter timeout](/images/5-Workshop/ECSstabilitytimeout.png)

The workflow successfully authenticated with OIDC, pushed the image, and updated services, but `aws ecs wait services-stable` exceeded its attempts. The waiter is a symptom aggregator, not a root-cause message: one service repeatedly replacing an unhealthy task can block the entire nine-service wait.

The investigation therefore moved from workflow level to service and task level:

~~~powershell
aws ecs describe-services --cluster cloud-finance-cluster `
  --services cloud-finance-finance `
  --query "services[0].{Running:runningCount,Pending:pendingCount,Events:events[0:8].message}"

aws ecs describe-tasks --cluster cloud-finance-cluster `
  --tasks TASK_ARN `
  --query "tasks[0].{StoppedReason:stoppedReason,Containers:containers[].{ExitCode:exitCode,Reason:reason}}"
~~~

Observed causes during deployment included a missing ECR tag, secret JSON-key mismatch, and startup migration contention. Corrective actions were to push the referenced immutable tag before updating ECS, align task-definition secret keys with the actual secret schema, run migrations separately, and set `SKIP_MIGRATIONS=true` on services. Production hardening should enable deployment circuit breaker/rollback and report stability per service instead of one opaque combined waiter.

## Frontend JavaScript MIME incident

![CloudFront SPA custom error response configuration](/images/5-Workshop/FrontendJavaScriptMIME_error.png)

The browser error—JavaScript module expected but `text/html` received—occurred when an asset path did not resolve and CloudFront's SPA fallback returned `/index.html`. The custom 403/404 mapping is correct for navigation routes, but it makes stale asset references appear as MIME failures.

The fix was release ordering, not disabling SPA routing: upload immutable hashed assets first, upload no-cache `index.html` last, then invalidate CloudFront. Verification includes checking the asset request's `Content-Type`, confirming the object exists in S3, and testing a deep link separately from a missing JavaScript file.

## Other resolved incidents

- `504` through CloudFront: Gateway could call Auth internally, but CloudFront could not complete the origin path. Listener/origin protocol and the ALB security-group rule for the CloudFront managed prefix list were corrected. The final `401` response proved recovery.
- Gemini OCR `404 model unavailable`: the model name had been retired for new users. The configured model was updated, the OCR image rebuilt, a new task revision deployed, and `/health` plus an actual receipt scan retested.
- OIDC assume-role rejection: the IAM `sub` condition did not match the workflow's `production` environment subject. The trust condition was corrected without broadening it to every repository.

## Remaining production gaps

| Demo state | Production target |
|---|---|
| One NAT Gateway | one NAT per AZ or VPC endpoints where justified |
| RDS Single-AZ | Multi-AZ, deletion protection, tested restore |
| One Redis primary | replication group, Multi-AZ, automatic failover |
| One task per service | at least two for critical services and autoscaling |
| SES verified-recipient testing | production access, domain identity, DKIM, bounce/complaint automation |
| Receipts bucket provisioned | OCR object persistence with a scoped task-role policy |
| Manual infrastructure setup | reproducible IaC and environment promotion |

These are documented as gaps rather than hidden. The current environment is suitable for an end-to-end internship demonstration, but availability and recovery claims must remain limited to what was actually configured and tested.

