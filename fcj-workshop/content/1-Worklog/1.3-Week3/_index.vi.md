---

title: "Worklog Tuần 3"
date: 2026-07-06
weight: 3
chapter: false
pre: " <b> 1.3. </b> "
----------------------

{{% notice warning %}}
⚠️ **Lưu ý:** Nội dung dưới đây phản ánh các hoạt động học tập và công việc dự án thực tế đã thực hiện trong tuần thứ ba của chương trình thực tập.
{{% /notice %}}

### Mục tiêu tuần 3

* Phân tích yêu cầu nghiệp vụ của dự án Cloud Finance Platform.
* Xác định các nhóm chức năng, microservice và REST API chính.
* Thiết kế kiến trúc hệ thống và mô hình cơ sở dữ liệu ban đầu.
* Nghiên cứu và so sánh các phương án triển khai trên AWS.
* Lựa chọn kiến trúc AWS phù hợp với yêu cầu kỹ thuật của dự án.

---

### Các công việc triển khai trong tuần

| Thứ   | Công việc                                                                                                                                                                                                                                                                                                                                             | Ngày bắt đầu | Ngày hoàn thành | Nguồn tài liệu                                                                                                                                           |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Thứ 2 | - Phân tích yêu cầu nghiệp vụ của hệ thống quản lý tài chính cá nhân.<br>- Xác định các chức năng chính gồm xác thực, tài khoản, giao dịch, ngân sách, mục tiêu tiết kiệm, lập kế hoạch, giao dịch định kỳ, OCR, AI và thông báo.<br>- Xác định phạm vi và thứ tự ưu tiên phát triển ban đầu.                                                         | 06/07/2026   | 06/07/2026      | Repository đồ án:<br>https://github.com/Tahumn/cloud-finance-platform                                                                                    |
| Thứ 3 | - Phân tích cách chia hệ thống thành các microservice độc lập.<br>- Xác định luồng giao tiếp giữa Frontend, Gateway Service và các Backend Microservices.<br>- Xác định các REST API chính cần thiết cho từng nhóm chức năng.                                                                                                                         | 07/07/2026   | 07/07/2026      | Repository đồ án:<br>https://github.com/Tahumn/cloud-finance-platform                                                                                    |
| Thứ 4 | - Phác thảo kiến trúc tổng thể bằng Draw.io và AWS Architecture Icons.<br>- Thiết kế mô hình Entity Relationship Diagram ban đầu.<br>- Phân tích các thực thể và mối quan hệ gồm User, Account, Category, Transaction, Budget, Savings Goal, Planning và Recurring Transaction.<br>- Lựa chọn PostgreSQL làm hệ quản trị cơ sở dữ liệu quan hệ chính. | 08/07/2026   | 08/07/2026      | Nguồn học:<br>https://cloudjourney.awsstudygroup.com/<br>https://www.youtube.com/@AWSStudyGroup                                                          |
| Thứ 5 | - Nghiên cứu kiến trúc Serverless và nguyên lý hoạt động của AWS Lambda.<br>- Tạo và kiểm thử một Lambda Function nhỏ bằng Test Event ở mức Proof of Concept.<br>- Tìm hiểu cách Amazon API Gateway cung cấp REST API và tích hợp với AWS Lambda.                                                                                                     | 09/07/2026   | 09/07/2026      | https://cloudjourney.awsstudygroup.com/<br>https://www.youtube.com/@AWSStudyGroup                                                                        |
| Thứ 6 | - Nghiên cứu Amazon DynamoDB gồm Partition Key, Sort Key, Query, Scan và Global Secondary Index.<br>- So sánh phương án Lambda, API Gateway, DynamoDB với phương án ALB, ECS Fargate và RDS PostgreSQL.<br>- Đánh giá yêu cầu về microservice, WebSocket, xử lý nền và dữ liệu quan hệ của dự án.                                                     | 10/07/2026   | 10/07/2026      | https://cloudjourney.awsstudygroup.com/<br>https://www.youtube.com/@AWSStudyGroup                                                                        |
| Thứ 7 | - Quyết định không sử dụng Lambda, API Gateway và DynamoDB làm kiến trúc triển khai chính.<br>- Lựa chọn ALB, ECS Fargate và Amazon RDS PostgreSQL làm định hướng triển khai cho dự án.<br>- Cập nhật Worklog tuần 3 và tài liệu kiến trúc.<br>- Đồng bộ tài liệu dự án và nội dung Portfolio lên GitHub.                                             | 11/07/2026   | 11/07/2026      | Repository Portfolio:<br>https://github.com/Tahumn/AWS-Internship-Portfolio<br><br>Repository đồ án:<br>https://github.com/Tahumn/cloud-finance-platform |

---

### Công việc thực hiện cho dự án cá nhân

**Tên dự án**

Cloud Finance Platform – Personal Finance Management System

**Các nội dung đã thực hiện**

* Phân tích yêu cầu nghiệp vụ và xác định phạm vi ban đầu của dự án.
* Xác định các nhóm chức năng chính và đề xuất ranh giới giữa các microservice.
* Xác định luồng giao tiếp giữa Frontend, Gateway Service và Backend Microservices.
* Phác thảo kiến trúc tổng thể và mô hình cơ sở dữ liệu ban đầu.
* Lựa chọn PostgreSQL và định hướng sử dụng nhiều logical database cho các microservice.
* Nghiên cứu Lambda, API Gateway và DynamoDB thông qua tài liệu và Proof of Concept nhỏ.
* So sánh phương án Serverless với phương án triển khai container.
* Lựa chọn ALB, ECS Fargate và Amazon RDS PostgreSQL làm kiến trúc triển khai chính.

---

### Kết quả đạt được tuần 3

* Xác định được yêu cầu và phạm vi chức năng chính của Cloud Finance Platform.
* Xây dựng được thiết kế ban đầu cho microservice và REST API.
* Phác thảo sơ đồ kiến trúc hệ thống và Entity Relationship Diagram.
* Có kiến thức thực hành ban đầu về Lambda, API Gateway và DynamoDB.
* Phân biệt rõ phương án Serverless đã nghiên cứu với kiến trúc container được lựa chọn.
* Chuẩn bị nền tảng kỹ thuật cho giai đoạn tiếp tục phát triển ứng dụng và triển khai AWS.
