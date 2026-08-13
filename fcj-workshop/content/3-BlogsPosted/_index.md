---
title: "Blogs"
date: 2026-08-05
weight: 3
chapter: false
pre: " <b> 3. </b> "
---

{{% notice warning %}}
⚠️ **Note:** The articles below summarize the AWS topics I researched and shared during my internship.
{{% /notice %}}

###  [Blog 1 - 7 IAM Best Practices for Better AWS Account Security](3.1-Blog1/)
This blog introduces seven important IAM best practices for improving AWS account security, including protecting the Root User, enabling MFA, applying the principle of least privilege, using temporary credentials and IAM Roles, managing Access Keys carefully, and monitoring activities with IAM Access Analyzer and AWS CloudTrail.

###  [Blog 2 - Amazon ECS Service Auto Scaling – Scale Resources Based on Demand](3.2-Blog2/)
This blog introduces Amazon ECS Service Auto Scaling and explains how ECS Services can automatically adjust the number of running tasks based on workload demand. It also covers common scaling metrics such as CPU utilization, memory utilization, and Application Load Balancer request count, along with several important configuration considerations.

###  [Blog 3 - Managing secrets on AWS: When .env is no longer the best choice](3.3-Blog3/)
This blog discusses the risks of storing sensitive information such as database credentials, API keys, and application secrets directly in .env files or Docker images. It introduces AWS Secrets Manager and AWS Systems Manager Parameter Store as more suitable solutions for managing secrets in production environments.
