---
title: "Tổng quan"
date: 2026-08-01
weight: 1
chapter: false
pre: " <b> 5.1. </b> "
---

## Bài toán thực tế

Cloud Finance Platform giúp người dùng ghi nhận thu chi, quản lý ngân sách và mục tiêu tiết kiệm, lập giao dịch định kỳ, quét hóa đơn, nhận thông báo và trao đổi với trợ lý AI tiếng Việt. Hệ thống cần cung cấp một điểm truy cập web an toàn, đồng thời giữ các service ứng dụng và kho dữ liệu trong mạng private.

## Mục tiêu workshop

Sau workshop, người thực hành có thể:

- Giải thích kiến trúc demo hiện tại và mục tiêu production.
- Triển khai React SPA private với S3, CloudFront, OAC và WAF.
- Triển khai 9 container workload trên ECS Fargate.
- Định tuyến REST/WebSocket qua CloudFront, ALB và Gateway.
- Sử dụng Service Connect/Cloud Map cho service discovery nội bộ.
- Sử dụng PostgreSQL logical database và Redis/RQ.
- Inject secret an toàn và gửi email giao dịch qua Amazon SES.
- Build/deploy bằng GitHub Actions OIDC.
- Kiểm tra log, metric, health check, alarm và chức năng nghiệp vụ.
- Ước tính chi phí và dọn dẹp tài nguyên an toàn.

## Dịch vụ sử dụng và lý do lựa chọn

| Dịch vụ | Vai trò | Lý do lựa chọn |
|---|---|---|
| CloudFront + WAF | Phân phối và bảo vệ ở edge | Hỗ trợ HTTPS, cache, behavior cho SPA/API và managed security rules |
| S3 | Origin private cho React SPA | Bền vững, chi phí thấp, truy cập qua Origin Access Control |
| ALB | Origin cho REST và WebSocket | Tích hợp tốt với ECS và hỗ trợ kết nối WebSocket dài |
| ECS Fargate + ECR | Chạy và lưu container | Không cần quản trị EC2, hỗ trợ triển khai từng service độc lập |
| Service Connect / Cloud Map | Discovery nội bộ | Cung cấp tên service ổn định và giao tiếp private |
| RDS PostgreSQL | Dữ liệu giao dịch | Có backup, mã hóa và đảm bảo tính nhất quán dữ liệu quan hệ |
| ElastiCache for Redis | Queue, cache, Pub/Sub | Phù hợp mô hình producer/worker bằng RQ |
| Secrets Manager + KMS | Secret runtime | Không lưu password/API key trong Git hoặc Docker image |
| CloudWatch | Log, metric, alarm | Cung cấp bằng chứng vận hành tập trung |
| SES | OTP và thông báo | Dịch vụ gửi email giao dịch được quản lý |
| NAT Gateway | Outbound có kiểm soát | Cho phép gọi Gemini, SES SMTP và các public endpoint cần thiết |
| GitHub Actions OIDC | CI/CD | Dùng AWS credential tạm thời, tránh lưu access key dài hạn |

## Phạm vi demo và mục tiêu production

Môi trường demo tối ưu chi phí sử dụng một NAT Gateway, RDS Single-AZ và một Redis primary. ECS task được phân bố trên hai private application subnet. Với production, hệ thống nên nâng cấp lên một NAT Gateway cho mỗi AZ, RDS Multi-AZ, Redis automatic failover, autoscaling, deletion protection, kiểm thử khôi phục và custom domain bằng Route 53.

![Sơ đồ kiến trúc Cloud Finance trên AWS](/images/5-Workshop/5.1-Workshop-overview/ArchitechtureFinal.drawio.png)

## Phạm vi công việc đã thực hiện

Đây không chỉ là kiến trúc đề xuất. Nhóm đã triển khai và kiểm thử một môi trường demo thực tế tại Region **Asia Pacific (Singapore) - ap-southeast-1**. Website được truy cập bằng CloudFront domain:

