---
title: "Triển khai end-to-end"
date: 2026-08-01
weight: 4
chapter: false
pre: " <b> 5.4. </b> "
---

Chương này ghi lại đúng trình tự đã dùng để triển khai Cloud Finance tại `ap-southeast-1`. Nội dung được tổ chức theo checkpoint thay vì chỉ liệt kê thao tác trên Console: mỗi lớp được tạo, kiểm tra và chỉ được dùng khi đã đạt điều kiện nghiệm thu. Cách làm này cần thiết vì hệ thống có chín workload triển khai độc lập cùng nhiều thành phần có trạng thái; nếu tạo đồng loạt, lỗi mạng, secret, migration và lỗi ứng dụng sẽ rất khó tách biệt.

Quá trình triển khai được chia thành ba phần có thể thực hiện lại:

1. [Hạ tầng nền, dịch vụ dữ liệu và migration](5.4.1-foundation-data/): các lớp subnet, security group, NAT, RDS, Redis, Secrets Manager, bootstrap và Alembic migration.
2. [ECS, Service Connect và lớp phân phối](5.4.2-runtime-edge/): chín Fargate service, service discovery private, ALB, CloudFront, WAF và tích hợp SES/Gemini.
3. [CI/CD và xác minh triển khai](5.4.3-cicd-verification/): GitHub OIDC, ECR tag bất biến, task revision, phát hành frontend và kiểm tra end-to-end.

{{% notice info %}}
Ảnh trong chương này được chụp từ môi trường demo đã triển khai. Demo chủ động dùng một NAT Gateway, RDS Single-AZ và một Redis primary để kiểm soát chi phí. Multi-AZ cho lớp dữ liệu, một NAT mỗi AZ và autoscaling là mục tiêu production, không phải trạng thái hiện tại.
{{% /notice %}}
