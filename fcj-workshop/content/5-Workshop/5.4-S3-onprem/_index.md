---
title: "End-to-end deployment"
date: 2026-08-01
weight: 4
chapter: false
pre: " <b> 5.4. </b> "
---

## 1. Create foundational resources

Create the VPC, six subnets, Internet Gateway, route tables, four security groups, one demo NAT Gateway, and DB/cache subnet groups described in the architecture chapter. Create nine CloudWatch log groups under /ecs/cloud-finance/ with 14-day retention.

{{% notice info %}}
Security groups, route tables, and subnet groups do not have hourly charges. NAT Gateway and its data processing start charging as soon as it is available.
{{% /notice %}}

## 2. Create ECR and push the backend image

~~~powershell
aws ecr create-repository --repository-name cloud-finance-backend --region $region
$account = (aws sts get-caller-identity --query Account --output text)
$registry = "$account.dkr.ecr.$region.amazonaws.com"
aws ecr get-login-password --region $region | docker login --username AWS --password-stdin $registry
docker build -t cloud-finance-backend:workshop .
docker tag cloud-finance-backend:workshop "$registry/cloud-finance-backend:workshop"
docker push "$registry/cloud-finance-backend:workshop"
~~~

One image is reused with different commands for Gateway, Auth, Finance, Notifications API, Notifications Worker, Planning, Recurring, OCR, and AI.

## 3. Create RDS and Redis

Create RDS PostgreSQL using the private DB subnet group:

- Identifier: cloud-finance-postgres
- PostgreSQL 16, db.t4g.micro, gp3 20 GiB
- Public access: No
- Encryption: On
- Security group: cloud-finance-rds-sg
- Demo: Single-AZ; production target: Multi-AZ
- Automated backups enabled within account limits

Create an ElastiCache Redis replication group in the private cache subnet group:

- ID: cloud-finance-redis
- TLS in transit enabled
- Security group: cloud-finance-redis-sg
- Demo: one primary; production: replica and automatic failover

The project uses one RDS instance with six logical databases: auth_db, finance_db, ai_db, notifications_db, planning_db, and recurring_db. This preserves logical ownership while controlling demo cost.

## 4. Store secrets and run migrations

Create Secrets Manager entries for application configuration, Gemini, Redis, SMTP, and database credentials. Grant ecsTaskExecutionRole secretsmanager:GetSecretValue and kms:Decrypt only for required resources.

Run the dedicated migration task sequentially for each database. Do not run migrations concurrently on the small demo instance.

~~~powershell
aws ecs run-task --cluster cloud-finance-cluster --launch-type FARGATE --task-definition cloud-finance-db-migration --network-configuration "awsvpcConfiguration={subnets=[PRIVATE_APP_A,PRIVATE_APP_B],securityGroups=[ECS_SG],assignPublicIp=DISABLED}" --overrides file://ecs/migration-overrides.json --region $region
~~~

Checkpoint: every migration task must stop with exit code 0.

## 5. Create ECS services and Service Connect

Create cloud-finance-cluster and register a Fargate task definition for every workload. Use awsvpc networking, private application subnets, cloud-finance-ecs-sg, awslogs, health checks, and secret injection.

Commands:

| Service | Container command |
|---|---|
| gateway | uvicorn app.gateway_main:app --host 0.0.0.0 --port 8000 |
| auth | uvicorn app.services.auth_main:app --host 0.0.0.0 --port 8000 |
| finance | uvicorn app.services.finance_main:app --host 0.0.0.0 --port 8000 |
| notifications | uvicorn app.services.notifications_main:app --host 0.0.0.0 --port 8000 |
| notifications-worker | python -m app.workers.notifications_worker |
| planning | uvicorn app.services.planning_main:app --host 0.0.0.0 --port 8000 |
| recurring | uvicorn app.services.recurring_main:app --host 0.0.0.0 --port 8000 |
| ocr | uvicorn app.services.ocr_main:app --host 0.0.0.0 --port 8000 |
| ai | uvicorn app.services.ai_main:app --host 0.0.0.0 --port 8000 |

