---
title: "Proposal"
date: 2026-06-22
weight: 2
chapter: false
pre: " <b> 2. </b> "
---

# Cloud Finance Platform
## An Intelligent Personal Finance Management Platform on AWS

### 1. Executive Summary

Cloud Finance Platform is a personal finance management platform designed to help users manage income, expenses, financial accounts, budgets, bills, savings goals, and recurring transactions through a centralized system.

In addition to conventional finance management capabilities, the platform integrates artificial intelligence to support natural-language transaction entry, income and expense classification, financial analysis, and personalized recommendations. Its OCR capability extracts structured information from receipt images and reduces manual data entry.

The platform follows a microservices architecture and is deployed on Amazon Web Services. The backend consists of nine independently operated services running on Amazon ECS with AWS Fargate. The frontend is stored in Amazon S3 and distributed through Amazon CloudFront. Business data is stored in Amazon RDS for PostgreSQL, Redis provides a notification processing queue, and Amazon SES supports OTP and transactional email delivery.

The project aims to deliver a secure, observable, maintainable, and deployable cloud application with automated CI/CD and a clear path from a cost-optimized demonstration environment to a production architecture.

{{% notice info %}}
**Document status:** this proposal was prepared before deployment and updated afterward to match the system that was actually built. The expected outcomes remain the evaluation criteria, while Section 5 – Workshop presents the corresponding acceptance evidence.
{{% /notice %}}

### 2. Problem Statement

#### What Is the Problem?

Users commonly manage personal finances using notebooks, spreadsheets, or multiple independent applications. These methods introduce several limitations:

- Financial information is distributed across multiple sources.
- Transactions must be entered manually.
- Budgets and savings goals are difficult to monitor.
- Unusual spending patterns are difficult to identify.
- Paper receipts and receipt images are not centrally managed.
- Recurring transactions may be forgotten or recorded late.
- Financial reports lack visualization and intelligent analysis.
- Users receive limited guidance based on their personal financial data.

#### Proposed Solution

Cloud Finance Platform provides a unified solution with the following capabilities:

- User registration, login, and authentication.
- Sign-in with Google.
- Financial account and funding-source management.
- Income and expense transaction management.
- Transaction categorization.
- Budget creation and monitoring.
- Savings-goal management.
- Recurring transaction management.
- Receipt recognition using OCR.
- Transaction creation from extracted receipt data.
- Natural-language interaction with an AI assistant.
- Financial analysis and personalized recommendations.
- OTP and transactional email delivery.
- Interactive dashboards and reports.

The platform uses a microservices architecture to divide the system into independently deployable components. Each service has a clearly defined business responsibility and can be monitored and updated separately.

#### Benefits and Return on Investment

The solution provides the following benefits:

- Centralized management of personal finance data.
- Reduced manual data entry through AI and OCR.
- Improved expense and budget control.
- Better support for financial planning.
- Automated handling of recurring transactions.
- A scalable and maintainable architecture.
- Improved security using IAM, Security Groups, AWS WAF, and Secrets Manager.
- Automated build and deployment through GitHub Actions.
- Centralized logs and monitoring through Amazon CloudWatch.

As an academic internship project, its value is not measured primarily by direct financial return. Its principal value is the practical application of software engineering, microservices, containers, DevOps, security, database management, and cloud deployment in a complete working system.

#### Proposed Scope

| In scope | Outside the initial scope |
|---|---|
| Responsive web application, 9 ECS services, and one Gateway | Native mobile application and multi-Region deployment |
| One RDS instance with 6 logical databases | Database-per-service using separate physical RDS instances |
| Redis/RQ queue and worker | Migration to SQS/DLQ |
| Gemini and Tesseract for AI/OCR | Production migration to Amazon Bedrock |
| SES delivery to verified identities | Unrestricted-recipient SES Production Access |
| Private S3 origin for the frontend | Automatic OCR receipt-object persistence in S3 |
| One task for each ECS service | Autoscaling and a load-tested HA architecture |

Items outside the initial scope remain possible extensions and are not presented as deployed or accepted components.

### 3. Solution Architecture

Cloud Finance Platform is deployed within a single AWS Region. The network uses an Amazon VPC containing public, private application, and private database subnets distributed across two Availability Zones.

