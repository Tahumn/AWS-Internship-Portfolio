---
title: "Worklog Tuần 5"
date: 2026-07-20
weight: 5
chapter: false
pre: " <b> 1.5. </b> "
---

{{% notice warning %}}
⚠️ **Lưu ý:** Nội dung dưới đây phản ánh quá trình học tập và bắt đầu triển khai hệ thống lên AWS trong tuần thứ năm của chương trình thực tập.
{{% /notice %}}

### Mục tiêu tuần 5

* Bắt đầu triển khai dự án Personal Finance Management System lên nền tảng AWS.
* Chuẩn hóa môi trường triển khai và các Microservices.
* Chuẩn bị hạ tầng AWS phục vụ triển khai hệ thống.
* Triển khai Docker Image lên Amazon ECR và chuẩn bị triển khai trên Amazon ECS.
* Hoàn thiện tài liệu kỹ thuật và Portfolio thực tập.

---

### Các công việc triển khai trong tuần

| Thứ | Công việc | Ngày bắt đầu | Ngày hoàn thành | Nguồn tài liệu |
| ---- | --------- | ------------ | --------------- | -------------- |
| 2 | - Chuẩn hóa Dockerfile cho Frontend và Backend <br>- Hoàn thiện Docker Compose <br>- Chuẩn hóa cấu hình biến môi trường (.env) <br>- Kiểm tra khả năng Container hóa toàn bộ hệ thống | 20/07/2026 | 20/07/2026 | https://cloudjourney.awsstudygroup.com/ |
| 3 | - Rà soát các Microservices <br>- Chuẩn hóa API Endpoint, Authentication và Authorization <br>- Kiểm tra khả năng giao tiếp giữa các Service <br>- Chuẩn bị cấu hình triển khai trên Amazon ECS | 21/07/2026 | 21/07/2026 | AWS Documentation |
| 4 | - Chuẩn bị cấu hình Amazon RDS PostgreSQL <br>- Rà soát mô hình Database-per-Service <br>- Thiết kế cấu trúc lưu trữ Amazon S3 <br>- Phân tích quy trình Upload bằng Presigned URL | 22/07/2026 | 22/07/2026 | AWS Documentation |
| 5 | - Tạo Amazon ECR Repository <br>- Build và Push Docker Image lên Amazon ECR <br>- Thiết kế và cấu hình Amazon VPC <br>- Cấu hình Public Subnet, Private Subnet và Security Group | 23/07/2026 | 23/07/2026 | AWS Documentation |
| 6 | - Chuẩn bị Amazon ECS Cluster, ECS Task Definition và ECS Service <br>- Cấu hình ban đầu cho Application Load Balancer (ALB) <br>- Kiểm tra kết nối giữa Amazon ECS, Amazon RDS và Amazon S3 <br>- Cập nhật Worklog, Portfolio và GitHub Repository | 24/07/2026 | 24/07/2026 | AWS Documentation, GitHub |

---

### Công việc thực hiện cho Project cá nhân

**Tên Project**

Personal Finance Management System

**Các nội dung đã thực hiện**

* Chuẩn hóa Dockerfile và Docker Compose phục vụ triển khai.
* Rà soát và tối ưu kiến trúc Microservices.
* Chuẩn hóa API Endpoint, Authentication và Authorization.
* Kiểm tra khả năng giao tiếp giữa các Service.
* Chuẩn bị cấu hình Amazon RDS PostgreSQL.
* Thiết kế cấu trúc lưu trữ và luồng Upload cho Amazon S3.
* Build và Push Docker Image lên Amazon ECR.
* Thiết kế và cấu hình Amazon VPC, Subnet và Security Group.
* Chuẩn bị Amazon ECS Cluster, ECS Task Definition và ECS Service.
* Thiết lập cấu hình ban đầu cho Application Load Balancer.
* Kiểm tra kết nối giữa các dịch vụ AWS trước khi triển khai chính thức.
* Cập nhật tài liệu triển khai, sơ đồ kiến trúc và Repository của dự án.

---

### Kết quả đạt được tuần 5

* Hoàn thành việc chuẩn hóa môi trường triển khai cho dự án.
* Container hóa thành công hệ thống phục vụ triển khai trên AWS.
* Build và quản lý Docker Image bằng Amazon ECR.
* Chuẩn bị hạ tầng mạng AWS phục vụ triển khai.
* Chuẩn bị cấu hình Amazon ECS và AWS Fargate.
* Chuẩn bị tích hợp Amazon RDS PostgreSQL và Amazon S3.
* Thiết lập cấu hình ban đầu cho Application Load Balancer trong kiến trúc Microservices.
* Cập nhật đầy đủ Worklog, Portfolio và tài liệu kỹ thuật.