Create the HTTP namespace cloud-finance.local. Configure Service Connect aliases auth, finance, notifications, planning, recurring, ocr, ai, and gateway on port 8000. Only Gateway is attached to the ALB target group.

Verify:

~~~powershell
$services = @("cloud-finance-auth","cloud-finance-finance","cloud-finance-notifications","cloud-finance-notifications-worker","cloud-finance-planning","cloud-finance-recurring","cloud-finance-ocr","cloud-finance-ai","cloud-finance-gateway")
aws ecs describe-services --cluster cloud-finance-cluster --services $services --region $region --query "services[].{Service:serviceName,Desired:desiredCount,Running:runningCount,Pending:pendingCount}" --output table
~~~

Expected: Desired=1, Running=1, Pending=0 for all nine services.

## 6. Create ALB, S3, CloudFront, and WAF

1. Create an internet-facing ALB in the two public subnets.
2. Create an IP target group on port 8000 with /health health check.
3. Attach only cloud-finance-gateway to the target group.
4. Create a private frontend S3 bucket with Block Public Access and SSE-S3.
5. Build the frontend with VITE_API_BASE=/api/v1 and upload dist/.
6. Create CloudFront OAC for S3.
7. Configure default behavior for S3 and non-cached /api/* and /ws/* behaviors for ALB.
8. Add SPA 403/404 responses to /index.html with response code 200.
9. Attach an AWS WAF Web ACL to CloudFront.

~~~powershell
Set-Location frontend
npm ci
$env:VITE_API_BASE="/api/v1"
npm run build
aws s3 sync dist "s3://FRONTEND_BUCKET" --delete --region $region
~~~

## 7. Configure SES and external APIs

Verify the sender identity in SES ap-southeast-1. Create regional SMTP credentials and store them in cloud-finance/smtp. If SES remains in Sandbox, verify every test recipient. Gemini calls leave private subnets through NAT Gateway; store its API key in Secrets Manager.

## 8. Configure CI/CD

Create a GitHub OIDC provider and CloudFinanceGitHubActionsRole. Restrict the trust policy to the repository and production environment. Add these GitHub repository variables:

AWS_REGION, AWS_ROLE_ARN, ECR_REPOSITORY, ECS_CLUSTER, FRONTEND_BUCKET, CLOUDFRONT_DISTRIBUTION_ID, VITE_GOOGLE_CLIENT_ID.

The Deploy AWS workflow builds one immutable SHA-tagged image, registers task-definition revisions, performs rolling ECS updates, builds the frontend, uploads it to S3, and invalidates CloudFront.

## Screenshot checklist

Save under static/images/5-Workshop/5.4-S3-onprem/:

- ecr-images.png: ECR → cloud-finance-backend → Images; show SHA tags and push time.
- rds.png: RDS → Databases → cloud-finance-postgres; show Available, encrypted, non-public.
- redis.png: ElastiCache → Redis OSS caches; show available endpoint and topology, not credentials.
- secrets.png: Secrets Manager list showing secret names only.
- ecs-services.png: ECS → cluster → Services showing 9/9 running.
- service-connect.png: ECS service → Configuration and networking → Service Connect.
- target-healthy.png: Target group showing Gateway healthy.
- cloudfront-origins.png: CloudFront distribution → Origins and Behaviors.
- waf.png: WAF → Web ACL → Associated AWS resources.
- cicd.png: GitHub Actions successful Deploy AWS run.

## 9. Actual deployment record

### 9.1. Network and security groups

The deployed VPC contains six subnets across ap-southeast-1a and ap-southeast-1b: public 10.0.1.0/24 and 10.0.2.0/24, private application 10.0.11.0/24 and 10.0.12.0/24, and private data 10.0.21.0/24 and 10.0.22.0/24.

The private application route table was verified with:

~~~text
10.0.0.0/16 -> local
0.0.0.0/0  -> nat-0a751272d928f7bd2
~~~

The private data route table has no Internet default route. Security-group references enforce CloudFront-to-ALB, ALB-to-ECS on 8000, ECS self-reference on 8000, ECS-to-RDS on 5432, and ECS-to-Redis on 6379.

### 9.2. Database and migration results

The deployed database is PostgreSQL 16.13 on db.t4g.micro with 20 GiB gp3, encryption enabled, Public=False, and Single-AZ for the demo. Bootstrap created six logical databases. Sequential Alembic migration tasks completed with exit code 0 for auth, finance, ai, notifications, planning, and recurring.

Startup migrations were disabled with SKIP_MIGRATIONS=true after the controlled migration stage. This prevents concurrent tasks from competing for migration locks during rolling deployments.

### 9.3. ECS and Service Connect evidence

All nine services reached Desired=1, Running=1, Pending=0. The cloud-finance.local namespace provides private names. ECS Exec from Gateway resolved auth and returned:

~~~text
{"status":"ok","service":"auth"}
~~~

This result proves that private DNS and Service Connect work in the running environment.

### 9.4. ALB and CloudFront evidence

cloud-finance-gateway-tg uses IP targets, HTTP port 8000, and /health. A private Gateway target at 10.0.11.48 was reported healthy. The external test returned:

~~~text
GET https://d29kxn0rxd6abn.cloudfront.net/api/v1/auth/me
HTTP/1.1 401 Unauthorized
{"detail":"Not authenticated"}
~~~

The expected 401 proves the full CloudFront → ALB → Gateway → Auth path. Before the origin/security-group fix, the same request returned 504.

### 9.5. Deployed CI/CD flow

The manual Deploy AWS workflow obtains temporary credentials with OIDC, builds a SHA-tagged backend image, pushes ECR, registers new task-definition revisions, performs rolling ECS updates, builds the frontend with /api/v1, uploads immutable files to S3, uploads a no-cache index.html, and invalidates CloudFront. Git SHA tags provide traceability and rollback without long-lived AWS keys.
## 10. Sequential implementation journal and checkpoints

The environment was not created in one operation. Each phase ended with a verification checkpoint. Hourly billed resources were created only after the free configuration layers had been reviewed.

### Phase 0 — Establish the deployment baseline

Before creating resources, the team mapped each local process to one ECS workload and verified the exact startup command. The same backend image was intentionally reused, while the command and configuration selected the service role. This reduced build inconsistency and allowed one Git SHA to identify a complete backend release.

The initial inventory contained nine workloads: Gateway, Auth, Finance, AI Agent, Notification API, Notification Worker, Planning, Recurring, and OCR. Dependencies were classified as synchronous HTTP, Redis queue, PostgreSQL, object storage, SMTP, or external Gemini API. Dify, Kafka, Cognito, API Gateway, and Lambda were excluded because the current source code did not depend on them.

**Checkpoint:** every process started locally, `/health` was available for HTTP services, and no secret was committed to Git.

### Phase 1 — Build the network without paid compute

A VPC with CIDR `10.0.0.0/16` was divided into three subnet tiers across `ap-southeast-1a` and `ap-southeast-1b`:

| Tier | AZ A | AZ B | Purpose |
|---|---|---|---|
| Public | `10.0.1.0/24` | `10.0.2.0/24` | ALB and NAT |
| Private application | `10.0.11.0/24` | `10.0.12.0/24` | Fargate task ENIs |
| Private database | `10.0.21.0/24` | `10.0.22.0/24` | RDS and Redis |

Only the public route table received `0.0.0.0/0 -> Internet Gateway`. The database route table deliberately had no Internet route. Public IP auto-assignment remained disabled because the ALB and NAT do not require task-level public addressing.

**Checkpoint:** six subnet IDs, their AZs, CIDRs, route-table associations, and `MapPublicIpOnLaunch=False` were exported and reviewed.

### Phase 2 — Apply security-group references

Four security groups were created before any service:

- `cloud-finance-alb-sg`: origin traffic from the CloudFront managed prefix list.
- `cloud-finance-ecs-sg`: TCP 8000 from the ALB SG and from itself.
- `cloud-finance-rds-sg`: TCP 5432 only from the ECS SG.
- `cloud-finance-redis-sg`: TCP 6379 only from the ECS SG.

Using SG references instead of CIDR ranges means task IP changes do not require firewall changes. RDS and Redis were never opened to `0.0.0.0/0`.

**Checkpoint:** the four groups existed in the same VPC and each inbound rule named another SG or the CloudFront prefix list.

### Phase 3 — Prepare logs and subnet groups

Nine CloudWatch log groups were created under `/ecs/cloud-finance/` and retention was set to 14 days. RDS and ElastiCache subnet groups were created from the two private database subnets. These steps created the operational structure without starting application compute.

**Checkpoint:** each log group showed retention 14 days; each subnet group contained one subnet in each AZ.

### Phase 4 — Enable controlled outbound connectivity

One NAT Gateway was created in public subnet A for the cost-conscious demo. The private application route table received `0.0.0.0/0 -> NAT Gateway`, allowing tasks to pull ECR images and call Gemini/SES. The private database route table remained isolated.

This was the first phase that introduced a significant hourly charge, so its allocation ID, route, and cleanup command were recorded immediately.

**Checkpoint:** private application tasks had outbound access, while RDS/Redis subnets still had no default Internet route.

### Phase 5 — Provision stateful services and secrets

PostgreSQL 16.13 was created as encrypted, non-public `db.t4g.micro`, 20 GiB gp3, Single-AZ for the demo. ElastiCache Redis was created in private database subnets for cache and RQ jobs. Secrets Manager stored application, database, Gemini, Redis, and SMTP configuration. The ECS execution role received narrowly scoped `secretsmanager:GetSecretValue` and KMS decrypt permissions.

The managed RDS secret schema was inspected before task definitions referenced JSON keys. This prevented relying on guessed key names.

**Checkpoint:** RDS was `available`, encrypted and non-public; Redis was available; secret names and ARNs were visible but values were not captured in screenshots.

### Phase 6 — Bootstrap databases and run controlled migrations

A short-lived Fargate bootstrap task created six logical databases. A separate migration task was then run sequentially for `auth`, `finance`, `ai`, `notifications`, `planning`, and `recurring`. Each run used a new task ARN, waited for `STOPPED`, required exit code 0, and was checked in `/ecs/cloud-finance/db-migration`.

Sequential execution was selected because the demo RDS instance is small and parallel schema upgrades would create avoidable lock and CPU contention. After success, long-running services received `SKIP_MIGRATIONS=true`.

**Checkpoint:** six `Migration completed` records and six exit-code-zero task results were retained as evidence.

### Phase 7 — Deploy services in dependency order

Services were deployed one at a time rather than all at once:

1. Auth, to establish identity and JWT validation.
2. Finance, to validate the main database workflow.
3. Notification API and Notification Worker, to validate Redis RQ.
4. Planning and Recurring, to validate domain databases.
5. OCR and AI, to validate Gemini and file-processing dependencies.
6. Gateway last, after internal destinations were healthy.

For each service, the team checked task events, the newest stopped task, container exit code, CloudWatch startup logs, `/health`, and finally `Desired=1, Running=1, Pending=0`. A service was not considered complete merely because ECS had accepted the create-service request.

**Checkpoint:** all nine services were stable and their health logs showed successful probes.

### Phase 8 — Enable private service discovery

The `cloud-finance.local` Cloud Map namespace and ECS Service Connect aliases were configured from task-definition port names. Gateway resolution was verified with ECS Exec rather than inferred from the console. From inside the Gateway container, `auth` resolved and `http://auth:8000/health` returned the Auth health JSON.

**Checkpoint:** direct task-to-task communication succeeded without a public endpoint.

### Phase 9 — Publish the application path

An IP target group on HTTP 8000 and `/health` was attached to Gateway. The ALB was placed in public subnets, while Gateway targets remained private. CloudFront used a private S3 OAC origin for the SPA and an ALB origin for `/api/*` and `/ws/*`. WAF was associated with CloudFront.

The end-to-end unauthenticated request returned 401 instead of 504. In this context, 401 was the success criterion because it proved that routing reached the Auth authorization boundary.

**Checkpoint:** target health was `healthy`; static assets loaded; `/api/v1/auth/me` returned the expected JSON 401.

### Phase 10 — Configure identity, email, and external AI

The CloudFront origin was added to Google OAuth authorized JavaScript origins. First-time Google users were routed through onboarding; subsequent logins skipped it. SES SMTP credentials and the verified sender were stored in Secrets Manager. Because SES production access was not approved at the time of recording, demo recipients had to be verified. Gemini credentials were injected into AI/OCR tasks without exposing the API key.

**Checkpoint:** Google account selection and token exchange worked; verified recipients received transactional mail; AI and OCR health checks remained stable.

### Phase 11 — Automate delivery with GitHub Actions

GitHub Actions assumed `CloudFinanceGitHubActionsRole` through OIDC, built and pushed an immutable SHA tag, registered task-definition revisions, updated ECS services, built the frontend, synchronized it to S3, and invalidated CloudFront. Long-lived AWS access keys were not stored in GitHub.

The initial workflow exposed two realistic defects: the OIDC subject did not match the repository/environment, and waiting for all services in one waiter obscured the failing service. The trust condition was corrected and rollout inspection was changed to service-level diagnostics.

**Checkpoint:** the workflow could be traced from commit SHA to ECR image, ECS task-definition revision, and deployed frontend assets.

## 11. Why the checkpoint approach mattered

This sequence separated configuration errors from application errors. For example, a missing secret key failed before container startup, a missing ECR tag failed during image pull, an Alembic issue appeared in application logs, and an ALB/CloudFront issue appeared as 504. Because only one layer changed at each checkpoint, the team could identify the responsible layer instead of repeatedly rebuilding the whole system.

## 12. Deployment evidence from the implemented environment

The following screenshots were captured from the actual demo environment rather than from a proposed design. Together they establish a traceable chain from edge delivery to container workloads, persistent data, and automated release.

### 12.1. CloudFront distribution

![Enabled CloudFront distribution for Cloud Finance](/images/5-Workshop/CloudFront.png)

The distribution is enabled and exposes the domain used by the workshop. In the implemented design, its default behavior serves immutable frontend assets from the private S3 origin, while `/api/*` and `/ws/*` behaviors forward dynamic traffic to the ALB. This separation allows SPA caching without caching authenticated API responses.

### 12.2. ECS Fargate services

![Nine active ECS Fargate services](/images/5-Workshop/ECS_Service.png)

The ECS cluster contains nine active services: Gateway, Auth, Finance, AI, Notification API, Notification Worker, Planning, Recurring, and OCR. Each row shows one running task, which confirms that the architecture diagram maps to independently managed runtime workloads rather than labels inside one monolithic container. The one-task setting is a cost-conscious demo choice; production would add autoscaling, multiple tasks, and stricter deployment protection.

### 12.3. RDS operational metrics

![RDS PostgreSQL operational metrics](/images/5-Workshop/rds.png)

The RDS console records CPU utilization, database connections, free memory, free storage, read IOPS, read latency, throughput, and write IOPS for `cloud-finance-postgres`. The metrics demonstrate active application traffic and provide a baseline for capacity decisions. The demo uses one encrypted PostgreSQL instance with six logical databases; this reduces cost while preserving logical ownership by service, but it does not provide the failure isolation of one physical instance per service.

### 12.4. Successful GitHub Actions release

![Successful GitHub Actions deployment workflow](/images/5-Workshop/CI_CD.png)

The successful workflow records the complete release sequence: checkout, AWS authentication through OIDC, ECR login, backend image build and push, ECS service deployment, stability verification, frontend build, and S3 upload. This evidence is important because it proves that deployment is reproducible from source control and does not depend only on manual console changes. The warning shown by GitHub is non-blocking; the job itself completed successfully.

### Evidence conclusion

These four artifacts form one deployment chain: CloudFront publishes the entry point, ECS runs the separated services, RDS stores and measures transactional data, and GitHub Actions reproduces the release. No single screenshot proves the whole architecture, but their combined evidence supports the end-to-end deployment claim.