Users access the frontend through Amazon CloudFront. The frontend is a single-page application stored in a private Amazon S3 bucket. CloudFront accesses the bucket through Origin Access Control.

API and WebSocket requests are forwarded by CloudFront to an Application Load Balancer. The ALB forwards traffic to the Gateway Service running on Amazon ECS with AWS Fargate. The Gateway Service accepts client requests and routes them to internal microservices through Amazon ECS Service Connect and AWS Cloud Map.

The backend consists of nine services:

1. Gateway Service.
2. Auth Service.
3. Finance Service.
4. AI Agent Service.
5. Notification API.
6. Notification Worker.
7. Planning Service.
8. Recurring Service.
9. OCR Service.

Amazon RDS for PostgreSQL is used as the relational data store. The demonstration environment uses one RDS instance containing six logical databases:

- Auth DB.
- Finance DB.
- AI DB.
- Notification DB.
- Planning DB.
- Recurring DB.

This model provides logical data ownership for each service while controlling the cost of the demonstration environment. In production, logical databases can be separated into independent RDS instances when stronger performance, security, isolation, or scalability is required.

Amazon ElastiCache for Redis provides the processing queue between the Notification API and Notification Worker. AWS Secrets Manager stores sensitive configuration. Amazon CloudWatch collects logs and metrics. Amazon SES delivers OTP and transactional emails. The AI Agent and OCR Service communicate with the Gemini API through outbound connectivity provided by the NAT Gateway.

{{< figure
    src="/images/5-Workshop/5.1-Workshop-overview/ArchitechtureFinal.drawio.png"
    title="Cloud Finance Platform - AWS Deployable Architecture"
>}}

#### AWS Services Used

- **Amazon VPC**: Isolates and organizes network resources.
- **Public Subnets**: Host the Application Load Balancer and NAT Gateway.
- **Private Application Subnets**: Host ECS Fargate tasks.
- **Private Database Subnets**: Host Amazon RDS and Redis.
- **Internet Gateway**: Provides Internet connectivity for public subnets.
- **NAT Gateway**: Provides outbound Internet connectivity for private ECS tasks.
- **Application Load Balancer**: Routes client traffic to the Gateway Service.
- **Amazon ECS on AWS Fargate**: Runs backend microservices as containers.
- **Amazon ECS Service Connect**: Provides internal service communication and discovery.
- **AWS Cloud Map**: Provides the namespace used for service discovery.
- **Amazon ECR**: Stores backend Docker images.
- **Amazon RDS for PostgreSQL**: Stores relational business data.
- **Amazon ElastiCache for Redis**: Supports queues, caching, and pub/sub.
- **Amazon S3**: Stores frontend assets and prepares storage for receipts and exports.
- **Amazon CloudFront**: Distributes the frontend and forwards backend requests.
- **AWS WAF**: Protects CloudFront from invalid and malicious requests.
- **AWS Secrets Manager**: Stores database, SMTP, and external API credentials.
- **Amazon CloudWatch**: Collects logs, metrics, and operational information.
- **Amazon SES**: Sends OTP and transactional emails.
- **AWS IAM**: Controls access for users, ECS tasks, and GitHub Actions.

#### Component Design

- **Frontend**: Provides dashboards, transactions, budgets, reports, goals, receipts, and chatbot interfaces.
- **Gateway Service**: Acts as the backend entry point for REST and WebSocket traffic.
- **Auth Service**: Manages users, JWT authentication, OTP, Google sign-in, and onboarding.
- **Finance Service**: Manages accounts, categories, transactions, budgets, goals, and receipt metadata.
- **AI Agent Service**: Interprets natural-language requests and assists users with financial management.
- **Notification API**: Accepts notification requests and enqueues jobs in Redis.
- **Notification Worker**: Consumes Redis jobs and sends notifications or emails.
- **Planning Service**: Manages financial plans and recommendations.
- **Recurring Service**: Manages recurring income and expense schedules.
- **OCR Service**: Extracts receipt information and transfers structured data to the Finance Service.

### 4. Technical Implementation

#### Implementation Phases

The project is implemented through the following phases:

1. **Research and requirements analysis**
   - Study AWS, cloud computing, and microservices.
   - Analyze system requirements.
   - Identify services and data flows.

