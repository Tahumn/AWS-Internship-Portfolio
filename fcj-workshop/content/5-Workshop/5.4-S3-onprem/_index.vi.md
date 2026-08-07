---
title: "Triển khai end-to-end"
date: 2026-08-01
weight: 4
chapter: false
pre: " <b> 5.4. </b> "
---

## 1. Tạo tài nguyên nền tảng

Tạo VPC, sáu subnet, Internet Gateway, route table, bốn Security Group, một NAT Gateway cho demo và DB/cache subnet group theo chương kiến trúc. Tạo chín CloudWatch Log Group dưới /ecs/cloud-finance/ và đặt retention 14 ngày.

{{% notice info %}}
Security Group, route table và subnet group không tính phí theo giờ. NAT Gateway và data processing bắt đầu tính phí ngay khi trạng thái Available.
{{% /notice %}}

## 2. Tạo ECR và push backend image

~~~powershell
aws ecr create-repository --repository-name cloud-finance-backend --region $region
$account = (aws sts get-caller-identity --query Account --output text)
$registry = "$account.dkr.ecr.$region.amazonaws.com"
aws ecr get-login-password --region $region | docker login --username AWS --password-stdin $registry
docker build -t cloud-finance-backend:workshop .
docker tag cloud-finance-backend:workshop "$registry/cloud-finance-backend:workshop"
docker push "$registry/cloud-finance-backend:workshop"
~~~

Một image được tái sử dụng với command khác nhau cho Gateway, Auth, Finance, Notifications API, Notifications Worker, Planning, Recurring, OCR và AI.

## 3. Tạo RDS và Redis

Tạo RDS PostgreSQL trong private DB subnet group:

- Identifier: cloud-finance-postgres
- PostgreSQL 16, db.t4g.micro, gp3 20 GiB
- Public access: No
- Encryption: On
- Security Group: cloud-finance-rds-sg
- Demo: Single-AZ; production target: Multi-AZ
- Bật automated backup theo giới hạn tài khoản

Tạo ElastiCache Redis replication group trong private cache subnet group:

- ID: cloud-finance-redis
- Bật TLS in transit
- Security Group: cloud-finance-redis-sg
- Demo: một primary; production: replica và automatic failover

Project dùng một RDS instance với sáu logical database: auth_db, finance_db, ai_db, notifications_db, planning_db và recurring_db. Cách này giữ ownership logic theo service và kiểm soát chi phí demo.

## 4. Lưu secret và chạy migration

Tạo secret cho application, Gemini, Redis, SMTP và database. Cấp ecsTaskExecutionRole quyền secretsmanager:GetSecretValue và kms:Decrypt đúng resource cần thiết.

Chạy migration task tuần tự cho từng database, không chạy đồng thời trên RDS demo nhỏ.

~~~powershell
aws ecs run-task --cluster cloud-finance-cluster --launch-type FARGATE --task-definition cloud-finance-db-migration --network-configuration "awsvpcConfiguration={subnets=[PRIVATE_APP_A,PRIVATE_APP_B],securityGroups=[ECS_SG],assignPublicIp=DISABLED}" --overrides file://ecs/migration-overrides.json --region $region
~~~

Checkpoint: mọi migration task phải dừng với exit code 0.

## 5. Tạo ECS Service và Service Connect

Tạo cloud-finance-cluster và task definition Fargate cho từng workload. Dùng awsvpc, private application subnet, cloud-finance-ecs-sg, awslogs, health check và secret injection.

| Service | Container command |
|---|---|
| gateway | uvicorn app.gateway_main:app --host 0.0.0.0 --port 8000 |
| auth | uvicorn app.services.auth_main:app --host 0.0.0.0 --port 8000 |
| finance | uvicorn app.services.finance_main:app --host 0.0.0.0 --port 8000 |
| notifications | uvicorn app.services.notifications_main:app --host 0.0.0.0 --port 8000 |
| notifications-worker | python -m app.workers.notifications_worker |
| planning | uvicorn app.services.planning_main:app --host 0.0.0.0 --port 8000 |
| recurring | uvicorn app.services.recurring_main:app --host 0.0.0.0 --port 8000 |
| ocr | uvicorn app.services.ocr_main:app --host 0.0.0.0 --port 8000 |
| ai | uvicorn app.services.ai_main:app --host 0.0.0.0 --port 8000 |

