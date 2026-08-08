---
title: "CI/CD and deployment verification"
date: 2026-08-01
weight: 3
chapter: false
pre: " <b> 5.4.3. </b> "
---

## OIDC-based delivery

The `Deploy AWS` workflow is manually triggered for the demo and requests only `id-token: write` and `contents: read`. GitHub exchanges its OIDC token for temporary AWS credentials by assuming `CloudFinanceGitHubActionsRole`; no long-lived AWS access key is stored in repository secrets.

The backend image tag is `sha-${{ github.sha }}`. This makes the release immutable and traceable from commit to ECR image and ECS task-definition revision. For each of the nine services, the workflow reads the current task definition, replaces only the selected container image and command, removes server-generated fields, registers a new revision, and forces a rolling update.

![Successful GitHub Actions deployment](/images/5-Workshop/CI_CD.png)

## Frontend publication order

The frontend is built with `VITE_API_BASE=/api/v1`, so browser traffic stays on the CloudFront domain. Hashed assets are uploaded first with one-year immutable caching. `index.html` is uploaded last with `no-cache,no-store,must-revalidate`, followed by a CloudFront invalidation. The order is intentional: publishing a new index before its referenced assets can produce a JavaScript MIME failure when an asset request falls through to SPA `index.html`.

~~~bash
aws s3 sync frontend/dist "s3://$FRONTEND_BUCKET" \
  --delete --exclude "index.html" \
  --cache-control "public,max-age=31536000,immutable"

aws s3 cp frontend/dist/index.html \
  "s3://$FRONTEND_BUCKET/index.html" \
  --content-type "text/html" \
  --cache-control "no-cache,no-store,must-revalidate"
~~~

## Release acceptance

A green build alone is insufficient. The release is accepted only when:

- OIDC returns temporary credentials for the expected repository/environment.
- ECR contains the exact Git SHA tag.
- each ECS service references the new task revision and becomes stable;
- Gateway target health is healthy;
- static assets and deep SPA routes load through CloudFront;
- `/api/v1/auth/me` without a token returns `401`, proving the full edge-to-auth route;
- CloudFront invalidation is recorded.

The deployed website is visible in the following capture:

![Cloud Finance login page delivered from AWS](/images/5-Workshop/WEPTrienKhai.png)

This page is evidence of frontend delivery, not sufficient evidence of backend correctness. It is paired with ECS, target-health, API status, and CloudWatch observations in the testing chapter.