**https://d29kxn0rxd6abn.cloudfront.net**

| Nhóm tài nguyên | Tài nguyên thực tế |
|---|---|
| Network | `cloud-finance-vpc`, 2 public subnet, 2 private application subnet và 2 private database subnet |
| Container | `cloud-finance-cluster` với 9 ECS Service chạy trên Fargate |
| Registry | ECR repository `cloud-finance-backend` |
| Database | RDS PostgreSQL `cloud-finance-postgres`, 6 logical database |
| Queue/cache | ElastiCache for Redis dùng cho RQ worker và cache |
| Entry point | CloudFront, AWS WAF, ALB và target group `cloud-finance-gateway-tg` |
| Frontend | Private S3 bucket truy cập qua CloudFront Origin Access Control |
| Security | 4 Security Group, Secrets Manager, KMS và IAM role |
| Operations | CloudWatch Log Group cho từng service, health check và AWS Budgets |
| Delivery | GitHub Actions dùng OIDC, build image, push ECR và rolling update ECS |
| Integration | Google Gemini API và Amazon SES SMTP/TLS |

## Vai trò của từng microservice

| Service | Trách nhiệm chính | Dữ liệu/phụ thuộc |
|---|---|---|
| Gateway | Điểm vào REST và WebSocket, reverse proxy | ALB, Service Connect |
| Auth | JWT, OTP, Google Sign-In, onboarding | `auth_db`, SES |
| Finance | Thu/chi, tài khoản, danh mục, ngân sách, mục tiêu | `finance_db` |
| AI Agent | Chat tiếng Việt, tách nhiều giao dịch, báo cáo AI | `ai_db`, Gemini |
| Notification API | Tạo notification và enqueue job | `notifications_db`, Redis |
| Notification Worker | Consume RQ job và gửi email | Redis, SES |
| Planning | Kế hoạch và gợi ý tài chính | `planning_db` |
| Recurring | Quản lý giao dịch định kỳ | `recurring_db` |
| OCR | Tesseract + Gemini, trích xuất hóa đơn | Lưu metadata vào Finance DB; tích hợp S3 receipt object đang hoàn thiện |

## Tiêu chí hoàn thành

Môi trường được xem là hoàn thành khi đáp ứng đồng thời:

1. CloudFront trả frontend React qua HTTPS.
2. Request `/api/v1` đi qua CloudFront, ALB và Gateway.
3. Gateway phân giải được tên service qua Service Connect.
4. Cả 9 ECS Service có `Running=1` và `Pending=0`.
5. Target Gateway trong ALB ở trạng thái healthy.
6. RDS và Redis không public.
7. Đăng nhập, giao dịch, AI, OCR, ngân sách, mục tiêu và notification hoạt động.
8. GitHub Actions có thể build và cập nhật môi trường mà không lưu AWS access key dài hạn.
9. CloudWatch có log cho từng service và AWS Budget có cảnh báo chi phí.

## Phương pháp nghiên cứu và thực hiện

Đồ án được thực hiện theo hướng **nghiên cứu - thiết kế - thử nghiệm - triển khai - đo lường - cải tiến**, thay vì tạo toàn bộ tài nguyên AWS ngay từ đầu.

### Giai đoạn 1 - Phân tích code và ranh giới nghiệp vụ

Nhóm bắt đầu từ source code đang chạy local, xác định 9 process độc lập, command khởi động, port, database và phụ thuộc của từng process. Việc này giúp sơ đồ kiến trúc phản ánh code thật, tránh đưa thêm API Gateway, Cognito, Lambda, SQS hoặc MSK khi baseline chưa sử dụng.

Các câu hỏi được trả lời trước khi vẽ kiến trúc:

