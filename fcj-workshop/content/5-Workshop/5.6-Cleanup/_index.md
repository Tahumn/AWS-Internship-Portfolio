---
title: "Clean up"
date: 2026-08-01
weight: 6
chapter: false
pre: " <b> 5.6. </b> "
---

## Choose pause or delete

**Short pause:** scale all ECS services to 0. This stops Fargate compute charges, but NAT Gateway, ALB, RDS, ElastiCache, WAF, Secrets Manager, and storage can continue charging.

~~~powershell
$services = @("auth","finance","notifications","notifications-worker","planning","recurring","ocr","ai","gateway")
foreach ($name in $services) {
  aws ecs update-service --cluster cloud-finance-cluster --service "cloud-finance-$name" --desired-count 0 --region $region | Out-Null
}
~~~

**End of workshop:** back up required data and delete billed resources in dependency order.

## Safe deletion order

1. Export required evidence and application data.
2. Create a final manual RDS snapshot if data must be retained.
3. Scale ECS services to 0, then delete all ECS services.
4. Delete ALB listeners, ALB, and target groups.
5. Disable and delete the CloudFront distribution; detach/delete WAF Web ACL.
6. Empty and delete the frontend and receipts S3 buckets.
7. Delete the Redis replication group without a final snapshot unless required.
8. Delete RDS; choose a final snapshot when retention is required.
9. Delete NAT Gateway, wait for Deleted, then release its Elastic IP.
10. Delete unused Secrets Manager secrets, CloudWatch log groups, ECR images/repository, and Cloud Map services/namespace.
11. Delete VPC endpoints if any, then security groups, route tables, subnets, Internet Gateway, and VPC.
12. Review Cost Explorer and AWS Budgets for remaining daily charges.

{{% notice danger %}}
Never delete production data without an approved backup and restore test. RDS snapshots, S3 objects, ECR images, CloudWatch logs, and Secrets Manager recovery windows can still incur storage charges.
{{% /notice %}}

## Verification

~~~powershell
aws ecs list-services --cluster cloud-finance-cluster --region $region
aws rds describe-db-instances --region $region
aws elasticache describe-replication-groups --region $region
aws ec2 describe-nat-gateways --region $region --filter "Name=state,Values=available,pending"
aws elbv2 describe-load-balancers --region $region
~~~

Expected result after full cleanup: no workshop NAT Gateway, ALB, running ECS service, RDS instance, or Redis group remains.

