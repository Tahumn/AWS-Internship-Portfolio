---
title: "Foundation, data services, and migrations"
date: 2026-08-01
weight: 1
chapter: false
pre: " <b> 5.4.1. </b> "
---

## Scope correction from the initial design

The first project sketch was useful for identifying domains, but it was not the final AWS deployment blueprint.

![Initial local architecture used during domain decomposition](/images/5-Workshop/KienTrucSoKhai.png)

It contains exploratory components such as Dify, n8n, and Kafka. They were removed from the deployed baseline because the current source does not require them. The final runtime uses FastAPI services, Redis/RQ for notification jobs, PostgreSQL logical databases, Gemini, Tesseract, and SMTP. Keeping this image as a historical artifact shows that architecture decisions were validated against executable code rather than copied unchanged into AWS.

## Network foundation

The VPC `10.0.0.0/16` was divided into three tiers across `ap-southeast-1a` and `ap-southeast-1b`:

| Tier | AZ A | AZ B | Purpose |
|---|---|---|---|
| Public | `10.0.1.0/24` | `10.0.2.0/24` | ALB and demo NAT Gateway |
| Private application | `10.0.11.0/24` | `10.0.12.0/24` | Fargate task ENIs |
| Private data | `10.0.21.0/24` | `10.0.22.0/24` | RDS and ElastiCache |

Only public subnets route directly to the Internet Gateway. Private application subnets use one NAT Gateway for ECR pulls and outbound calls to Gemini/SES. Private data subnets have no Internet default route. One NAT reduces demo cost but is a single-AZ outbound dependency; production should use one NAT per AZ.

Four security groups implement reference-based rules: ALB to ECS on TCP 8000, ECS self-reference on 8000, ECS to PostgreSQL on 5432, and ECS to Redis on 6379. Referencing security groups instead of task IPs is necessary because Fargate uses `awsvpc` and task ENIs change during replacement.

## Stateful services

RDS PostgreSQL 16.13 was deployed as encrypted, non-public `db.t4g.micro` with 20 GiB gp3. The demo uses one instance and six logical databases—`auth_db`, `finance_db`, `ai_db`, `notifications_db`, `planning_db`, and `recurring_db`. This is logical database ownership, not six physical RDS instances. The choice preserves service boundaries while controlling internship-demo cost; independent instances remain a scaling and isolation option.

![RDS PostgreSQL metrics from the deployed instance](/images/5-Workshop/rds.png)

ElastiCache Redis provides the RQ queue consumed by Notification Worker and can also support cache/pub-sub use cases. The demo uses a single primary; production requires a replication group, Multi-AZ, and automatic failover.

## Secrets and controlled migrations

Application, database, Redis, Gemini, and SMTP configuration were stored outside images and Git. The source includes Alembic migrations at service startup; in AWS, after controlled migrations complete, long-running services must use `SKIP_MIGRATIONS=true` so rolling deployments do not run concurrent DDL. A short-lived bootstrap task creates logical databases, and a dedicated migration task runs Alembic sequentially for each scope.

~~~powershell
aws ecs run-task `
  --cluster cloud-finance-cluster `
  --launch-type FARGATE `
  --task-definition cloud-finance-db-migration `
  --network-configuration "awsvpcConfiguration={subnets=[PRIVATE_APP_A,PRIVATE_APP_B],securityGroups=[ECS_SG],assignPublicIp=DISABLED}" `
  --overrides file://ecs/migration-overrides.json `
  --region ap-southeast-1
~~~

Each run must stop with exit code `0` before moving to the next database. Sequential migration was selected because the demo database is small and parallel DDL would add lock and CPU contention. After completion, `SKIP_MIGRATIONS=true` prevents rolling deployments from racing on the same schema.

**Checkpoint:** RDS is `available`, encrypted, and non-public; Redis is reachable only from ECS; six migration scopes complete with exit code zero; no secret value appears in logs or screenshots.
