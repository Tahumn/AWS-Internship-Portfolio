---
title: "Prerequisites"
date: 2026-08-01
weight: 2
chapter: false
pre: " <b> 5.2. </b> "
---

## Required accounts and tools

- AWS account with access to ap-southeast-1.
- GitHub account and repository fork/clone.
- AWS CLI v2, Git, Docker Desktop, Python 3.11, Node.js 20+, and npm.
- Session Manager plugin for ECS Exec diagnostics.
- Google OAuth client and Gemini API key.
- A verified SES email identity; sandbox recipients must also be verified.

Run:

~~~powershell
aws --version
docker --version
node --version
npm --version
aws sts get-caller-identity
aws configure get region
~~~

Set the workshop region:

~~~powershell
$region = "ap-southeast-1"
$env:AWS_REGION = $region
~~~

## Repository and application

~~~powershell
git clone https://github.com/Tahumn/cloud-finance-platform.git
Set-Location cloud-finance-platform
Copy-Item .env.example .env
docker compose --profile micro up -d --build
docker compose ps
~~~

Never commit .env, database passwords, SMTP credentials, JWT secrets, or Gemini keys.

## AWS permissions

For learning, an administrator can perform the first deployment. For a production-quality submission, create separate identities:

- Human administrator with MFA.
- ecsTaskExecutionRole for image pull, logs, and secret injection.
- Application task role for only the AWS APIs required by the code.
- CloudFinanceGitHubActionsRole assumed through GitHub OIDC.

The GitHub OIDC trust policy must restrict the repository and production environment. Do not store AWS access keys in GitHub.

## Cost guardrail

Before provisioning:

1. Open **Billing and Cost Management → Budgets → Create budget**.
2. Select **Cost budget → Monthly**.
3. Name it cloud-finance-monthly-budget.
4. Enter your limit and create alerts at 50%, 80%, and 100%.
5. Confirm the notification email.

## Initial implementation state

Before AWS deployment, the team prepared a monorepo containing FastAPI services, a React/Vite frontend, Dockerfile, Docker Compose, Alembic migrations, and GitHub Actions workflows. Nine local container workloads were built and tested before images were pushed to ECR.

| Property | Value |
|---|---|
| AWS Region | ap-southeast-1 |
| VPC CIDR | 10.0.0.0/16 |
| ECS cluster | cloud-finance-cluster |
| ECR repository | cloud-finance-backend |
| Frontend bucket | cloud-finance-frontend-347412228908 |
| CloudFront distribution | E36WAN2GEDWN5C |
| Demo URL | https://d29kxn0rxd6abn.cloudfront.net |
| Runtime | Python 3.11, FastAPI, React 18, Node.js 20 |
| Database | PostgreSQL 16 |
| Container port | 8000 |

Three pre-deployment checks were performed: source secret scanning and gitignore review, local Docker/frontend/API validation, and AWS identity/Region verification. These checks prevented deployment to the wrong account, localhost API builds, and missing image errors.