Tạo HTTP namespace cloud-finance.local. Cấu hình alias auth, finance, notifications, planning, recurring, ocr, ai và gateway trên port 8000. Chỉ Gateway gắn với ALB target group.

~~~powershell
$services = @("cloud-finance-auth","cloud-finance-finance","cloud-finance-notifications","cloud-finance-notifications-worker","cloud-finance-planning","cloud-finance-recurring","cloud-finance-ocr","cloud-finance-ai","cloud-finance-gateway")
aws ecs describe-services --cluster cloud-finance-cluster --services $services --region $region --query "services[].{Service:serviceName,Desired:desiredCount,Running:runningCount,Pending:pendingCount}" --output table
~~~

Kết quả: cả chín service có Desired=1, Running=1, Pending=0.

## 6. Tạo ALB, S3, CloudFront và WAF

1. Tạo internet-facing ALB trong hai public subnet.
2. Tạo target group loại IP, port 8000, health check /health.
3. Chỉ gắn cloud-finance-gateway vào target group.
4. Tạo frontend S3 private bucket, bật Block Public Access và SSE-S3.
5. Build frontend với VITE_API_BASE=/api/v1 và upload dist/.
6. Tạo CloudFront OAC cho S3.
7. Default behavior trỏ S3; /api/* và /ws/* trỏ ALB, không cache.
8. Map lỗi SPA 403/404 sang /index.html với response 200.
9. Gắn AWS WAF Web ACL vào CloudFront.

~~~powershell
Set-Location frontend
npm ci
$env:VITE_API_BASE="/api/v1"
npm run build
aws s3 sync dist "s3://FRONTEND_BUCKET" --delete --region $region
~~~

## 7. Cấu hình SES và API ngoài

Verify sender identity trong SES ap-southeast-1. Tạo regional SMTP credential và lưu trong cloud-finance/smtp. Nếu SES còn Sandbox, mọi email nhận dùng để test cũng phải verify. Gemini được gọi qua NAT Gateway; API key lưu trong Secrets Manager.

## 8. Cấu hình CI/CD

Tạo GitHub OIDC provider và CloudFinanceGitHubActionsRole. Trust policy phải giới hạn đúng repository và environment production. Tạo GitHub repository variables:

AWS_REGION, AWS_ROLE_ARN, ECR_REPOSITORY, ECS_CLUSTER, FRONTEND_BUCKET, CLOUDFRONT_DISTRIBUTION_ID, VITE_GOOGLE_CLIENT_ID.

Workflow Deploy AWS build image có tag theo Git SHA, đăng ký task-definition revision mới, rolling update ECS, build frontend, upload S3 và invalidate CloudFront.

## Danh sách hình cần chụp

Lưu dưới static/AWS-Internship-Portfolio/images/5-Workshop/5.4-S3-onprem/:

- ecr-images.png: ECR → cloud-finance-backend → Images, chụp SHA tag và thời gian push.
- rds.png: RDS → Databases → cloud-finance-postgres, chụp Available, encrypted, non-public.
- redis.png: ElastiCache → Redis OSS caches, chụp trạng thái/topology, không chụp credential.
- secrets.png: danh sách tên secret, không mở giá trị.
- ecs-services.png: ECS → cluster → Services, hiển thị 9/9 running.
- service-connect.png: ECS service → Configuration and networking → Service Connect.
- target-healthy.png: target group hiển thị Gateway healthy.
- cloudfront-origins.png: CloudFront → distribution → Origins và Behaviors.
- waf.png: WAF → Web ACL → Associated AWS resources.
- cicd.png: GitHub Actions run Deploy AWS thành công.

## 9. Nhật ký triển khai thực tế

### 9.1. Network và Security Group

Nhóm tạo VPC cloud-finance-vpc với sáu subnet:

| Tên subnet | CIDR | AZ | Vai trò |
|---|---|---|---|
| cloud-finance-public-a | 10.0.1.0/24 | ap-southeast-1a | ALB, NAT |
| cloud-finance-public-b | 10.0.2.0/24 | ap-southeast-1b | ALB |
| cloud-finance-private-app-a | 10.0.11.0/24 | ap-southeast-1a | ECS task |
| cloud-finance-private-app-b | 10.0.12.0/24 | ap-southeast-1b | ECS task |
| cloud-finance-private-db-a | 10.0.21.0/24 | ap-southeast-1a | RDS/Redis subnet group |
| cloud-finance-private-db-b | 10.0.22.0/24 | ap-southeast-1b | RDS/Redis subnet group |

Kết quả kiểm tra route của private application route table:

~~~text
10.0.0.0/16 -> local
0.0.0.0/0  -> nat-0a751272d928f7bd2
~~~

Private DB route table không có 0.0.0.0/0. Điều này bảo đảm RDS và Redis không tự truy cập Internet.

Security Group được kiểm tra theo luồng tối thiểu:

~~~text
CloudFront managed prefix list -> ALB: 80/443
ALB SG -> ECS SG: TCP 8000
ECS SG -> ECS SG: TCP 8000
ECS SG -> RDS SG: TCP 5432
ECS SG -> Redis SG: TCP 6379
~~~

### 9.2. Database và migration

RDS cloud-finance-postgres được tạo với PostgreSQL 16.13, db.t4g.micro, gp3 20 GiB, mã hóa bật, Public=False và MultiAZ=False cho demo. Sau khi trạng thái Available, nhóm chạy bootstrap để tạo sáu logical database và chạy Alembic migration riêng theo scope.

Kết quả nghiệm thu của mỗi migration:

~~~text
auth          -> auth_db          -> ExitCode 0
finance       -> finance_db       -> ExitCode 0
ai            -> ai_db            -> ExitCode 0
notifications -> notifications_db -> ExitCode 0
planning      -> planning_db      -> ExitCode 0
recurring     -> recurring_db     -> ExitCode 0
~~~

Migration được tách khỏi startup service bằng biến SKIP_MIGRATIONS=true. Cách này tránh nhiều ECS task cùng chạy migration và tranh lock khi rolling deployment.

### 9.3. ECS và Service Connect

Sau khi đăng ký task definition, nhóm triển khai từng service và chỉ chuyển sang service kế tiếp khi health check đạt 200. Kết quả cuối:

~~~text
cloud-finance-auth                 1/1
cloud-finance-finance              1/1
cloud-finance-notifications        1/1
cloud-finance-notifications-worker 1/1
cloud-finance-planning             1/1
cloud-finance-recurring            1/1
cloud-finance-ocr                  1/1
cloud-finance-ai                   1/1
cloud-finance-gateway              1/1
~~~

Namespace cloud-finance.local được tạo bằng AWS Cloud Map. Từ ECS Exec trong Gateway, nhóm kiểm tra:

~~~text
getent hosts auth
python -c "import urllib.request; print(urllib.request.urlopen('http://auth:8000/health').read().decode())"
{"status":"ok","service":"auth"}
~~~

Kết quả chứng minh DNS nội bộ và Service Connect hoạt động thật, không chỉ thể hiện trên sơ đồ.

### 9.4. ALB và CloudFront

Target group cloud-finance-gateway-tg dùng target type ip, HTTP port 8000 và health path /health. Target private IP 10.0.11.48 đạt trạng thái healthy tại thời điểm kiểm tra.

CloudFront distribution E36WAN2GEDWN5C có hai origin:

- S3 private origin cho frontend.
- ALB origin cho /api/* và /ws/*.

Kiểm tra từ Internet:

~~~text
GET https://d29kxn0rxd6abn.cloudfront.net/api/v1/auth/me
HTTP/1.1 401 Unauthorized
{"detail":"Not authenticated"}
~~~

401 là kết quả đúng khi chưa có token và chứng minh request đã đi hết CloudFront → ALB → Gateway → Auth. Trước khi sửa origin/SG, request từng trả 504.

### 9.5. CI/CD thực tế

Workflow Deploy AWS sử dụng workflow_dispatch. Mỗi lần chạy:

1. GitHub nhận token OIDC.
2. Assume CloudFinanceGitHubActionsRole.
3. Build backend image gắn tag sha-<commit>.
4. Push image vào ECR.
5. Tạo task-definition revision mới cho chín service.
6. Rolling update ECS.
7. Build frontend với VITE_API_BASE=/api/v1.
8. Upload file tĩnh vào S3.
9. Đặt index.html no-cache.
10. Invalidate CloudFront.

Việc dùng tag Git SHA giúp truy vết phiên bản và rollback. Không có AWS_ACCESS_KEY_ID hoặc AWS_SECRET_ACCESS_KEY dài hạn trong GitHub Secrets.
## 10. Nhật ký triển khai tuần tự và các checkpoint

Môi trường không được tạo trong một lần duy nhất. Mỗi giai đoạn đều kết thúc bằng bước kiểm tra độc lập. Các tài nguyên tính phí theo giờ chỉ được tạo sau khi những lớp cấu hình miễn phí đã được rà soát.

### Giai đoạn 0 — Xác lập hiện trạng triển khai

Trước khi tạo tài nguyên, nhóm ánh xạ từng tiến trình local thành một workload ECS và kiểm tra chính xác command khởi động. Một backend image dùng chung được chủ động tái sử dụng; command và cấu hình quyết định service chạy bên trong container. Cách này giảm sai lệch giữa các bản build và cho phép một Git SHA đại diện cho toàn bộ bản phát hành backend.

Danh sách ban đầu gồm chín workload: Gateway, Auth, Finance, AI Agent, Notification API, Notification Worker, Planning, Recurring và OCR. Các phụ thuộc được phân loại thành HTTP đồng bộ, hàng đợi Redis, PostgreSQL, object storage, SMTP hoặc Gemini API bên ngoài. Dify, Kafka, Cognito, API Gateway và Lambda không được đưa vào vì source code hiện tại không phụ thuộc các thành phần này.

**Checkpoint:** mọi tiến trình chạy được ở local, các HTTP service có `/health`, không có secret nào được commit lên Git.

### Giai đoạn 1 — Xây dựng mạng khi chưa tạo compute tính phí

VPC CIDR `10.0.0.0/16` được chia thành ba tầng subnet trên `ap-southeast-1a` và `ap-southeast-1b`:

| Tầng | AZ A | AZ B | Mục đích |
|---|---|---|---|
| Public | `10.0.1.0/24` | `10.0.2.0/24` | ALB và NAT |
| Private application | `10.0.11.0/24` | `10.0.12.0/24` | ENI của Fargate task |
| Private database | `10.0.21.0/24` | `10.0.22.0/24` | RDS và Redis |

Chỉ public route table có `0.0.0.0/0 -> Internet Gateway`. Database route table cố ý không có Internet route. Tự động cấp public IP được tắt vì application task không cần địa chỉ công khai.

**Checkpoint:** xuất và kiểm tra đủ sáu subnet ID, AZ, CIDR, route-table association và `MapPublicIpOnLaunch=False`.

### Giai đoạn 2 — Thiết lập Security Group theo nguồn tham chiếu

Bốn Security Group được tạo trước khi triển khai service:

- `cloud-finance-alb-sg`: nhận origin traffic từ CloudFront managed prefix list.
- `cloud-finance-ecs-sg`: TCP 8000 từ ALB SG và từ chính ECS SG.
- `cloud-finance-rds-sg`: TCP 5432 chỉ từ ECS SG.
- `cloud-finance-redis-sg`: TCP 6379 chỉ từ ECS SG.

Dùng SG reference thay CIDR giúp IP task thay đổi nhưng firewall không cần sửa. RDS và Redis không mở `0.0.0.0/0`.

**Checkpoint:** bốn SG nằm trong cùng VPC và mỗi inbound rule tham chiếu SG phù hợp hoặc CloudFront prefix list.

### Giai đoạn 3 — Chuẩn bị log và subnet group

Chín CloudWatch Log Group được tạo dưới `/ecs/cloud-finance/` và retention đặt 14 ngày. RDS DB Subnet Group và ElastiCache Subnet Group sử dụng hai private database subnet khác AZ. Giai đoạn này tạo cấu trúc vận hành nhưng chưa chạy application compute.

**Checkpoint:** từng log group có retention 14 ngày; mỗi subnet group chứa một subnet ở mỗi AZ.

### Giai đoạn 4 — Bật outbound có kiểm soát

Một NAT Gateway được tạo tại public subnet A để tối ưu chi phí demo. Private application route table có `0.0.0.0/0 -> NAT Gateway`, cho phép task pull image ECR và gọi Gemini/SES. Private database route table vẫn bị cô lập.

Đây là giai đoạn đầu tiên phát sinh chi phí theo giờ đáng kể, vì vậy allocation ID, route và lệnh cleanup được ghi lại ngay khi tạo.

**Checkpoint:** task private app đi outbound được nhưng subnet RDS/Redis vẫn không có Internet default route.

### Giai đoạn 5 — Tạo dịch vụ có trạng thái và secret

PostgreSQL 16.13 được tạo với `db.t4g.micro`, 20 GiB gp3, mã hóa, không public và Single-AZ cho demo. ElastiCache Redis nằm trong private database subnets, phục vụ cache và RQ job. Secrets Manager lưu cấu hình application, database, Gemini, Redis và SMTP. ECS execution role chỉ được cấp quyền đọc secret và giải mã KMS cần thiết.

Schema của RDS managed secret được kiểm tra trước khi task definition tham chiếu JSON key, tránh đoán sai tên key.

**Checkpoint:** RDS ở trạng thái `available`, encrypted và non-public; Redis available; ảnh minh chứng chỉ hiển thị tên/ARN secret, không hiển thị giá trị.

### Giai đoạn 6 — Bootstrap database và migration có kiểm soát

Một Fargate bootstrap task ngắn hạn tạo sáu logical database. Migration task riêng sau đó chạy tuần tự cho `auth`, `finance`, `ai`, `notifications`, `planning` và `recurring`. Mỗi lần chạy lấy task ARN mới, chờ `STOPPED`, yêu cầu exit code 0 và đối chiếu log `/ecs/cloud-finance/db-migration`.

Nhóm chọn chạy tuần tự vì RDS demo nhỏ; migration song song dễ gây lock và cạnh tranh CPU. Sau khi hoàn tất, service dài hạn nhận `SKIP_MIGRATIONS=true`.

**Checkpoint:** lưu đủ sáu dòng `Migration completed` và sáu task có exit code 0.

### Giai đoạn 7 — Triển khai service theo thứ tự phụ thuộc

Các service được triển khai từng cái thay vì bật đồng loạt:

1. Auth để thiết lập identity và JWT.
2. Finance để kiểm tra luồng database chính.
3. Notification API và Worker để kiểm tra Redis RQ.
4. Planning và Recurring để kiểm tra database nghiệp vụ.
5. OCR và AI để kiểm tra Gemini và xử lý file.
6. Gateway cuối cùng sau khi các đích nội bộ đã healthy.

Với mỗi service, nhóm kiểm tra ECS events, stopped task mới nhất, container exit code, startup log, `/health` và cuối cùng là `Desired=1, Running=1, Pending=0`. Việc AWS nhận lệnh create-service chưa được xem là triển khai thành công.

**Checkpoint:** cả chín service ổn định và health probe trả kết quả thành công.

### Giai đoạn 8 — Bật service discovery nội bộ

Namespace `cloud-finance.local` và ECS Service Connect alias được cấu hình dựa trên port name của task definition. Nhóm dùng ECS Exec kiểm tra trực tiếp trong Gateway thay vì chỉ nhìn Console. Từ Gateway, tên `auth` resolve được và `http://auth:8000/health` trả JSON health của Auth.

**Checkpoint:** giao tiếp task-to-task thành công mà không cần public endpoint.

### Giai đoạn 9 — Công khai đường truy cập ứng dụng

IP target group HTTP 8000, health path `/health` được gắn với Gateway. ALB nằm ở public subnets, còn Gateway target vẫn private. CloudFront dùng S3 OAC origin cho SPA và ALB origin cho `/api/*`, `/ws/*`. WAF được gắn vào CloudFront.

Request end-to-end không có token trả 401 thay vì 504. Trong trường hợp này 401 là kết quả đạt vì chứng minh request đã đi đến lớp authorization của Auth.

**Checkpoint:** target `healthy`, static asset tải được và `/api/v1/auth/me` trả JSON 401 đúng thiết kế.

### Giai đoạn 10 — Cấu hình identity, email và AI ngoài AWS

CloudFront origin được thêm vào Authorized JavaScript origins của Google OAuth. Người dùng Google lần đầu đi qua onboarding; các lần sau bỏ qua. SMTP credential và sender đã verify được lưu trong Secrets Manager. Tại thời điểm ghi nhận, SES production access chưa được duyệt nên email demo chỉ gửi đến recipient đã verify. Gemini credential được inject vào task AI/OCR, không lộ API key.

**Checkpoint:** account chooser và token exchange của Google hoạt động; recipient đã verify nhận email giao dịch; health check AI/OCR ổn định.

### Giai đoạn 11 — Tự động hóa bằng GitHub Actions

GitHub Actions assume `CloudFinanceGitHubActionsRole` qua OIDC, build và push image gắn Git SHA bất biến, đăng ký task-definition revision, cập nhật ECS service, build frontend, đồng bộ S3 và invalidate CloudFront. Không lưu AWS access key dài hạn trên GitHub.

Workflow ban đầu cho thấy hai lỗi thực tế: OIDC subject không khớp repository/environment và waiter chung cho chín service làm khó xác định service chậm. Trust condition được sửa và quy trình chẩn đoán chuyển sang kiểm tra từng service.

**Checkpoint:** có thể truy vết từ commit SHA đến ECR image, ECS task-definition revision và frontend đã triển khai.

## 11. Ý nghĩa của phương pháp checkpoint

Quy trình này tách lỗi cấu hình khỏi lỗi ứng dụng. Thiếu JSON key của secret làm task lỗi trước khi container chạy; thiếu ECR tag lỗi ở bước pull image; lỗi Alembic xuất hiện trong application log; lỗi ALB/CloudFront xuất hiện dưới dạng 504. Vì mỗi checkpoint chỉ thay đổi một lớp, nhóm xác định được đúng tầng gây lỗi thay vì liên tục build lại toàn hệ thống.

## 12. Bằng chứng từ môi trường đã triển khai

Các hình dưới đây được chụp từ môi trường demo thực tế, không phải chỉ từ sơ đồ đề xuất. Khi đặt cạnh nhau, chúng tạo thành chuỗi bằng chứng có thể truy vết từ edge delivery đến container workload, dữ liệu bền vững và quy trình phát hành tự động.

### 12.1. CloudFront distribution

![CloudFront distribution của Cloud Finance đang Enabled](/AWS-Internship-Portfolio/images/5-Workshop/CloudFront.png)

Distribution đang ở trạng thái Enabled và cung cấp domain được dùng trong workshop. Trong cấu hình đã triển khai, default behavior phục vụ frontend asset từ S3 origin private, còn các behavior `/api/*` và `/ws/*` chuyển traffic động đến ALB. Cách tách này cho phép cache SPA nhưng không cache response API có xác thực.

### 12.2. Các ECS Fargate Service

![Chín ECS Fargate Service đang hoạt động](/AWS-Internship-Portfolio/images/5-Workshop/ECS_Service.png)

ECS cluster có 9 service hoạt động gồm Gateway, Auth, Finance, AI, Notification API, Notification Worker, Planning, Recurring và OCR. Mỗi dòng có một task đang chạy, chứng minh các khối trong sơ đồ kiến trúc tương ứng với workload được quản lý độc lập chứ không chỉ là module nằm trong một container monolith. Cấu hình một task là lựa chọn tiết kiệm cho demo; production cần autoscaling, nhiều task và cơ chế bảo vệ deployment chặt chẽ hơn.

### 12.3. Metric vận hành của RDS

![Metric vận hành của RDS PostgreSQL](/AWS-Internship-Portfolio/images/5-Workshop/rds.png)

RDS Console ghi nhận CPU utilization, số kết nối, bộ nhớ trống, dung lượng trống, read IOPS, read latency, throughput và write IOPS của `cloud-finance-postgres`. Các chỉ số cho thấy database có traffic thật và tạo baseline cho quyết định mở rộng tài nguyên. Demo dùng một PostgreSQL instance mã hóa với 6 logical database để giảm chi phí và vẫn giữ quyền sở hữu dữ liệu theo service; đổi lại, mô hình này chưa có mức cô lập lỗi như tách instance vật lý cho từng service.

### 12.4. GitHub Actions triển khai thành công

![GitHub Actions workflow triển khai thành công](/AWS-Internship-Portfolio/images/5-Workshop/CI_CD.png)

Workflow thành công ghi lại đầy đủ chuỗi phát hành: checkout source, nhận AWS credential tạm thời qua OIDC, đăng nhập ECR, build và push backend image, cập nhật ECS Service, chờ ổn định, build frontend và upload lên S3. Bằng chứng này quan trọng vì cho thấy deployment có thể lặp lại từ source control, không phụ thuộc hoàn toàn vào thao tác Console thủ công. Cảnh báo hiển thị trong GitHub không làm workflow thất bại; job đã hoàn tất thành công.

### Kết luận từ chuỗi bằng chứng

Bốn hình tạo thành một chuỗi triển khai thống nhất: CloudFront công bố điểm truy cập, ECS chạy các service tách biệt, RDS lưu và đo dữ liệu giao dịch, còn GitHub Actions tái tạo bản phát hành. Một hình riêng lẻ không chứng minh toàn bộ kiến trúc, nhưng tổ hợp các bằng chứng này hỗ trợ rõ ràng cho kết luận hệ thống đã được triển khai end-to-end.