2. **System design**
   - Design the application architecture.
   - Design the AWS deployment architecture.
   - Design the ERD and logical database model.
   - Evaluate Lambda, API Gateway, DynamoDB, and ECS Fargate.
   - Select ECS Fargate, ALB, and RDS PostgreSQL.

3. **Application development**
   - Develop the frontend.
   - Develop the Gateway and backend microservices.
   - Integrate Gemini, OCR, Redis, and email delivery.
   - Test the system locally using Docker Compose.

4. **AWS infrastructure deployment**
   - Create the VPC, subnets, route tables, and Security Groups.
   - Create the ECR repository and push Docker images.
   - Provision RDS, Redis, and Secrets Manager.
   - Run database migrations.
   - Deploy services to ECS Fargate.
   - Configure ECS Service Connect.

5. **Frontend and traffic delivery**
   - Deploy the frontend to Amazon S3.
   - Configure Amazon CloudFront.
   - Create the ALB and target group.
   - Connect CloudFront to the ALB.
   - Configure AWS WAF.

6. **CI/CD and monitoring**
   - Configure GitHub Actions OIDC.
   - Build and push backend images using Git commit SHA tags.
   - Update ECS services.
   - Build and upload the frontend to S3.
   - Invalidate the CloudFront cache.
   - Monitor the system using CloudWatch.

7. **Testing and completion**
   - Perform end-to-end testing.
   - Test responsive behavior.
   - Test authentication, AI, OCR, and notifications.
   - Review security and operating costs.
   - Complete documentation and the demonstration video.

#### Technical Requirements

- **Frontend**: React, Vite, JavaScript/JSX, and responsive web design.
- **Backend**: Python, FastAPI, Uvicorn, and Socket.IO.
- **Database**: PostgreSQL and Alembic migrations.
- **Queue and cache**: Redis and RQ Worker.
- **Artificial intelligence**: Google Gemini API.
- **OCR**: Tesseract OCR with data extraction and normalization.
- **Containers**: Docker and Docker Compose.
- **AWS**: VPC, ECS Fargate, ECR, RDS, ElastiCache, S3, CloudFront, ALB, WAF, SES, Secrets Manager, and CloudWatch.
- **CI/CD**: GitHub Actions and OpenID Connect.
- **Source control**: Git and GitHub.

### 5. Timeline and Milestones

#### Week 1 – Foundations and Tools

- Install Git, GitHub, Visual Studio Code, and Hugo.
- Study AWS fundamentals.
- Learn draw.io and AWS Architecture Icons.
- Initialize the Worklog and Portfolio.

#### Week 2 – Fundamental AWS Services

- Study IAM, MFA, VPC, EC2, S3, and AWS Budgets.
- Practice AWS resource management.
- Initialize the project and repository.

#### Week 3 – Analysis and Design

- Analyze business requirements.
- Design the microservices and database architecture.
- Study Lambda, API Gateway, and DynamoDB.
- Select ECS Fargate, ALB, and RDS PostgreSQL.

#### Week 4 – Application Development

- Develop the frontend and backend.
- Integrate AI, OCR, and notifications.
- Complete the Docker Compose environment.
- Test the system locally.

#### Week 5 – Network Infrastructure and ECR

- Deploy a VPC containing six subnets.
- Configure route tables, the NAT Gateway, and Security Groups.
- Build and push Docker images to Amazon ECR.

#### Week 6 – Data Layer and ECS Fargate

- Deploy RDS PostgreSQL with six logical databases.
- Deploy Redis and Secrets Manager.
- Execute Alembic migrations.
- Deploy nine services on ECS Fargate.
- Configure ECS Service Connect.

#### Week 7 – Delivery, Security, and CI/CD

- Deploy ALB, S3, CloudFront, and AWS WAF.
- Configure Amazon SES and CloudWatch.
- Configure GitHub Actions OIDC.
- Automate backend and frontend deployment.

#### Week 8 – Testing and Reporting

- Test the complete system.
- Review security and operating costs.
- Complete the architecture and technical documentation.
- Record the demonstration video.
- Complete the Worklog, Portfolio, and internship report.

### 6. Budget Estimation

The estimate was prepared in August 2026 for the demonstration environment in AWS Asia Pacific (Singapore) — `ap-southeast-1`. It assumes approximately 730 operating hours per month, one running task per ECS service, and low traffic. These figures are proposal planning ranges rather than a Cost Explorer bill; taxes, credits, Free Tier benefits, exchange-rate movements, and AWS price changes are excluded.