- Client đang gọi một Gateway hay gọi trực tiếp từng service?
- WebSocket kết thúc tại thành phần nào?
- Auth do ứng dụng quản lý hay dùng Cognito?
- OCR là Lambda event-driven hay container dài hạn?
- Notification dùng SQS hay Redis/RQ?
- AI dùng Bedrock hay Gemini?
- Mỗi service cần database riêng vật lý hay có thể dùng logical database?
- Tài nguyên nào bắt buộc Multi-AZ và tài nguyên nào được giảm cấu hình trong demo?

### Giai đoạn 2 - Chạy local và lập dependency map

Docker Compose được dùng để chạy đồng thời frontend, PostgreSQL, Redis và các microservice. Nhóm kiểm tra health endpoint, migration, service URL và luồng nghiệp vụ trước khi ánh xạ sang AWS.

Dependency map thu được:

```text
Browser
  -> Gateway
      -> Auth
      -> Finance
      -> AI -> Gemini
      -> OCR -> Tesseract/Gemini -> Finance
      -> Planning
      -> Recurring
      -> Notifications API -> Redis/RQ -> Worker -> SMTP
```

### Giai đoạn 3 - Thiết kế AWS theo nguyên tắc tối thiểu quyền và private-by-default

Kiến trúc được chia thành bốn lớp:

1. **Edge:** CloudFront, WAF và S3.
2. **Ingress/Application:** ALB, ECS Fargate và Service Connect.
3. **Data:** RDS PostgreSQL và ElastiCache trong private subnet.
4. **Operations/Delivery:** CloudWatch, Secrets Manager, ECR và GitHub Actions OIDC.

Mỗi kết nối trên sơ đồ phải tương ứng với một route, Security Group rule, IAM permission hoặc application configuration có thể kiểm tra được.

### Giai đoạn 4 - Triển khai theo checkpoint

Nhóm không tạo tất cả tài nguyên cùng lúc. Mỗi lớp chỉ được triển khai sau khi lớp trước đạt checkpoint:

1. VPC/subnet/route đúng.
2. Security Group đúng luồng.
3. ECR có image.
4. RDS/Redis ở trạng thái Available.
5. Migration có `ExitCode=0`.
6. Từng ECS Service healthy.
7. Service Connect phân giải được DNS.
8. ALB target healthy.
9. CloudFront trả frontend và API.
10. CI/CD tái triển khai thành công.

### Giai đoạn 5 - Quan sát và cải tiến

CloudWatch logs, ECS events, task stop reason, ALB target health và HTTP response được dùng để tìm nguyên nhân thay vì sửa thử ngẫu nhiên. Sau mỗi lỗi, nhóm ghi nhận triệu chứng, giả thuyết, lệnh kiểm tra, nguyên nhân gốc và thay đổi cuối cùng.

## Kết quả học tập

Qua quá trình này, nhóm không chỉ triển khai được website mà còn hiểu mối liên hệ giữa code, container, mạng, IAM, dữ liệu, quan sát hệ thống và chi phí. Đây là cơ sở để phân biệt rõ **môi trường demo có kiểm soát chi phí** với **mục tiêu production có tính sẵn sàng cao**.

## Bằng chứng ứng dụng đã triển khai

Màn hình dưới đây là điểm truy cập công khai được phục vụ từ CloudFront domain của môi trường demo. Hình này không chỉ minh họa giao diện frontend mà còn chứng minh trình duyệt nhận được React SPA qua HTTPS, CloudFront truy cập được S3 origin private thông qua Origin Access Control và thành phần Google Sign-In đã được khởi tạo bằng cấu hình frontend của môi trường triển khai.

![Trang đăng nhập Finanzy được phục vụ qua CloudFront](/images/5-Workshop/WEPTrienKhai.png)

Trang đăng nhập được sử dụng như checkpoint end-to-end đầu tiên. Nếu HTML tải được nhưng JavaScript asset bị trả về với MIME type `text/html`, trang sẽ trắng; nếu behavior API cấu hình sai, request xác thực sẽ thất bại. Vì vậy, việc trang hoạt động tại CloudFront domain cho thấy luồng phân phối static asset và cấu hình phía trình duyệt đã phối hợp đúng.
