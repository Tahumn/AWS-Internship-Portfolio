---
title: "ECS runtime, service discovery và lớp phân phối"
date: 2026-08-01
weight: 2
chapter: false
pre: " <b> 5.4.2. </b> "
---

## Mô hình triển khai container

Một backend image được tái sử dụng cho chín ECS Fargate service. Command trong task chọn Gateway, Auth, Finance, Notification API, Notification Worker, Planning, Recurring, OCR hoặc AI. Dùng chung image giúp tránh lệch dependency; mỗi ECS service vẫn có desired count, health, lịch sử deployment và task-definition revision độc lập.

![Chín ECS service được quản lý độc lập](/images/5-Workshop/ECS_Service.png)

Service được triển khai theo thứ tự phụ thuộc: Auth và Finance trước; tiếp theo Notification API/Worker, Planning và Recurring, OCR và AI; Gateway sau cùng. Phản hồi create-service không được xem là thành công. Với từng workload, nhóm kiểm tra ECS event, exit code của stopped task, CloudWatch startup log và `/health` cho đến khi `Desired=1`, `Running=1`, `Pending=0`.

## Giao tiếp private giữa service

Namespace Cloud Map `cloud-finance.local` cung cấp alias ECS Service Connect trên cổng 8000. Chỉ Gateway tham gia ALB target group; domain service không public. Cách này duy trì một application entry point và tránh tạo load balancer riêng cho từng service.

Data plane được xác minh từ bên trong Gateway bằng ECS Exec:

~~~text
GET http://auth:8000/health
{"status":"ok","service":"auth"}
~~~

Test này đồng thời chứng minh DNS resolution, Service Connect proxy, quyền của security group và Auth listener. Trạng thái “enabled” trên Console chỉ chứng minh cấu hình đã được lưu, chưa chứng minh request thực sự đi qua.

## ALB, CloudFront và WAF

ALB internet-facing trải trên hai public subnet. IP target group chuyển HTTP 8000 đến ENI private của Gateway và probe `/health`. CloudFront có hai trách nhiệm origin: default behavior đọc SPA private trên S3 qua OAC; `/api/*` và `/ws/*` không cache, chuyển traffic động đến ALB. WAF gắn tại CloudFront để lọc request trước khi đến regional origin.

![CloudFront distribution Enabled dùng cho demo](/images/5-Workshop/CloudFront.png)

SPA route cần custom response 403/404 về `/index.html` với mã 200 để React Router xử lý client-side path. Đây không phải quy tắc che lỗi API; API behavior vẫn phải giữ status code thật.

## Tích hợp ngoài hệ thống

Gemini và SES được gọi từ private application subnet qua NAT. Gemini phục vụ AI và OCR; Tesseract vẫn là một phần xử lý OCR. SMTP credential được inject từ Secrets Manager. Tại thời điểm ghi nhận, SES gửi được đến identity đã verify; gửi production không giới hạn vẫn phụ thuộc AWS phê duyệt. Bucket receipts/exports đã provision nhưng OCR tự động lưu object vẫn được ghi rõ là pending.

**Checkpoint:** chín service healthy; Gateway resolve được private alias; ALB target healthy; CloudFront phục vụ SPA; request `/api/v1/auth/me` không JWT trả đúng `401` thay vì `504`.

