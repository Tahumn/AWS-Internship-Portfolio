---
title: "Kiến trúc và mạng"
date: 2026-08-01
weight: 3
chapter: false
pre: " <b> 5.3. </b> "
---

## Luồng kiến trúc

CloudFront có private S3 origin cho SPA và ALB origin cho /api/*, /ws/*. WAF được gắn vào CloudFront. ALB chỉ forward đến target group của Gateway. Gateway gọi các service private qua ECS Service Connect. Service truy cập RDS/Redis bằng Security Group reference, không dùng public IP.

VPC demo có CIDR 10.0.0.0/16:

| Lớp | Subnet |
|---|---|
| Public | 10.0.1.0/24 và 10.0.2.0/24 |
| Private application | 10.0.11.0/24 và 10.0.12.0/24 |
| Private data | 10.0.21.0/24 và 10.0.22.0/24 |

Public route đi qua Internet Gateway. Private application route đi qua NAT Gateway để outbound. Private data route table không có default route ra Internet.

![Resource map của Cloud Finance VPC](/images/5-Workshop/CloudFinance_VPC_Resource_Map.png)

Resource map của môi trường đã triển khai xác nhận sáu subnet được phân bố trên `ap-southeast-1a` và `ap-southeast-1b`. Public tier nối Internet Gateway; private application tier dùng NAT Gateway cho outbound; private database tier dùng route table riêng. Demo chỉ có một NAT Gateway để giảm chi phí, vì vậy outbound của application tier vẫn có điểm lỗi theo Availability Zone.

## Inventory triển khai thực tế

| Lớp | Thành phần đã triển khai | Trạng thái được xác minh | Phạm vi chưa tuyên bố |
|---|---|---|---|
| Edge | CloudFront, WAF, private S3 origin, ALB origin | SPA tải qua CloudFront; hai origin đã cấu hình | Chưa có custom domain/ACM trong baseline |
| Compute | 9 ECS Fargate service | Task và deployment healthy tại thời điểm nghiệm thu | Một task/service; chưa kiểm thử autoscaling |
| Service networking | ECS Service Connect, namespace `cloud-finance.local` | Gateway gọi `auth:8000/health` và nhận HTTP 200 | Không tuyên bố service mesh đa Region |
| Data | RDS PostgreSQL, ElastiCache Redis | RDS private/encrypted; Redis available và mã hóa | Redis chưa bật Multi-AZ/failover trong demo |
| Delivery | ECR, GitHub Actions OIDC | Image tag theo Git SHA và workflow deploy thành công | Chưa triển khai automated rollback đầy đủ |

Các trạng thái trong bảng được giới hạn ở thời điểm chụp bằng chứng. `Healthy` trong demo không đồng nghĩa với SLA production hoặc khả năng chịu tải đã được chứng minh.

## Security Group

Tạo bốn nhóm:

| Group | Inbound |
|---|---|
| cloud-finance-alb-sg | HTTP/HTTPS chỉ từ CloudFront origin-facing managed prefix list |
| cloud-finance-ecs-sg | TCP 8000 từ ALB SG và chính ECS SG |
| cloud-finance-rds-sg | TCP 5432 chỉ từ ECS SG |
| cloud-finance-redis-sg | TCP 6379 chỉ từ ECS SG |

Không mở 5432 hoặc 6379 cho 0.0.0.0/0.

## Lệnh kiểm tra

~~~powershell
aws ec2 describe-subnets --region $region --filters "Name=tag:Name,Values=cloud-finance-*" --query "Subnets[].{Name:Tags[?Key=='Name']|[0].Value,CIDR:CidrBlock,AZ:AvailabilityZone}" --output table
aws ec2 describe-route-tables --region $region --filters "Name=tag:Name,Values=cloud-finance-*" --output table
aws ec2 describe-security-groups --region $region --filters "Name=group-name,Values=cloud-finance-*" --output table
~~~

Kết quả mong đợi: application/data resource không public; CloudFront là endpoint duy nhất cho người dùng.

## Phân tích và lựa chọn kiến trúc

### ALB thay cho API Gateway

Project đã có Gateway Service viết bằng FastAPI và Socket.IO. Nếu thêm API Gateway, hệ thống sẽ có hai gateway logic, tăng cấu hình route, chi phí và độ phức tạp WebSocket. ALB được chọn vì có thể forward cả HTTP và WebSocket đến ECS Gateway bằng target type ip. CloudFront vẫn là public endpoint duy nhất.

### Auth Service thay cho Amazon Cognito

Auth Service hiện thực JWT, OTP, Google Sign-In, user profile và onboarding. Vì vậy Cognito không được vẽ như dependency hiện tại. Đây là quyết định code-aligned; Cognito vẫn có thể là hướng migration khi cần federation hoặc giảm khối lượng vận hành identity.

### ECS Fargate thay cho Lambda đối với OCR và service lõi

OCR dùng Tesseract, thư viện hệ thống và xử lý ảnh; các service còn lại chạy FastAPI dài hạn. Container giúp đóng gói dependency nhất quán giữa local và AWS, đồng thời phù hợp WebSocket và worker. Lambda chỉ phù hợp nếu tái cấu trúc OCR thành event-driven function với giới hạn thời gian, package và lưu trữ tạm được kiểm soát.

### Redis/RQ thay cho Amazon SQS trong baseline

Code Notification API enqueue job vào Redis và Notification Worker chạy RQ consumer. Vì vậy ElastiCache được chọn để khớp code. SQS là hướng cải tiến tốt cho production nhưng chỉ nên đưa vào sơ đồ sau khi thay đổi producer, consumer, retry và DLQ trong code.

### Gemini thay cho Amazon Bedrock

AI Agent và OCR hiện gọi Gemini. Bedrock không phải dependency đang chạy và chỉ được ghi là production/future migration option. Điều này làm báo cáo trung thực với hệ thống đã triển khai.

### Một RDS với sáu logical database

Tách sáu RDS instance sẽ tăng chi phí lớn đối với đồ án. Nhóm chọn một instance nhưng tách auth_db, finance_db, ai_db, notifications_db, planning_db và recurring_db; mỗi service có URL/credential riêng. Đây là **logical database ownership**, không phải database-per-service vật lý hoàn toàn.

Production có thể tách instance khi domain có yêu cầu hiệu năng, compliance hoặc blast radius khác nhau.

## Phân tích luồng dữ liệu

### Luồng REST

~~~text
Browser HTTPS
 -> CloudFront behavior /api/*
 -> ALB
 -> Gateway target port 8000
 -> Service Connect alias
 -> Domain service
 -> Logical PostgreSQL database
 -> Response theo chiều ngược lại
~~~

### Luồng WebSocket

~~~text
Browser WSS
 -> CloudFront /ws/*
 -> ALB
 -> Gateway Socket.IO
 -> Redis Pub/Sub hoặc service event
 -> Gateway
 -> Browser
~~~

CloudFront behavior và ALB idle timeout phải phù hợp kết nối dài. API/WebSocket không được cache.

### Luồng notification bất đồng bộ

~~~text
Business service
 -> Notification API
 -> Persist notifications_db
 -> Enqueue Redis queue notifications
 -> Notification Worker consume
 -> Amazon SES SMTP/TLS
 -> User email
~~~

API không phải chờ hoàn tất gửi email; worker có thể retry độc lập.

### Luồng OCR

~~~text
Browser upload
 -> CloudFront/ALB/Gateway
 -> OCR Service
 -> Tesseract + Gemini parsing
 -> Finance Service / Finance DB metadata
 -> Transaction and receipt response
~~~

S3 receipts bucket đã được provision nhưng read/write object từ OCR bằng ECS task role đang được ghi rõ là pending, tránh mô tả sai trạng thái triển khai.

### Luồng CI/CD

~~~text
Manual workflow_dispatch
 -> GitHub Actions
 -> OIDC AssumeRole
 -> Docker build
 -> ECR
 -> ECS task revision
 -> Rolling update
 -> Frontend build
 -> S3 sync
 -> CloudFront invalidation
~~~

## Đánh giá theo các trụ cột kiến trúc

| Trụ cột | Áp dụng trong demo | Cải tiến production |
|---|---|---|
| Operational Excellence | Log theo service, CI/CD, health check | IaC, runbook, deployment alarm |
| Security | Private subnet, SG reference, OIDC, Secrets Manager | Custom domain, DKIM, rotation, audit |
| Reliability | ECS task replacement, hai app subnet | Multi-AZ DB/Redis, ≥2 task, circuit breaker |
| Performance | CloudFront cache static, Redis cache/queue | Autoscaling và load test |
| Cost Optimization | Một NAT, shared RDS, một task/service | Scheduling, Savings Plans, VPC endpoint |
| Sustainability | Managed services, scale-to-zero ngoài demo | Rightsizing dựa trên metric |

## Ma trận kết nối có thể kiểm chứng

| Nguồn | Đích | Port/Protocol | Cơ chế kiểm soát |
|---|---|---|---|
| User | CloudFront | 443 HTTPS/WSS | TLS + WAF |
| CloudFront | ALB | 80/443 | Managed prefix list |
| ALB | Gateway | 8000 HTTP | ALB SG → ECS SG |
| ECS service | ECS service | 8000 HTTP | ECS SG self-reference + Service Connect |
| ECS | RDS | 5432 PostgreSQL/TLS | ECS SG → RDS SG |
| ECS | Redis | 6379 TLS | ECS SG → Redis SG |
| ECS | Gemini | 443 HTTPS | Private route → NAT |
| Worker/Auth | SES | SMTP/TLS | NAT outbound + secret credential |
