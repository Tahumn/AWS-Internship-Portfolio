---
title: "End-to-end deployment"
date: 2026-08-01
weight: 4
chapter: false
pre: " <b> 5.4. </b> "
---

This chapter records the deployment sequence actually used for Cloud Finance in `ap-southeast-1`. It is organized around checkpoints rather than a list of console clicks: each layer is created, verified, and only then used by the next layer. This approach was important because the system contains nine independently deployed workloads and several stateful dependencies; deploying everything at once would make network, secret, migration, and application failures difficult to distinguish.

The implementation is divided into three reproducible stages:

1. [Foundation, data services, and migrations](5.4.1-foundation-data/): VPC tiers, security groups, NAT, RDS, Redis, Secrets Manager, bootstrap, and Alembic migrations.
2. [ECS, Service Connect, and edge delivery](5.4.2-runtime-edge/): nine Fargate services, private service discovery, ALB, CloudFront, WAF, and SES/Gemini integration.
3. [CI/CD and deployment verification](5.4.3-cicd-verification/): GitHub OIDC, immutable ECR tags, task revisions, frontend publishing, and end-to-end checkpoints.

{{% notice info %}}
The screenshots in this chapter were captured from the implemented demo. The demo intentionally uses one NAT Gateway, Single-AZ RDS, and a single Redis primary to control cost. Multi-AZ data services, one NAT per AZ, and service autoscaling are production targets, not claims about the current environment.
{{% /notice %}}
