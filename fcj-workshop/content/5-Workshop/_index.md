---
title: "Workshop"
date: 2026-08-01
weight: 5
chapter: false
pre: " <b> 5. </b> "
---

# Deploying a Cloud-Native Personal Finance Platform on AWS

This workshop guides you through an end-to-end deployment of **Cloud Finance Platform (Finanzy)**, a practical personal-finance application built with React, FastAPI microservices, PostgreSQL, Redis, OCR, and Google Gemini.

The workshop demonstrates architecture design, secure networking, container deployment, CI/CD, testing, observability, cost optimization, and cleanup with CloudFront, WAF, S3, ALB, ECS Fargate, ECR, RDS, ElastiCache, Secrets Manager, CloudWatch, and SES.

## Workshop content

1. [Overview](5.1-Workshop-overview/)
2. [Prerequisites](5.2-Prerequiste/)
3. [Architecture and networking](5.3-S3-vpc/)
4. [End-to-end deployment](5.4-S3-onprem/)
5. [Testing, monitoring, security, and cost](5.5-Policy/)
6. [Clean up](5.6-Cleanup/)

{{% notice warning %}}
This is a real AWS deployment. NAT Gateway, ALB, Fargate, RDS, ElastiCache, WAF, Secrets Manager, logs, and data transfer can incur charges. Create an AWS Budget before provisioning billed resources and complete the cleanup chapter after the workshop.
{{% /notice %}}