---
title: "Workshop"
date: 2026-08-01
weight: 5
chapter: false
pre: " <b> 5. </b> "
---

# Triển khai nền tảng quản lý tài chính cá nhân Cloud-Native trên AWS

Workshop này hướng dẫn triển khai end-to-end **Cloud Finance Platform (Finanzy)**, một ứng dụng quản lý tài chính cá nhân thực tế sử dụng React, FastAPI microservices, PostgreSQL, Redis, OCR và Google Gemini.

Workshop thể hiện thiết kế kiến trúc, mạng bảo mật, triển khai container, CI/CD, kiểm thử, quan sát hệ thống, tối ưu chi phí và dọn dẹp với CloudFront, WAF, S3, ALB, ECS Fargate, ECR, RDS, ElastiCache, Secrets Manager, CloudWatch và SES.

## Nội dung workshop

1. [Tổng quan](5.1-Workshop-overview/)
2. [Chuẩn bị](5.2-Prerequiste/)
3. [Kiến trúc và mạng](5.3-S3-vpc/)
4. [Triển khai end-to-end](5.4-S3-onprem/)
5. [Kiểm thử, giám sát, bảo mật và chi phí](5.5-Policy/)
6. [Dọn dẹp tài nguyên](5.6-Cleanup/)

{{% notice warning %}}
Đây là triển khai AWS thật. NAT Gateway, ALB, Fargate, RDS, ElastiCache, WAF, Secrets Manager, log và data transfer có thể phát sinh phí. Hãy tạo AWS Budget trước khi tạo tài nguyên tính phí và hoàn thành chương dọn dẹp sau workshop.
{{% /notice %}}