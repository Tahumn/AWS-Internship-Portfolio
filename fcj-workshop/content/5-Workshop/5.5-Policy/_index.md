---
title: "Testing, monitoring, security, and cost"
date: 2026-08-01
weight: 5
chapter: false
pre: " <b> 5.5. </b> "
---

## 1. Infrastructure health tests

~~~powershell
aws ecs describe-services --cluster cloud-finance-cluster --services cloud-finance-auth cloud-finance-finance cloud-finance-notifications cloud-finance-notifications-worker cloud-finance-planning cloud-finance-recurring cloud-finance-ocr cloud-finance-ai cloud-finance-gateway --region $region --query "services[].{Service:serviceName,Desired:desiredCount,Running:runningCount,Pending:pendingCount}" --output table
aws elbv2 describe-target-health --target-group-arn TARGET_GROUP_ARN --region $region --output table
curl.exe -i https://CLOUDFRONT_DOMAIN/api/v1/auth/me
~~~

The unauthenticated API request should return 401, not 504. A 401 proves that CloudFront, ALB, Gateway, Service Connect, and Auth are reachable.

## 2. Functional test plan

| Test | Action | Expected result |
|---|---|---|
| Authentication | Google Sign-In or OTP login | Token issued; first-time onboarding appears once |
| Transactions | Add income and expense | Dashboard balance and list update |
| AI multi-transaction | Enter one Vietnamese sentence with income and expenses | Correctly split and categorize transactions without create confirmation |
| Budget/goal | Create a budget or saving goal | Created immediately; edit/delete requires confirmation |
| Recurring | Create a recurring transaction | Rule saved and recurring service processes it |
| Notifications | Trigger a transaction notification | API enqueues; worker consumes from Redis |
| OCR | Upload a receipt | Merchant/amount extracted; receipt and finance transaction persisted |
| WebSocket | Keep notifications open | Real-time update arrives without page refresh |
| Responsive | Chrome DevTools 390 × 844 | No horizontal overflow; login and dashboard usable |

## 3. Logs, metrics, and alarms

