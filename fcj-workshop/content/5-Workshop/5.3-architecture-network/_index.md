---
title: "Architecture and networking"
date: 2026-08-01
weight: 3
chapter: false
pre: " <b> 5.3. </b> "
---

## Architecture flow

CloudFront has a private S3 origin for the SPA and an ALB origin for /api/* and /ws/*. WAF is attached to CloudFront. The ALB forwards only to the Gateway target group. Gateway calls private services through ECS Service Connect. Services access RDS and Redis through security-group references, not public IP addresses.

The demo VPC uses CIDR 10.0.0.0/16:

| Layer | Subnets |
|---|---|
| Public | 10.0.1.0/24 and 10.0.2.0/24 |
| Private application | 10.0.11.0/24 and 10.0.12.0/24 |
| Private data | 10.0.21.0/24 and 10.0.22.0/24 |

Public routes use an Internet Gateway. Private application routes use a NAT Gateway for outbound access. Private data route tables have no Internet default route.

![Cloud Finance VPC resource map](/images/5-Workshop/CloudFinance_VPC_Resource_Map.png)

The deployed resource map confirms six subnets distributed across `ap-southeast-1a` and `ap-southeast-1b`. The public tier connects to the Internet Gateway, the private application tier uses a NAT Gateway for outbound traffic, and the private database tier has a separate route table. The demo uses one NAT Gateway to control cost, so application-tier outbound connectivity still has an Availability Zone dependency.

## As-built deployment inventory

| Layer | Deployed components | Verified state | Claims deliberately excluded |
|---|---|---|---|
| Edge | CloudFront, WAF, private S3 origin, ALB origin | SPA loads through CloudFront; both origins are configured | No custom domain/ACM in the baseline |
| Compute | 9 ECS Fargate services | Tasks and deployments were healthy at acceptance time | One task per service; autoscaling not load-tested |
| Service networking | ECS Service Connect, `cloud-finance.local` namespace | Gateway called `auth:8000/health` and received HTTP 200 | No multi-Region service-mesh claim |
| Data | RDS PostgreSQL, ElastiCache Redis | RDS is private/encrypted; Redis is available and encrypted | Redis Multi-AZ/failover is not enabled in the demo |
| Delivery | ECR, GitHub Actions OIDC | Git-SHA image tags and a successful deployment workflow | No claim of complete automated rollback |

The states in this table are limited to the evidence-capture time. `Healthy` in the demo does not establish a production SLA or proven load capacity.

## Security groups

Create four security groups:

| Group | Inbound |
|---|---|
| cloud-finance-alb-sg | HTTP/HTTPS only from the CloudFront origin-facing managed prefix list |
| cloud-finance-ecs-sg | TCP 8000 from ALB SG and from itself |
| cloud-finance-rds-sg | TCP 5432 only from ECS SG |
| cloud-finance-redis-sg | TCP 6379 only from ECS SG |

Never allow 5432 or 6379 from 0.0.0.0/0.

## Verification commands

~~~powershell
aws ec2 describe-subnets --region $region --filters "Name=tag:Name,Values=cloud-finance-*" --query "Subnets[].{Name:Tags[?Key=='Name']|[0].Value,CIDR:CidrBlock,AZ:AvailabilityZone}" --output table
aws ec2 describe-route-tables --region $region --filters "Name=tag:Name,Values=cloud-finance-*" --output table
aws ec2 describe-security-groups --region $region --filters "Name=group-name,Values=cloud-finance-*" --output table
~~~

Expected result: application and data resources are not public; only CloudFront is the user-facing endpoint.


## Architecture decision analysis

### ALB instead of API Gateway

The project already contains a FastAPI/Socket.IO Gateway. Adding API Gateway would duplicate gateway responsibility and increase route/WebSocket complexity. ALB was selected to forward HTTP and WebSocket traffic to an IP target on ECS while CloudFront remains the only public application endpoint.

### Application Auth instead of Cognito

JWT, OTP, Google Sign-In, profile, and onboarding are implemented by Auth Service. Cognito is therefore not represented as a current dependency, although it remains a future identity migration option.

### ECS Fargate instead of Lambda for core/OCR workloads

OCR depends on Tesseract and system libraries, while the other services are long-running FastAPI or worker processes. Containers provide consistent dependencies and support WebSocket/worker behavior. Lambda would require a deliberate event-driven redesign.

### Redis/RQ instead of SQS

Notification code currently uses Redis and RQ. ElastiCache matches the implemented producer/consumer contract. SQS becomes valid only after retries, DLQ, producer, and consumer code are migrated.

### Gemini instead of Bedrock

The running AI and OCR code uses Gemini. Bedrock is documented only as a future migration option, keeping the architecture honest.

### One RDS instance with six logical databases

The demo balances domain ownership and cost through auth_db, finance_db, ai_db, notifications_db, planning_db, and recurring_db on one instance with separate URLs/credentials. Production can split physical instances for scale, compliance, or blast-radius requirements.

## Verified data flows

### REST flow

~~~text
Browser HTTPS
 -> CloudFront behavior /api/*
 -> ALB
 -> Gateway target port 8000
 -> Service Connect alias
 -> Domain service
 -> Logical PostgreSQL database
 -> Response returns along the same path
~~~

### WebSocket flow

~~~text
Browser WSS
 -> CloudFront /ws/*
 -> ALB
 -> Gateway Socket.IO
 -> Redis Pub/Sub or service event
 -> Gateway
 -> Browser
~~~

CloudFront behavior and the ALB idle timeout must accommodate long-lived connections. API and WebSocket traffic is not cached.

### Asynchronous notification flow

~~~text
Business service
 -> Notification API
 -> Persist to notifications_db
 -> Enqueue to Redis queue notifications
 -> Notification Worker consumes the job
 -> Amazon SES SMTP/TLS
 -> User email
~~~

The API does not wait for email delivery to finish, and the worker can retry independently.

### OCR flow

~~~text
Browser upload
 -> CloudFront/ALB/Gateway
 -> OCR Service
 -> Tesseract + Gemini parsing
 -> Finance Service / Finance DB metadata
 -> Transaction and receipt response
~~~

The S3 receipts bucket has been provisioned, but OCR read/write access through the ECS task role remains pending. The report keeps that distinction explicit rather than presenting the integration as complete.

### CI/CD flow

~~~text
Manual workflow_dispatch
 -> GitHub Actions
 -> OIDC AssumeRole
 -> Docker build
 -> ECR
 -> ECS task revision
 -> Rolling update
 -> Frontend build
 -> S3 sync
 -> CloudFront invalidation
~~~

The AWS deployment workflow is started manually with `workflow_dispatch`; push events run CI rather than deploying the AWS environment automatically.

## Well-Architected assessment

| Pillar | Demo implementation | Production improvement |
|---|---|---|
| Operational Excellence | Per-service logs, CI/CD, health checks | IaC, runbooks, deployment alarms |
| Security | Private subnets, SG references, OIDC, Secrets Manager | Rotation, audit, domain/DKIM |
| Reliability | ECS replacement and two app subnets | Multi-AZ data, ≥2 tasks, circuit breaker |
| Performance | CloudFront static caching and Redis | Autoscaling and load tests |
| Cost Optimization | One NAT, shared RDS, one task/service | Scheduling, rightsizing, VPC endpoints |
| Sustainability | Managed services and scale-to-zero | Metric-driven resource sizing |

## Verifiable connection matrix

| Source | Destination | Port/protocol | Control |
|---|---|---|---|
| User | CloudFront | 443 HTTPS/WSS | TLS + WAF |
| CloudFront | ALB | 80/443 | Managed prefix list |
| ALB | Gateway | 8000 HTTP | ALB SG → ECS SG |
| ECS | ECS | 8000 HTTP | ECS SG self-reference + Service Connect |
| ECS | RDS | 5432 PostgreSQL/TLS | ECS SG → RDS SG |
| ECS | Redis | 6379 TLS | ECS SG → Redis SG |
| ECS | Gemini | 443 HTTPS | Private route → NAT |
| Worker/Auth | SES | SMTP/TLS | NAT outbound + secret credential |
