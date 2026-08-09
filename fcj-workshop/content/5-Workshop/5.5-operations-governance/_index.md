---
title: "Security, testing, and operations"
date: 2026-08-01
weight: 5
chapter: false
pre: " <b> 5.5. </b> "
---

This chapter evaluates the running system rather than repeating its architecture. Security is examined as an authorization chain, monitoring is tied to concrete failure modes, and tests are accepted only when both the infrastructure signal and the business result are observable.

1. [IAM and Secrets Manager policy analysis](5.5.1-iam-secrets/): trust boundaries, task role versus execution role, resource scoping, and detailed JSON policy interpretation.
2. [Monitoring and acceptance testing](5.5.2-monitoring-testing/): CloudWatch evidence, health criteria, positive and negative tests, and application-level validation.
3. [Incident analysis and production gaps](5.5.3-incidents-limitations/): ECS stability timeout, stale frontend assets, diagnostic method, corrective actions, and remaining limitations.

The report deliberately distinguishes implementation evidence from future hardening. For example, the receipts bucket exists but automatic OCR object persistence is still pending; SES integration works for verified identities while production sending remains subject to AWS approval.