Open **CloudWatch → Log groups → /ecs/cloud-finance/**. Each service must have a log stream. Useful evidence includes application startup, /health 200, RQ worker listening, and request status. Never publish tokens or personal data.

Create alarms for:

- ALB TargetResponseTime and HTTPCode_Target_5XX_Count.
- ECS CPUUtilization and MemoryUtilization.
- RDS CPUUtilization, FreeStorageSpace, DatabaseConnections.
- ElastiCache CPUUtilization, CurrConnections, Evictions.
- Billing estimated charges through AWS Budgets.

Set log retention to 14 days for the demo. Production should define dashboards, alert ownership, and incident procedures.

## 4. Security verification

- S3 Block Public Access is enabled; CloudFront uses OAC.
- WAF is associated with CloudFront.
- RDS and Redis are non-public.
- ALB SG accepts only the CloudFront managed prefix list.
- ECS SG accepts port 8000 only from ALB SG and itself.
- Secrets are injected at task startup and are absent from Git.
- GitHub Actions uses OIDC temporary credentials.
- CloudFront redirects viewers to HTTPS.
- Database connections and Redis use TLS where supported.

## 5. Cost assessment

Typical continuously running demo cost is dominated by nine Fargate tasks, NAT Gateway, ALB, RDS, and Redis. The exact amount depends on task CPU/memory, Region pricing, traffic, logs, and free-tier eligibility.

Optimization actions:

- Scale ECS desiredCount to 0 outside demo windows.
- Keep one NAT Gateway for the demo; use one per AZ for production.
- Use one shared RDS instance with logical databases for the demo.
- Keep RDS Single-AZ and Redis single-node only for non-production.
- Use 14-day log retention and ECR lifecycle policies.
- Cache static assets at CloudFront and bypass cache for API/WebSocket.
- Review Cost Explorer and Budget alerts daily during the workshop.

## 6. Recorded test results

| Area | Recorded result | Status |
|---|---|---|
| ECS | All 9 services at Desired=1, Running=1, Pending=0 | Pass |
| ALB | Gateway target healthy on port 8000 | Pass |
| CloudFront API | /api/v1/auth/me returns 401 without a token | Pass |
| Auth | Google Sign-In/JWT work; onboarding only on first login | Pass |
| Finance | Income/expense updates dashboard and transaction list | Pass |
| AI | One Vietnamese sentence is split into multiple income/expense records | Pass |
| Confirmation | Create is immediate; risky edit/delete requires confirmation | Pass |
| Notifications | API enqueues and RQ worker listens to notifications queue | Pass |
| OCR | Tesseract/Gemini extracts receipts and persists metadata/transaction | Pass after model update |
| Responsive | Login and main pages work at 390 × 844 | Pass |
| CI/CD | OIDC, build/push, and deployment work | Pass after trust/wait fixes |
| SES | Verified identities receive mail; unrestricted sending depends on AWS approval | Sandbox limitation |

## 7. Incidents and troubleshooting record

### Secret retrieval failure

A task failed with ResourceInitializationError because the referenced secret did not contain the JSON key host. The secret schema and task-definition valueFrom selectors were aligned, and the execution role was granted GetSecretValue.

### Alembic percent interpolation

A URL-encoded database password caused ConfigParser interpolation errors. Percent signs were escaped before cfg.set_main_option. The rerun completed with exit code 0.

### ECS startup lock and exit code 3

Services stalled during startup migrations. Migrations were moved to dedicated one-off tasks and SKIP_MIGRATIONS=true was added to long-running services.

### Missing ECR tag

finance-v5 was referenced before it existed in ECR, causing CannotPullContainerError. The correct tag was pushed and the service redeployed. CI/CD now uses immutable Git SHA tags.

### CloudFront 504

The SPA loaded while API requests timed out. CloudFront origin protocol, ALB listener/security-group rules, and Service Connect were corrected. The external endpoint then returned the expected 401.

### Gemini OCR model 404

The configured Gemini model was unavailable to new users. The model setting was updated, a new OCR image was pushed, and the task revision was redeployed.

### GitHub OIDC denial

The role trust policy did not match the repository/environment subject. The OIDC provider, audience, and production environment subject were corrected.

### ECS stability timeout

Waiting for all nine services in one command made the whole job fail when one rollout was slow. Service events were inspected individually; production should wait per service and enable deployment circuit breaker rollback.

### Frontend JavaScript MIME error

CloudFront served index.html for a missing hashed JavaScript asset. Immutable assets are now uploaded first, index.html is uploaded with no-cache, then CloudFront is invalidated.

## 8. Layered security assessment

| Layer | Implemented control |
|---|---|
| Edge | CloudFront HTTPS, WAF, private S3 OAC |
| Network | Public/private subnets, SG references, non-public databases |
| Identity | IAM roles, GitHub OIDC, administrator MFA |
| Application | JWT, OTP, Google token validation, onboarding |
| Data | RDS encryption, TLS, per-service logical database credentials |
| Secrets | Secrets Manager/KMS and excluded .env |
| Operations | CloudWatch logs, health checks, and Budgets |
| Delivery | Immutable image tags, task revisions, rolling updates |

## 9. Current limitations and production roadmap

The demo has one NAT Gateway, Single-AZ RDS, one Redis primary, and one task per service. Production should use one NAT per AZ, RDS Multi-AZ with deletion protection and restore tests, Redis replica/automatic failover, at least two tasks for critical services, autoscaling, completed S3 receipt integration through a task role, SES domain identity/DKIM, and Infrastructure as Code.
## 10. Verification methodology

Testing was performed from the inside out. Container health was checked first, followed by service-to-service calls, ALB target health, CloudFront routing, and finally browser workflows. This order avoided interpreting an edge timeout as an application defect.

For every scenario, the team recorded: test time, input, expected result, observed HTTP/status result, CloudWatch log group, deployed image tag/task revision, and screenshot location. Sensitive tokens and secret values were excluded.

## 11. Detailed functional and infrastructure test cases

| ID | Scenario and input | Expected result | Observed evidence | Result |
|---|---|---|---|---|
| INF-01 | Inspect all ECS services | Each service has one stable task | 9 services reported Desired 1, Running 1, Pending 0 | Pass |
| INF-02 | Target group `/health` on port 8000 | Gateway target becomes healthy | IP target `10.0.11.48` reported healthy | Pass |
| INF-03 | ECS Exec from Gateway to `http://auth:8000/health` | Service Connect resolves private alias | `{"status":"ok","service":"auth"}` | Pass |
| INF-04 | Call CloudFront `/api/v1/auth/me` without JWT | Request reaches Auth and is rejected | HTTP 401 with `Not authenticated` | Pass |
| AUTH-01 | Login with valid Google account for the first time | Account is created and onboarding opens | Profile setup was required once | Pass |
| AUTH-02 | Login again with the same Google account | Existing user bypasses onboarding | Dashboard opened directly | Pass |
| AUTH-03 | Use invalid/expired JWT | Protected API rejects request | 401 response; no protected data returned | Pass |
| FIN-01 | Add VND 15,000,000 income and VND 50,000 expense | Two transactions and updated balance | Transaction list and dashboard totals changed consistently | Pass |
| AI-01 | `tôi vừa uống cà phê 50k, được mẹ cho 100k và uống trà sữa hết 50k` | Create 3 records: two expenses and one income; net change 0 | Records were separated by direction/category without create confirmation | Pass |
| AI-02 | `tạo ngân sách mua sắm 7 triệu` | Budget is created immediately | Budget record appeared without confirmation | Pass |
| AI-03 | Request edit or delete of an existing record | Confirmation is required before destructive mutation | Pending action was created; confirm/cancel controlled execution | Pass |
| OCR-01 | Upload a readable receipt image | OCR extracts merchant/date/amount and creates finance data | OCR result was returned after Gemini model update | Pass |
| OCR-02 | Open Bills and Transactions after OCR | Persisted receipt/transaction is visible and dashboard changes | Metadata/transaction path verified; S3 object integration remains a documented pending item | Partial |
| NTF-01 | Trigger notification API job | API enqueues; worker consumes Redis `notifications` queue | Worker log showed subscription, scheduler lock and queue listening | Pass |
| UI-01 | Open login/dashboard at `390 × 844` | No horizontal overflow; controls remain usable | Chrome responsive inspection completed | Pass |
| CICD-01 | Manually trigger Deploy AWS | OIDC, ECR, ECS, S3 and invalidation complete | Commit SHA mapped to immutable ECR tag and task revisions | Pass after fixes |
| MAIL-01 | Send OTP to a verified SES recipient | SMTP/TLS message is delivered | Verified addresses received mail | Pass with Sandbox constraint |

### AI transaction acceptance criteria

The AI feature was not accepted based only on a natural-language response. The team verified database-facing effects:

1. The sentence was segmented into three financial intents.
2. `được mẹ cho 100k` was classified as income, while `uống cà phê 50k` and `uống trà sữa 50k` were expenses.
3. Categories were assigned independently rather than combining the sentence into a single VND 200,000 expense.
4. Create operations executed immediately.
5. Edit and delete operations remained protected by confirmation.
6. Finance totals were recalculated from persisted transactions.

This test directly addressed an earlier defect where the assistant treated the full sentence as one pending update.

### OCR acceptance criteria

OCR was tested as a cross-service workflow, not only as text extraction. A successful run required the upload request to reach Gateway, Gateway to resolve OCR through Service Connect, OCR to process the image, the amount/date/merchant to be normalized, and the resulting metadata/transaction to be persisted through the correct owner service. The Gemini `404 model unavailable` incident was resolved by updating the model and redeploying the OCR image. The S3 receipts bucket is provisioned, but automatic object persistence remains explicitly marked pending rather than presented as complete.

### CI/CD acceptance criteria

A green build alone was insufficient. The release was considered traceable only when:

- GitHub obtained temporary AWS credentials through OIDC.
- ECR contained the exact Git SHA tag.
- ECS services referenced a task-definition revision built from that tag.
- The frontend build used `/api/v1` and the configured Google Client ID.
- Hashed assets were uploaded before `index.html`.
- `index.html` used no-cache metadata.
- CloudFront invalidation was created.
- The post-deployment API smoke test returned the expected status.

## 12. Operational measurements and interpretation

The demo focused on correctness and deployability rather than load-test claims. Measurements retained for the report include ALB target health, ECS desired/running/pending counts, container health probes, RDS availability and encryption state, Redis worker activity, CloudFront status codes, workflow duration, and CloudWatch timestamps.

A 401 from `/auth/me` is interpreted as a successful routing test when no token is supplied. A 504 is not. Likewise, a container marked RUNNING is not accepted until its health check succeeds and the service reaches steady state.

## 13. Evidence-to-claim mapping

| Report claim | Required screenshot or log |
|---|---|
| Nine microservices are deployed | ECS cluster Services table with desired/running counts |
| Private service discovery works | ECS Exec output calling Auth from Gateway |
| Gateway is reachable through ALB | Target group healthy target |
| CloudFront routes API traffic | Curl/browser network response for `/api/v1/auth/me` |
| Data is private | RDS page showing Public access = No and SG/subnet evidence |
| Queue processing works | Notification Worker CloudWatch log |
| CI/CD is implemented | Successful GitHub Actions steps and SHA-tagged ECR image |
| Monitoring exists | CloudWatch log groups, alarms/dashboard screenshots |
| Cost control exists | AWS Budgets thresholds and cleanup checklist |

This mapping prevents decorative screenshots: every image must support a technical statement in the report.

## 14. Functional evidence from the running application

Infrastructure health was accepted only after user-facing flows also produced the expected persistent results. The following screenshots connect application behavior to the AWS services verified in the previous chapters.

### 14.1. AI multi-transaction extraction

![AI assistant splitting one sentence into multiple transactions](/AWS-Internship-Portfolio/images/5-Workshop/Chatbox.png)

The Vietnamese request contains three expenses in one sentence. The AI assistant separates breakfast, fuel, and clothing into three transactions and assigns different categories instead of merging them into one amount. The dashboard totals update after persistence. This validates the Browser â†’ Gateway â†’ AI Agent â†’ Gemini â†’ Finance flow and the create-without-confirmation rule; destructive edit and delete operations still require confirmation.

### 14.2. Receipt OCR result

![Receipt OCR extraction result](/AWS-Internship-Portfolio/images/5-Workshop/OCR.png)

The OCR screen shows an uploaded receipt preview together with extracted transaction date, merchant, total, discount, transaction type, confidence values, and category suggestion. This confirms that the OCR workload performs structured extraction rather than returning raw text only. The result is reviewed before persistence, while automatic receipt-object storage in the provisioned S3 bucket remains explicitly documented as a pending integration.

### 14.3. SES sending evidence

![Amazon SES sending statistics in Singapore](/AWS-Internship-Portfolio/images/5-Workshop/email_ecs.png)

The SES dashboard in `ap-southeast-1` records successful sends and no rejects for the captured interval. This supports the OTP/notification email test for verified identities. It does not imply unrestricted public delivery: the account remains subject to SES Sandbox limitations until production access is approved, so the report distinguishes successful technical integration from production sending eligibility.

### Functional evidence conclusion

The screenshots prove three different qualities: AI orchestration across services, OCR extraction from an image, and outbound transactional email through an AWS-managed service. They complement infrastructure screenshots because a healthy task alone does not prove that a business operation completes correctly.
