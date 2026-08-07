---
title: "Dọn dẹp tài nguyên"
date: 2026-08-01
weight: 6
chapter: false
pre: " <b> 5.6. </b> "
---

## Chọn tạm dừng hoặc xóa

**Tạm dừng ngắn:** scale toàn bộ ECS service về 0. Việc này dừng phí Fargate compute, nhưng NAT Gateway, ALB, RDS, ElastiCache, WAF, Secrets Manager và storage vẫn có thể tiếp tục tính phí.

~~~powershell
$services = @("auth","finance","notifications","notifications-worker","planning","recurring","ocr","ai","gateway")
foreach ($name in $services) {
  aws ecs update-service --cluster cloud-finance-cluster --service "cloud-finance-$name" --desired-count 0 --region $region | Out-Null
}
~~~

**Kết thúc workshop:** backup dữ liệu cần thiết và xóa tài nguyên tính phí đúng thứ tự phụ thuộc.

## Thứ tự xóa an toàn

1. Xuất hình bằng chứng và dữ liệu ứng dụng cần giữ.
2. Tạo manual RDS snapshot cuối nếu cần giữ dữ liệu.
3. Scale ECS về 0, sau đó xóa toàn bộ ECS service.
4. Xóa ALB listener, ALB và target group.
5. Disable rồi xóa CloudFront distribution; gỡ và xóa WAF Web ACL.
6. Empty rồi xóa frontend/receipts S3 bucket.
7. Xóa Redis replication group; chỉ tạo final snapshot nếu cần.
8. Xóa RDS; chọn final snapshot nếu cần lưu dữ liệu.
9. Xóa NAT Gateway, chờ Deleted rồi release Elastic IP.
10. Xóa secret không dùng, CloudWatch Log Group, ECR image/repository và Cloud Map service/namespace.
11. Xóa VPC endpoint nếu có, rồi Security Group, route table, subnet, Internet Gateway và VPC.
12. Kiểm tra Cost Explorer và AWS Budgets để phát hiện phí còn lại.

{{% notice danger %}}
Không xóa dữ liệu production khi chưa có backup được phê duyệt và kiểm thử restore. RDS snapshot, S3 object, ECR image, CloudWatch log và thời gian recovery của Secrets Manager vẫn có thể phát sinh phí lưu trữ.
{{% /notice %}}

## Kiểm tra sau cleanup

~~~powershell
aws ecs list-services --cluster cloud-finance-cluster --region $region
aws rds describe-db-instances --region $region
aws elasticache describe-replication-groups --region $region
aws ec2 describe-nat-gateways --region $region --filter "Name=state,Values=available,pending"
aws elbv2 describe-load-balancers --region $region
~~~

Sau full cleanup không còn NAT Gateway, ALB, ECS service đang chạy, RDS instance hoặc Redis group của workshop.

