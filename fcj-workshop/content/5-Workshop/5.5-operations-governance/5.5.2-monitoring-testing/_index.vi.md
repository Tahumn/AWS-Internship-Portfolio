---
title: "Monitoring và kiểm thử nghiệm thu"
date: 2026-08-01
weight: 2
chapter: false
pre: " <b> 5.5.2. </b> "
---

## Nền tảng quan sát

CloudWatch log group được tạo trước khi deploy service để không mất lỗi startup. HTTP service, Notification Worker, database bootstrap và migration task dùng group riêng; log ứng dụng giữ hai tuần nhằm kiểm soát chi phí.

![CloudWatch log group của service và migration task](/images/5-Workshop/CloudWatch.png)

Ảnh cho thấy observability không chỉ bao phủ chín workload chạy lâu dài: `/ecs/cloud-finance/db-bootstrap` và `/ecs/cloud-finance/db-migration` giữ bằng chứng cho schema operation một lần; `/aws/vpc/flowlogs` hỗ trợ điều tra mạng. Tuy nhiên, log group tồn tại chưa đủ kết luận monitoring tốt; log cần được đối chiếu với task ARN, task-definition revision, image tag và thời điểm request.

## Phương pháp kiểm thử theo lớp

Kiểm thử được thực hiện từ trong ra ngoài:

1. kiểm tra startup và health probe của container;
2. gọi private Service Connect alias từ Gateway;
3. kiểm tra ALB target health;
4. gọi API qua CloudFront;
5. chạy luồng người dùng và kiểm tra dữ liệu đã persist.

Thứ tự này tránh nhầm CloudFront timeout thành lỗi Finance/OCR. Task ở trạng thái `RUNNING` chưa được nghiệm thu cho đến khi health probe thành công và ECS deployment đạt steady state.

## Ma trận nghiệm thu hạ tầng

| Kiểm tra | Kết quả mong đợi | Bằng chứng |
|---|---|---|
| Chín ECS service | `Desired=1`, `Running=1`, `Pending=0` | bảng Services và event ECS |
| Gateway target | `/health` cổng 8000 healthy | ALB target health |
| Discovery private | Gateway gọi `http://auth:8000/health` | JSON Auth qua ECS Exec |
| Edge/API | `/api/v1/auth/me` không JWT trả `401` | phản hồi CloudFront, không phải `504` |
| Cô lập database | RDS encrypted, `PubliclyAccessible=False` | cấu hình/metric RDS |
| Queue | API enqueue, worker nghe queue `notifications` | log Notification Worker |
| Truy vết CI/CD | Git SHA ánh xạ ECR tag và task revision | GitHub Actions, ECR, ECS |

Test `401` là kiểm tra routing dương với kết quả authorization âm. Nó chứng minh request đã đến Auth và bị từ chối đúng ranh giới. `504` mới biểu thị lỗi origin hoặc đường nội bộ.

## Nghiệm thu nghiệp vụ

- AI nhận một câu tiếng Việt chứa chi cà phê, khoản được mẹ cho và chi trà sữa; hệ thống tạo ba record đúng chiều thu/chi thay vì gộp thành một số tiền.
- Tạo ngân sách/mục tiêu thực thi không cần xác nhận; sửa và xóa phải xác nhận.
- OCR trả merchant/date/amount có cấu trúc và persist metadata/transaction qua service sở hữu dữ liệu. Tự động lưu object hóa đơn vào S3 vẫn pending.
- Notification API enqueue RQ job và Notification Worker consume.
- Google sign-in yêu cầu onboarding với user lần đầu và bỏ qua ở các lần đăng nhập sau.

![AI tách một câu thành nhiều giao dịch](/images/5-Workshop/Chatbox.png)

![Kết quả OCR hóa đơn có cấu trúc](/images/5-Workshop/OCR.png)

![Bằng chứng SES gửi đến identity đã verify](/images/5-Workshop/email_ecs.png)

Các ảnh được đối chiếu với log và dữ liệu persist. UI riêng lẻ có thể là state cũ; log riêng lẻ chỉ chứng minh request đã chạy, chưa chứng minh dashboard và danh sách giao dịch đã cập nhật.

## Kiểm thử phủ định

JWT hết hạn/không hợp lệ phải trả `401`; RDS/Redis không truy cập trực tiếp từ Internet; GitHub OIDC subject sai không assume được role; Gemini model không còn khả dụng phải tạo lỗi OCR có kiểm soát và không tạo giao dịch sai; SES Sandbox từ chối recipient chưa verify. Ghi nhận các thất bại mong đợi giúp các nhận định bảo mật và error handling có thể đo lường.