| AWS Service | Demonstration Configuration | Estimated Monthly Cost |
|---|---|---:|
| Amazon ECS on AWS Fargate | 9 services, one task per service, using small CPU and memory configurations | USD 100–115 |
| Amazon RDS for PostgreSQL | One `db.t4g.micro` Single-AZ instance with 20 GiB gp3 storage and 6 logical databases | USD 18–25 |
| Amazon ElastiCache for Redis | One Redis node without Multi-AZ enabled in the demonstration environment | USD 15–22 |
| NAT Gateway | One NAT Gateway with low outbound data processing | USD 35–45 |
| Application Load Balancer | One ALB, one target group, and low traffic | USD 20–28 |
| Amazon S3 | Frontend SPA bucket and receipts/exports bucket with low storage usage | USD 1–3 |
| Amazon CloudFront | Frontend distribution and API forwarding with demonstration-level traffic | USD 1–5 |
| Amazon ECR | Storage for the backend Docker image and multiple image versions | USD 1–4 |
| AWS Secrets Manager | Secrets for databases, Gemini, Redis, and SMTP | USD 2–5 |
| Amazon CloudWatch | ECS log groups, metrics, and a 14-day log retention period | USD 3–10 |
| AWS WAF | One Web ACL, managed rules, and a low number of requests | USD 6–12 |
| Amazon SES | OTP and notification emails with a low testing volume | Less than USD 1 |
| AWS IAM, Security Groups, and AWS Budgets | No direct service charges | USD 0 |
| **Estimated Total** | **Demonstration environment operating continuously** | **Approximately USD 202–275/month** |

Using a reference exchange rate of `USD 1 ≈ VND 25,000`, the estimated continuous operating cost is approximately:

- **VND 5,050,000–6,875,000 per month**.
- **VND 168,000–229,000 per day**.

This estimate assumes that all hourly billed resources remain active continuously. The actual cost may be lower or higher depending on the CPU and memory configuration of each ECS task, log volume, data processed through the NAT Gateway, number of requests, storage usage, and resource operating time.

#### Cost Optimization

The following measures are applied to control costs:

- Use one NAT Gateway instead of one NAT Gateway per Availability Zone.
- Use one RDS PostgreSQL instance containing six logical databases.
- Use a Single-AZ RDS deployment instead of Multi-AZ.
- Use one Redis node without automatic failover.
- Maintain `desiredCount = 1` for each ECS Service.
- Limit CloudWatch Logs retention to 14 days.
- Use one shared backend Docker image for all nine ECS Services.
- Retain only necessary Docker image versions in Amazon ECR.
- Configure AWS Budgets and cost alerts.
- Reduce the ECS Service `desiredCount` to `0` when the backend is not required.
- Delete the NAT Gateway and release its Elastic IP during extended periods when the demonstration environment is not required.
- Delete the ALB, Redis, and RDS resources after completing the project if they are no longer required.
- Create an RDS snapshot before deleting the database when data must be retained.

#### Main Cost Components

- **Amazon ECS Fargate**: CPU and memory consumption of nine services.
- **Amazon RDS for PostgreSQL**: Instance, storage, and backup costs.
- **Amazon ElastiCache for Redis**: Cache node operating costs.
- **NAT Gateway**: Hourly and data processing costs.
- **Application Load Balancer**: Hourly and Load Balancer Capacity Unit costs.
- **Amazon CloudFront**: Request and data transfer costs.
- **Amazon S3**: Storage and request costs.
- **Amazon ECR**: Docker image storage costs.
- **AWS Secrets Manager**: Secret and API request costs.
- **Amazon CloudWatch**: Log storage, metrics, and alarm costs.
- **Amazon SES**: Email delivery costs.
- **AWS WAF**: Web ACL, rule, and request costs.

The demonstration environment reduces costs by using:

- One NAT Gateway instead of one NAT Gateway per Availability Zone.
- One RDS instance containing six logical databases.
- Single-AZ RDS for the demonstration environment.
- A single-node Redis deployment.
- `desiredCount = 1` for each ECS service.
- Limited CloudWatch log retention.
- AWS Budgets and cost alerts.
- Resource shutdown or removal after the demonstration period.

