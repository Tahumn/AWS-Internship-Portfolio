---
title: "Các bài blog"
date: 2026-08-05
weight: 3
chapter: false
pre: " <b> 3. </b> "
---

{{% notice warning %}}  
⚠️ **Lưu ý:** Các bài viết dưới đây tổng hợp những chủ đề AWS mình đã tìm hiểu và chia sẻ trong quá trình thực tập.
{{% /notice %}}

###  [Blog 1 - 7 IAM Best Practices giúp bảo vệ AWS Account hiệu quả hơn](3.1-Blog1/)
Blog này giới thiệu bảy nguyên tắc IAM quan trọng giúp tăng cường bảo mật cho AWS Account, bao gồm bảo vệ Root User, bật MFA, áp dụng nguyên tắc Least Privilege, ưu tiên Temporary Credentials và IAM Role, quản lý Access Key cẩn thận, đồng thời sử dụng IAM Access Analyzer và AWS CloudTrail để rà soát quyền truy cập và hoạt động trong tài khoản.

###  [Blog 2 - Amazon ECS Service Auto Scaling – Tự động điều chỉnh tài nguyên theo nhu cầu](3.2-Blog2/)
Blog này giới thiệu Amazon ECS Service Auto Scaling và cách ECS Service có thể tự động điều chỉnh số lượng task dựa trên nhu cầu thực tế của hệ thống. Bài viết cũng trình bày các metric phổ biến như CPU Utilization, Memory Utilization và số request từ Application Load Balancer, cùng một số lưu ý quan trọng khi cấu hình Auto Scaling.

###  [Blog 3 - Quản lý thông tin nhạy cảm trên AWS: Khi file .env không còn là lựa chọn tối ưu](3.3-Blog3/)
Blog này phân tích những rủi ro khi lưu các thông tin nhạy cảm như Database Credential, API Key và Application Secret trực tiếp trong file .env hoặc Docker Image. Bài viết giới thiệu AWS Secrets Manager và AWS Systems Manager Parameter Store như những giải pháp phù hợp hơn để quản lý Secret trong môi trường production.
