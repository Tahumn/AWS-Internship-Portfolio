---
title: "Overview"
date: 2026-08-01
weight: 1
chapter: false
pre: " <b> 5.1. </b> "
---

## Business problem

Cloud Finance Platform helps users record income and expenses, manage budgets and savings goals, schedule recurring transactions, scan receipts, receive notifications, and interact with a Vietnamese AI assistant. The deployment must expose one secure web endpoint while keeping application services and data stores private.

## Workshop objectives

After completing this workshop, you can:

- Explain the current demo architecture and its production targets.
- Deploy a private React SPA with S3, CloudFront, OAC, and WAF.
- Deploy nine container workloads to ECS Fargate.
- Route REST and WebSocket traffic through CloudFront, ALB, and the Gateway service.
- Use Service Connect/Cloud Map for service-to-service discovery.
- Use RDS PostgreSQL logical databases and Redis/RQ.
- Inject secrets securely and send transactional email through SES.
- Build and deploy through GitHub Actions OIDC.
- Verify logs, metrics, health checks, alerts, and application functions.
- Estimate costs and safely clean up resources.

## Services and reasons for selection

| Service | Purpose | Selection reason |
|---|---|---|
| CloudFront + WAF | Global delivery and edge protection | HTTPS, caching, SPA/API behaviors, managed security rules |
| S3 | Private React SPA origin | Durable, inexpensive static hosting with OAC |
| ALB | REST and WebSocket origin | Native ECS integration and long-lived WebSocket support |
| ECS Fargate + ECR | Run and store containers | No EC2 host management; independent service deployment |
| Service Connect / Cloud Map | Internal discovery | Stable service names and private communication |
| RDS PostgreSQL | Transactional data | Managed backup, encryption, and relational consistency |
| ElastiCache for Redis | Queue, cache, Pub/Sub | Supports RQ notification producer/worker pattern |
| Secrets Manager + KMS | Runtime secrets | Keeps passwords and API keys outside Git and images |
| CloudWatch | Logs, metrics, alarms | Centralized operational evidence |
| SES | OTP and notifications | Managed transactional email service |
| NAT Gateway | Controlled outbound access | Gemini, SES SMTP, and required public endpoints |
| GitHub Actions OIDC | CI/CD | Temporary AWS credentials without long-lived access keys |

## Demo scope and production target

The cost-optimized demo uses one NAT Gateway, Single-AZ RDS, and one Redis primary. ECS tasks are distributed across two application subnets. Production should use one NAT Gateway per AZ, Multi-AZ RDS, Redis automatic failover, autoscaling, deletion protection, tested recovery, and a custom domain in Route 53.

![Cloud Finance AWS architecture](/images/5-Workshop/5.1-Workshop-overview/ArchitechtureFinal.drawio.png)


## Work completed in the deployed environment

This is not only a proposed architecture. The team deployed and tested a working demo in **Asia Pacific (Singapore) – ap-southeast-1**. The application is available at:

**https://d29kxn0rxd6abn.cloudfront.net**

| Resource group | Deployed resources |
|---|---|
| Network | cloud-finance-vpc, 2 public, 2 private application, and 2 private database subnets |
| Containers | cloud-finance-cluster with 9 ECS Fargate services |
| Registry | ECR repository cloud-finance-backend |
| Database | cloud-finance-postgres with 6 logical databases |
| Queue/cache | ElastiCache for Redis for RQ and caching |
| Entry point | CloudFront, WAF, ALB, and cloud-finance-gateway-tg |
| Frontend | Private S3 bucket accessed through CloudFront OAC |
| Security | 4 security groups, Secrets Manager, KMS, and IAM roles |
| Operations | Per-service CloudWatch logs, health checks, and AWS Budgets |
| Delivery | GitHub Actions OIDC, ECR push, and ECS rolling deployment |
| Integration | Google Gemini API and Amazon SES over SMTP/TLS |

## Microservice responsibilities

| Service | Main responsibility | Data/dependency |
|---|---|---|
| Gateway | REST/WebSocket entry and reverse proxy | ALB, Service Connect |
| Auth | JWT, OTP, Google Sign-In, onboarding | auth_db, SES |
| Finance | Transactions, accounts, categories, budgets, goals | finance_db |
| AI Agent | Vietnamese chat, multi-transaction extraction, reports | ai_db, Gemini |
| Notification API | Persist notifications and enqueue jobs | notifications_db, Redis |
| Notification Worker | Consume RQ jobs and send email | Redis, SES |
| Planning | Financial plans and suggestions | planning_db |
| Recurring | Recurring transaction rules | recurring_db |
| OCR | Tesseract + Gemini receipt extraction | Finance DB metadata; S3 integration pending |

