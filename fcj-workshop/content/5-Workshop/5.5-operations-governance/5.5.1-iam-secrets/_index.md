---
title: "IAM and Secrets Manager policy analysis"
date: 2026-08-01
weight: 1
chapter: false
pre: " <b> 5.5.1. </b> "
---

## Role separation

The deployment uses roles for distinct trust boundaries rather than one shared administrator credential.

![IAM roles used by the Cloud Finance environment](/images/5-Workshop/IAMRole.png)

`CloudFinanceGitHubActionsRole` is trusted by GitHub's OIDC provider and is used only by the deployment workflow. `ecsTaskExecutionRole` is assumed by the ECS agent to pull images, create log streams, and resolve task-definition secrets. `cloudFinanceECSTaskRole` represents permissions used by application code. AWS service-linked roles for ECS, RDS, ElastiCache, and ELB are service-managed and should not be confused with application permissions.

This separation matters during incident analysis: a secret retrieval failure before container startup belongs to the execution path, while an application call to S3 or another AWS API belongs to the task role.

## GitHub OIDC trust policy

The following is the effective policy shape used for the deployment role; account, repository, and environment values are shown explicitly because these fields define who may obtain AWS credentials.

~~~json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "Federated": "arn:aws:iam::347412228908:oidc-provider/token.actions.githubusercontent.com"
    },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": {
        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
        "token.actions.githubusercontent.com:sub": "repo:Tahumn/cloud-finance-platform:environment:production"
      }
    }
  }]
}
~~~

### Interpretation

- `Principal.Federated` does not trust all GitHub users. It trusts tokens validated by the configured GitHub OIDC provider.
- `sts:AssumeRoleWithWebIdentity` permits token exchange, not direct console login and not permanent key creation.
- `aud = sts.amazonaws.com` prevents a token issued for another audience from being replayed against STS.
- `sub = repo:...:environment:production` binds the role to one repository and its protected `production` environment. A branch-based subject would have a different format; mixing the two caused the observed `Not authorized to perform sts:AssumeRoleWithWebIdentity` failure.

The trust policy answers **who may assume the role**. A separate permissions policy answers **what the assumed role may do**. Conflating them often results in either a workflow that cannot authenticate or a role that is too broad.

## ECS secret retrieval policy

Task definitions reference JSON keys from Secrets Manager. The execution role therefore needs `GetSecretValue`; KMS decrypt is needed when a customer-managed key protects a secret. A scoped policy follows this shape:

~~~json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadCloudFinanceSecrets",
      "Effect": "Allow",
      "Action": "secretsmanager:GetSecretValue",
      "Resource": [
        "arn:aws:secretsmanager:ap-southeast-1:347412228908:secret:cloud-finance/*",
        "arn:aws:secretsmanager:ap-southeast-1:347412228908:secret:rds!db-*"
      ]
    },
    {
      "Sid": "DecryptSecretsThroughSecretsManager",
      "Effect": "Allow",
      "Action": "kms:Decrypt",
      "Resource": "KMS_KEY_ARN",
      "Condition": {
        "StringEquals": {
          "kms:ViaService": "secretsmanager.ap-southeast-1.amazonaws.com"
        }
      }
    }
  ]
}
~~~

### Why each field exists

- `Resource` limits retrieval to the project prefix and the RDS-managed secret rather than every secret in the account.
- The suffix wildcard is necessary because Secrets Manager appends characters to the ARN; it does not authorize unrelated prefixes.
- `kms:ViaService` ensures decrypt is performed through regional Secrets Manager. For a customer-managed key, `Resource` should be the key ARN, not `*`.
- `DescribeSecret` is not required merely to inject a known secret value. Permissions should be added only when code actually performs that API call.

![Cloud Finance secret inventory without secret values](/images/5-Workshop/SecretStore.png)

The screenshot intentionally shows names and purpose, not values. `cloud-finance/databases` contains logical connection URLs, while Redis, Gemini, SMTP, and application authentication are separated so rotation and access can be managed independently. The RDS-managed secret is kept as a separate AWS-managed credential source.

## Task role and pending S3 integration

The receipts bucket exists, but automatic OCR object persistence is documented as pending. Therefore the report does not claim that the current task role already proves production S3 access. When implemented, OCR should receive only bucket-specific `s3:PutObject`, `s3:GetObject`, and required metadata actions under a receipts prefix. It should not receive `s3:*` across all buckets. This is an implementation recommendation, clearly separated from deployed evidence.

## Negative authorization checks

Policy review includes failure expectations:

- a token from another repository/environment must fail role assumption;
- an ECS task lacking the execution policy must fail secret retrieval before startup;
- application code must not read an unrelated project secret;
- RDS and Redis remain unreachable from the Internet regardless of IAM because network controls are independent.

The tests demonstrate defense in depth: IAM controls API authorization, security groups control network paths, and application JWT controls user-level access.

