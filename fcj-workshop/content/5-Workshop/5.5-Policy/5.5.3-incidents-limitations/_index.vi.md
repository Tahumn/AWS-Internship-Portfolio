---
title: "Phân tích sự cố và khoảng cách đến production"
date: 2026-08-01
weight: 3
chapter: false
pre: " <b> 5.5.3. </b> "
---

## ECS stability timeout

![GitHub Actions timeout khi chờ ECS stable](/images/5-Workshop/ECSstabilitytimeout.png)

Workflow đã đăng nhập OIDC, push image và cập nhật service nhưng `aws ecs wait services-stable` vượt quá số lần thử. Waiter chỉ tổng hợp triệu chứng, không phải root cause: một service liên tục thay task unhealthy có thể giữ toàn bộ thao tác chờ chín service.

Điều tra được chuyển từ workflow xuống service và task:

~~~powershell
aws ecs describe-services --cluster cloud-finance-cluster `
  --services cloud-finance-finance `
  --query "services[0].{Running:runningCount,Pending:pendingCount,Events:events[0:8].message}"

aws ecs describe-tasks --cluster cloud-finance-cluster `
  --tasks TASK_ARN `
  --query "tasks[0].{StoppedReason:stoppedReason,Containers:containers[].{ExitCode:exitCode,Reason:reason}}"
~~~

Các nguyên nhân thực tế từng gặp gồm ECR tag chưa tồn tại, JSON key của secret không khớp và startup migration tranh chấp. Cách khắc phục là push đúng immutable tag trước khi update ECS, đồng bộ secret key với schema thật, tách migration task và đặt `SKIP_MIGRATIONS=true` cho service. Production nên bật deployment circuit breaker/rollback và báo kết quả stable theo từng service thay vì một waiter tổng hợp khó chẩn đoán.

## Sự cố JavaScript MIME của frontend

![Cấu hình CloudFront custom error response cho SPA](/images/5-Workshop/FrontendJavaScriptMIME_error.png)

Browser báo module JavaScript nhưng nhận `text/html` khi asset path không tồn tại và SPA fallback trả `/index.html`. Mapping 403/404 là đúng cho route điều hướng, nhưng làm tham chiếu asset cũ biểu hiện thành lỗi MIME.

Giải pháp là sửa thứ tự release chứ không tắt SPA routing: upload hashed asset trước, upload `index.html` no-cache sau, cuối cùng invalidate CloudFront. Xác minh bằng cách kiểm tra `Content-Type` của asset request, đảm bảo object tồn tại trên S3 và test deep link tách biệt với file JavaScript không tồn tại.

## Các sự cố khác đã xử lý

- `504` qua CloudFront: Gateway gọi được Auth nội bộ nhưng edge không hoàn tất origin path. Nhóm hiệu chỉnh listener/origin protocol và inbound rule ALB dùng CloudFront managed prefix list. Phản hồi `401` cuối cùng chứng minh đường truyền đã phục hồi.
- Gemini OCR `404 model unavailable`: model cũ không còn cho user mới. Nhóm đổi model, build lại OCR image, deploy task revision mới, kiểm tra `/health` và quét hóa đơn thật.
- OIDC bị từ chối assume role: `sub` trong IAM không khớp subject của environment `production`. Trust condition được sửa đúng mà không mở rộng sang mọi repository.

## Khoảng cách còn lại đến production

| Trạng thái demo | Mục tiêu production |
|---|---|
| Một NAT Gateway | một NAT mỗi AZ hoặc VPC endpoint khi có cơ sở |
| RDS Single-AZ | Multi-AZ, deletion protection, kiểm thử restore |
| Một Redis primary | replication group, Multi-AZ, automatic failover |
| Một task mỗi service | tối thiểu hai task cho service quan trọng và autoscaling |
| SES test recipient đã verify | production access, domain identity, DKIM, tự động xử lý bounce/complaint |
| Bucket receipts đã provision | OCR lưu object bằng task-role policy giới hạn |
| Hạ tầng tạo thủ công | IaC tái tạo được và quy trình promote environment |

Các điểm này được ghi nhận như giới hạn thay vì che giấu. Môi trường hiện tại đủ cho demo end-to-end của báo cáo thực tập, nhưng không tuyên bố mức HA/DR vượt quá cấu hình và kiểm thử đã thực hiện.