### 7. Risk Assessment

#### Risk Matrix

| Risk | Probability | Impact | Status at report time | Primary response |
|---|---|---|---|---|
| AWS cost exceeds the estimate | Medium | High | Under active control | AWS Budgets, limited log retention, and a resource-cleanup procedure |
| ECS task fails to start | Medium | High | Previously encountered | Health checks, ECS events, stopped reasons, and CloudWatch logs |
| Microservice communication fails | Medium | High | Gateway → Auth path tested | Service Connect, SG self-reference, and health endpoints |
| Database migration fails | Medium | High | Controlled process established | Separate task and `ExitCode=0` validation before rollout |
| Sensitive information is exposed | Low | Very high | No incident recorded | Secrets Manager, OIDC, and no committed `.env` |
| Gemini API/model changes | Medium | Medium | External risk remains | Secret-based model configuration and replacement plan |
| SES Sandbox restricts recipients | High | Medium | Present in the demo | Verified identities and Production Access request when needed |
| Outbound traffic depends on one NAT Gateway in one AZ | Low | High | Accepted to control demo cost | One NAT Gateway per AZ in production |
| S3 Receipts/Exports integration is incomplete | Present | Medium | Pending | Complete the ECS task role and application object flow |

#### Mitigation Strategies

- Configure AWS Budgets and review costs regularly.
- Use ECS and ALB health checks.
- Use Service Connect for internal service discovery.
- Run database migrations separately and validate exit codes.
- Store sensitive values in AWS Secrets Manager.
- Avoid long-lived AWS Access Keys in GitHub.
- Authenticate GitHub Actions through OIDC.
- Tag Docker images with Git commit SHA for rollback.
- Monitor logs and metrics through CloudWatch.
- Use verified email identities while SES remains in Sandbox.
- Prepare to update the Gemini model when a model is deprecated.

#### Contingency Plans

- Roll back an ECS service to a previous task definition or image.
- Set the service `desiredCount` to zero when temporarily stopping Fargate workloads.
- Restore the database from an RDS snapshot when necessary.
- Allow manual transaction entry when AI or OCR is temporarily unavailable.
- Use verified identities while waiting for SES Production Access.
- Separate logical databases into independent RDS instances when stronger production isolation is required.

### 8. Expected Outcomes

#### Technical Outcomes

| Proposed outcome | Final status | Verification method |
|---|---|---|
| Personal finance platform operating on AWS | Deployed in the demo environment | CloudFront URL and business acceptance tests |
| 9 microservices on ECS Fargate | Deployed and verified | ECS Services, task health, and CloudWatch |
| Internal communication through Service Connect | Gateway → Auth verified | ECS Exec returned HTTP 200 from `auth:8000/health` |
| Frontend on private S3 and CloudFront | Deployed | OAC, CloudFront origins, and login page |
| RDS PostgreSQL and Redis | Deployed | RDS metrics and ElastiCache overview |
| AI Agent, Gemini, and OCR | Tested in demo scenarios | AI and OCR results in the Workshop |
| OTP and email through SES | Tested within Sandbox limits | Delivery evidence for a verified identity |
| Monitoring through CloudWatch | Core monitoring in place | Log groups and Gateway health log |
| WAF, IAM, and Security Groups | Core controls configured | Web ACL, role/policy, and connection matrix |
| CI/CD through GitHub Actions OIDC | Deployed | Workflow run, Git-SHA ECR tag, and ECS revision |
| Responsive interface | Basic behavior tested | Desktop/mobile browser checks; not a complete accessibility audit |
| Automatic OCR receipt-object persistence in S3 | Not complete | Bucket provisioned; application code integration remains unfinished |

`Deployed` means that the resource exists in the demo environment. `Verified` is used only when the Workshop contains a corresponding test or evidence. Neither term implies a production SLA, high availability, or proven load capacity.

#### Long-Term Value

- A clear migration path from demonstration to production.
- Support for Multi-AZ RDS and Redis.
- Support for one NAT Gateway per Availability Zone.
- Support for ECS Service Auto Scaling.
- Ability to separate logical databases into independent RDS instances.
- Ability to migrate from Gemini to Amazon Bedrock or another AI provider.
- Future completion of S3 Receipts/Exports and Presigned URL workflows.
- Potential expansion into a broader financial management product.
