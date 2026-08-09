---
title: "Hạ tầng nền, dịch vụ dữ liệu và migration"
date: 2026-08-01
weight: 1
chapter: false
pre: " <b> 5.4.1. </b> "
---

## Hiệu chỉnh phạm vi từ kiến trúc sơ khai

Sơ đồ đầu tiên hữu ích khi phân rã domain nhưng không được dùng nguyên trạng làm blueprint triển khai AWS.

![Kiến trúc local sơ khai dùng trong giai đoạn phân rã domain](/images/5-Workshop/KienTrucSoKhai.png)

Sơ đồ còn các thành phần khảo sát như Dify, n8n và Kafka. Các thành phần này được loại khỏi baseline vì source hiện tại không phụ thuộc vào chúng. Runtime cuối dùng FastAPI service, Redis/RQ cho job thông báo, các logical database PostgreSQL, Gemini, Tesseract và SMTP. Giữ ảnh này như một hiện vật lịch sử giúp chứng minh kiến trúc đã được đối chiếu với code chạy thật, không phải sao chép nguyên sơ đồ ban đầu lên AWS.

## Hạ tầng mạng

VPC `10.0.0.0/16` được chia thành ba tầng trên `ap-southeast-1a` và `ap-southeast-1b`:

| Tầng | AZ A | AZ B | Mục đích |
|---|---|---|---|
| Public | `10.0.1.0/24` | `10.0.2.0/24` | ALB và NAT Gateway demo |
| Private application | `10.0.11.0/24` | `10.0.12.0/24` | ENI của Fargate task |
| Private data | `10.0.21.0/24` | `10.0.22.0/24` | RDS và ElastiCache |

Chỉ public subnet route trực tiếp tới Internet Gateway. Private application subnet dùng một NAT Gateway để pull ECR image và gọi Gemini/SES. Private data subnet không có default route ra Internet. Một NAT giúp giảm chi phí demo nhưng tạo phụ thuộc outbound vào một AZ; production cần một NAT cho mỗi AZ.

Bốn security group áp dụng rule tham chiếu: ALB đến ECS TCP 8000, ECS tự tham chiếu cổng 8000, ECS đến PostgreSQL 5432 và ECS đến Redis 6379. Tham chiếu SG thay vì IP task là cần thiết vì Fargate dùng `awsvpc`, ENI thay đổi khi task được thay thế.

## Dịch vụ có trạng thái

RDS PostgreSQL 16.13 được triển khai với mã hóa, không public, lớp `db.t4g.micro` và 20 GiB gp3. Demo dùng một instance chứa sáu logical database: `auth_db`, `finance_db`, `ai_db`, `notifications_db`, `planning_db`, `recurring_db`. Đây là ownership logic, không phải sáu RDS vật lý. Lựa chọn này giữ ranh giới dữ liệu theo service nhưng phù hợp chi phí đồ án; tách instance vẫn là hướng mở rộng khi cần cô lập và scale độc lập.

![Metric RDS PostgreSQL của instance đã triển khai](/images/5-Workshop/rds.png)

ElastiCache Redis cung cấp RQ queue cho Notification Worker và có thể phục vụ cache/pub-sub. Demo dùng một primary; production cần replication group, Multi-AZ và automatic failover.

## Secret và migration có kiểm soát

Cấu hình application, database, Redis, Gemini và SMTP được tách khỏi image và Git. Source có cơ chế Alembic migration khi service khởi động; trong môi trường AWS, sau khi migration có kiểm soát hoàn tất, các service chạy lâu dài phải được cấu hình `SKIP_MIGRATIONS=true` để không cùng chạy DDL khi rolling deployment. Một bootstrap task ngắn hạn tạo logical database; migration task riêng chạy Alembic tuần tự cho từng scope.

~~~powershell
aws ecs run-task `
  --cluster cloud-finance-cluster `
  --launch-type FARGATE `
  --task-definition cloud-finance-db-migration `
  --network-configuration "awsvpcConfiguration={subnets=[PRIVATE_APP_A,PRIVATE_APP_B],securityGroups=[ECS_SG],assignPublicIp=DISABLED}" `
  --overrides file://ecs/migration-overrides.json `
  --region ap-southeast-1
~~~

Mỗi task phải dừng với exit code `0` trước khi chuyển database. Chạy tuần tự phù hợp RDS demo nhỏ và tránh tranh chấp lock/CPU do DDL song song. Sau khi hoàn tất, `SKIP_MIGRATIONS=true` ngăn các task trong rolling deployment cùng chạy migration.

**Checkpoint:** RDS `available`, encrypted và non-public; Redis chỉ nhận kết nối từ ECS; sáu migration scope có exit code zero; log và ảnh không lộ secret value.
