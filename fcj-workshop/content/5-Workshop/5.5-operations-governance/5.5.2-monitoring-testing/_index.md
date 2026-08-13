---
title: "Monitoring and acceptance testing"
date: 2026-08-01
weight: 2
chapter: false
pre: " <b> 5.5.2. </b> "
---

## Observability baseline

CloudWatch log groups were created before service deployment so startup failures would not be lost. HTTP services, Notification Worker, database bootstrap, and migration tasks use separate groups; application groups retain logs for two weeks to control cost.

![CloudWatch log groups for services and migration tasks](/images/5-Workshop/CloudWatch.png)

The screenshot shows that observability covers more than the nine long-running workloads: `/ecs/cloud-finance/db-bootstrap` and `/ecs/cloud-finance/db-migration` preserve evidence for one-off schema operations, while `/aws/vpc/flowlogs` supports network investigation. A log group existing is not itself monitoring success; logs must be correlated with task ARN, task-definition revision, image tag, and request time.

## Layered test method

Testing proceeds from the inside out:

1. inspect container startup and health probe;
2. call a private Service Connect alias from Gateway;
3. check ALB target health;
4. call the API through CloudFront;
5. execute the user workflow and verify persisted results.

This order prevents a CloudFront timeout from being misdiagnosed as a Finance or OCR bug. A task in `RUNNING` is not accepted until the health probe succeeds and the ECS deployment becomes steady.

![CloudWatch log for the Gateway health endpoint](/images/5-Workshop/Gateway_Health_Log.png)

The log stream records Uvicorn starting on port 8000 and repeated health probes returning `200 OK`. Because the probe source is shown as loopback, this capture proves container health; it does not replace ALB or end-to-end Service Connect evidence.

## Infrastructure acceptance matrix

| Test | Expected result | Evidence |
|---|---|---|
| Nine ECS services | `Desired=1`, `Running=1`, `Pending=0` | ECS Services table and events |
| Gateway target | `/health` on port 8000 is healthy | ALB target health |
| Private discovery | Gateway calls `http://auth:8000/health` | Auth JSON via ECS Exec |
| Edge/API routing | unauthenticated `/api/v1/auth/me` returns `401` | CloudFront response, not `504` |
| Database isolation | RDS is encrypted and `PubliclyAccessible=False` | RDS configuration/metrics |
| Queue | API enqueues and worker listens to `notifications` | Notification Worker logs |
| CI/CD traceability | Git SHA maps to ECR tag and task revision | GitHub Actions, ECR, ECS |

## Evidence-to-claim matrix

| Evidence | Supported conclusion | Not established by this image alone |
|---|---|---|
| VPC resource map | Subnets, route tables, IGW, and NAT exist in the documented tiers | Security groups block every unintended path |
| Gateway CloudWatch log | The process starts and `/health` returns 200 inside the container | An Internet request traverses the complete edge path |
| ECS Exec `gateway → auth` | The Service Connect data plane and private alias worked at test time | Long-term availability of every service |
| Healthy ALB target | The ALB health check reaches Gateway | Business flows and database correctness |
| CloudFront login page | Static delivery and the SPA entry point work | Every backend acceptance test passes |
| OCR/AI/SES evidence | The demonstrated business scenarios succeeded | Load capacity, HA, or a production SLA |

This matrix prevents a console screenshot from being extended into a claim broader than the evidence supports.

The `401` test is deliberately a positive routing test with a negative authorization outcome. It demonstrates that the request reached Auth and was rejected at the correct boundary. A `504` would indicate an origin or internal routing failure.

## Business acceptance

Infrastructure health was paired with user-visible outcomes:

- AI receives one Vietnamese sentence containing coffee expense, money received from a parent, and milk-tea expense; it creates three records with the correct income/expense direction instead of one merged amount.
- Creating a budget or savings goal executes without confirmation; modifying or deleting data requires confirmation.
- OCR extracts structured merchant/date/amount information and persists finance metadata/transaction through the owning service. Automatic S3 receipt-object persistence remains pending.
- Notification API enqueues an RQ job and Notification Worker consumes it.
- Google sign-in sends a first-time user through onboarding and skips onboarding on later logins.

![AI assistant splitting one sentence into multiple transactions](/images/5-Workshop/Chatbox.png)

![Structured receipt OCR result](/images/5-Workshop/OCR.png)

![SES sending evidence for verified identities](/images/5-Workshop/email_ecs.png)

These screenshots are paired with logs and persisted-data checks. UI output alone could be stale or optimistic; service logs alone could show a request without proving that the dashboard and transaction list changed.

## Negative tests

Negative tests verify controls rather than only happy paths: invalid/expired JWT returns `401`; direct Internet access to RDS/Redis is unavailable; an unauthorized GitHub OIDC subject cannot assume the deployment role; an unavailable Gemini model produces a controlled OCR failure and no false transaction; SES Sandbox rejects an unverified recipient. Recording these expected failures makes the security and error-handling claims measurable.

