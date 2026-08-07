---

title: "Worklog Tuần 6"
date: 2026-07-27
weight: 6
chapter: false
pre: " <b> 1.6. </b> "
----------------------

{{% notice warning %}}
⚠️ **Lưu ý:** Nội dung dưới đây phản ánh các hoạt động triển khai tầng dữ liệu và container thực tế đã thực hiện trong tuần thứ sáu của chương trình thực tập.
{{% /notice %}}

### Mục tiêu tuần 6

* Triển khai tầng dữ liệu bằng Amazon RDS for PostgreSQL và Redis.
* Quản lý thông tin kết nối và cấu hình nhạy cảm bằng AWS Secrets Manager.
* Triển khai các Backend Service bằng Amazon ECS Fargate.
* Thiết lập giao tiếp nội bộ giữa các service bằng ECS Service Connect.
* Kiểm tra kết nối cơ sở dữ liệu và khả năng giao tiếp giữa các service.
* Cập nhật tài liệu về tầng dữ liệu và kiến trúc container.

---

### Các công việc triển khai trong tuần

| Thứ   | Công việc                                                                                                                                                                                                                                                                                                                                                                                                               | Ngày bắt đầu | Ngày hoàn thành | Nguồn tài liệu                                                                                                                                                               |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Thứ 2 | - Khởi tạo Amazon RDS for PostgreSQL phục vụ hệ thống.<br>- Cấu hình RDS Security Group để cho phép ECS Security Group truy cập qua cổng TCP 5432.<br>- Rà soát cấu hình kết nối cơ sở dữ liệu của các Backend Service.                                                                                                                                                                                                 | 27/07/2026   | 27/07/2026      | Nguồn học:<br>https://cloudjourney.awsstudygroup.com/<br>https://www.youtube.com/@AWSStudyGroup<br><br>Repository đồ án:<br>https://github.com/Tahumn/cloud-finance-platform |
| Thứ 3 | - Tạo sáu logical database gồm Auth DB, Finance DB, AI DB, Notification DB, Planning DB và Recurring DB.<br>- Thực thi Alembic migration để khởi tạo schema riêng cho từng logical database.<br>- Kiểm tra khả năng đọc và ghi dữ liệu giữa các Backend Service và Amazon RDS.                                                                                                                                          | 28/07/2026   | 28/07/2026      | Repository đồ án:<br>https://github.com/Tahumn/cloud-finance-platform                                                                                                        |
| Thứ 4 | - Triển khai Redis phục vụ hàng đợi xử lý thông báo.<br>- Thiết lập Notification API enqueue công việc vào Redis.<br>- Thiết lập Notification Worker consume công việc từ Redis.<br>- Đánh giá phương án Redis Multi-AZ cho môi trường production trong tương lai.                                                                                                                                                      | 29/07/2026   | 29/07/2026      | Nguồn học:<br>https://cloudjourney.awsstudygroup.com/<br>https://www.youtube.com/@AWSStudyGroup<br><br>Repository đồ án:<br>https://github.com/Tahumn/cloud-finance-platform |
| Thứ 5 | - Tạo các secret cho kết nối cơ sở dữ liệu, email và dịch vụ bên ngoài trong AWS Secrets Manager.<br>- Cấu hình ECS Task IAM Role để truy cập các secret cần thiết.<br>- Loại bỏ thông tin nhạy cảm khỏi mã nguồn và Docker Image.<br>- Khởi tạo Amazon ECS Cluster và chuẩn bị ECS Task Definition.                                                                                                                    | 30/07/2026   | 30/07/2026      | Repository đồ án:<br>https://github.com/Tahumn/cloud-finance-platform                                                                                                        |
| Thứ 6 | - Cấu hình CPU, Memory, Port Mapping, Environment Variable và Secrets cho ECS Task Definition.<br>- Triển khai chín Backend Service bằng Amazon ECS Fargate trong Private Application Subnet.<br>- Thiết lập ECS Service Connect để các microservice giao tiếp nội bộ.<br>- Kiểm tra trạng thái ECS Task và ECS Service trên AWS Console.                                                                               | 31/07/2026   | 31/07/2026      | Nguồn học:<br>https://cloudjourney.awsstudygroup.com/<br><br>Repository đồ án:<br>https://github.com/Tahumn/cloud-finance-platform                                           |
| Thứ 7 | - Kiểm tra khả năng giao tiếp giữa các service và Amazon RDS.<br>- Ghi nhận và khắc phục lỗi liên quan đến Docker Image, Task Definition, IAM Role và kết nối cơ sở dữ liệu.<br>- Duy trì `desiredCount = 1` cho từng service trong môi trường hiện tại.<br>- Nghiên cứu và đề xuất ECS Auto Scaling Policy cho production nhưng chưa áp dụng vào hệ thống hiện tại.<br>- Cập nhật Worklog tuần 6 và tài liệu kỹ thuật. | 01/08/2026   | 01/08/2026      | Repository Portfolio:<br>https://github.com/Tahumn/AWS-Internship-Portfolio<br><br>Repository đồ án:<br>https://github.com/Tahumn/cloud-finance-platform                     |

---

### Công việc thực hiện cho dự án cá nhân

**Tên dự án**

Cloud Finance Platform – Personal Finance Management System

**Các nội dung đã thực hiện**

* Khởi tạo Amazon RDS for PostgreSQL và cấu hình kết nối qua cổng TCP 5432.
* Tổ chức sáu logical database phục vụ các Backend Microservice.
* Thực thi Alembic migration để khởi tạo các schema cần thiết.
* Triển khai Redis và thiết lập luồng enqueue, consume cho hệ thống thông báo.
* Lưu trữ thông tin kết nối và cấu hình nhạy cảm bằng AWS Secrets Manager.
* Khởi tạo Amazon ECS Cluster và xây dựng ECS Task Definition.
* Triển khai chín Backend Service bằng Amazon ECS Fargate.
* Thiết lập ECS Service Connect phục vụ giao tiếp nội bộ.
* Kiểm tra trạng thái service, kết nối cơ sở dữ liệu và giao tiếp giữa các microservice.
* Ghi nhận cấu hình `desiredCount = 1` hiện tại và đề xuất Auto Scaling cho production.

---

### Kết quả đạt được tuần 6

* Thiết lập được tầng cơ sở dữ liệu chính bằng Amazon RDS for PostgreSQL.
* Khởi tạo sáu logical database thông qua Alembic migration.
* Xây dựng luồng hàng đợi thông báo dựa trên Redis.
* Cải thiện việc quản lý thông tin nhạy cảm bằng AWS Secrets Manager.
* Triển khai chín Backend Service trên Amazon ECS Fargate.
* Thiết lập giao tiếp nội bộ bằng ECS Service Connect.
* Kiểm tra được các kết nối chính giữa ECS Service, Redis và Amazon RDS.
* Cập nhật tài liệu tầng dữ liệu, ECS Fargate và quy trình triển khai.