## Completion criteria

The environment is considered complete only when all of the following hold:

1. CloudFront serves the React frontend over HTTPS.
2. `/api/v1` requests traverse CloudFront, ALB, and Gateway.
3. Gateway resolves service names through Service Connect.
4. All nine ECS services show `Running=1` and `Pending=0`.
5. The Gateway target is healthy in the ALB target group.
6. RDS and Redis are not publicly accessible.
7. Sign-in, transactions, AI, OCR, budgets, goals, and notifications work.
8. GitHub Actions can build and update the environment without stored long-lived AWS access keys.
9. CloudWatch contains per-service logs and AWS Budgets provides cost alerts.

## Research and implementation methodology

The project followed a **research – design – experiment – deploy – measure – improve** approach instead of provisioning the complete AWS stack at once.

### Phase 1 — Code and domain-boundary analysis

The team started from the working local codebase and identified nine independent processes, startup commands, ports, databases, and dependencies. This kept the architecture code-aligned and prevented unsupported baseline components such as API Gateway, Cognito, Lambda OCR, SQS, or MSK from appearing as deployed dependencies.

The team answered these concrete questions before drawing the architecture:

- Does the client call one Gateway or each service directly?
- Where does the WebSocket connection terminate?
- Is authentication application-owned or delegated to Cognito?
- Is OCR an event-driven Lambda function or a long-running container?
- Do notifications use SQS or Redis/RQ?
- Does AI use Bedrock or Gemini?
- Does each service require a physical database, or are logical databases sufficient?
- Which resources require Multi-AZ, and which can be reduced for the demo?

### Phase 2 — Local validation and dependency mapping

Docker Compose was used to run the frontend, PostgreSQL, Redis, and microservices. Health endpoints, migrations, service URLs, and business flows were validated before mapping them to AWS.

The resulting dependency map was:

```text
Browser
  -> Gateway
      -> Auth
      -> Finance
      -> AI -> Gemini
      -> OCR -> Tesseract/Gemini -> Finance
      -> Planning
      -> Recurring
      -> Notifications API -> Redis/RQ -> Worker -> SMTP
```

### Phase 3 — Private-by-default AWS design

The architecture was divided into edge, ingress/application, data, and operations/delivery layers. Every diagram connection had to map to a route, security-group rule, IAM permission, or application configuration that could be verified.

The four layers were:

1. **Edge:** CloudFront, WAF, and S3.
2. **Ingress/Application:** ALB, ECS Fargate, and Service Connect.
3. **Data:** RDS PostgreSQL and ElastiCache in private subnets.
4. **Operations/Delivery:** CloudWatch, Secrets Manager, ECR, and GitHub Actions OIDC.

### Phase 4 — Checkpoint-based deployment

The team progressed through network, security groups, ECR, databases, migrations, ECS health, Service Connect, ALB health, CloudFront routing, and CI/CD checkpoints. A new layer was introduced only after the previous layer had a measurable success condition.

The checkpoints were explicit:

1. VPC, subnets, and routes are correct.
2. Security groups allow only the intended paths.
3. ECR contains the image.
4. RDS and Redis are `Available`.
5. Migration exits with `ExitCode=0`.
6. Each ECS service is healthy.
7. Service Connect resolves private DNS names.
8. The ALB target is healthy.
9. CloudFront serves the frontend and API.
10. CI/CD can redeploy successfully.

### Phase 5 — Observation and improvement

CloudWatch logs, ECS events, task stop reasons, target health, and HTTP responses were used for root-cause analysis. For each incident, the team recorded the symptom, hypothesis, diagnostic command, root cause, and final correction.

This approach developed practical understanding across application code, containers, networking, IAM, data, observability, delivery, and cost—not only a working website.

## Learning outcomes

The team did more than publish a working website. The implementation connected application code with containers, networking, IAM, data, observability, delivery, and cost. That experience also made the boundary between a **cost-controlled demo environment** and a **high-availability production target** explicit.

## Deployed application evidence

The following screen is the public entry point served from the CloudFront domain used by the demo. It verifies more than the frontend layout: the browser receives the SPA through CloudFront over HTTPS, the private S3 origin is reachable through the configured origin access control, and the Google Sign-In component is initialized with the production frontend configuration.

![Finanzy login page served through CloudFront](/images/5-Workshop/WEPTrienKhai.png)

The login page is therefore used as the first end-to-end checkpoint. If the HTML is returned but JavaScript assets are served as `text/html`, the screen becomes blank; if the API behavior is incorrect, authentication requests fail. A usable page at the CloudFront domain confirms that the static delivery path and browser-side configuration are operating together.
