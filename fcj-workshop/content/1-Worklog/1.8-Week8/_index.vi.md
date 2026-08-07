---

title: "Worklog Tuần 8"
date: 2026-08-01
weight: 8
chapter: false
pre: " <b> 1.8. </b> "
---

{{% notice warning %}}
⚠️ **Lưu ý:** Nội dung dưới đây phản ánh các hoạt động kiểm thử, đánh giá và hoàn thiện báo cáo thực tế trong tuần thứ tám của chương trình thực tập.
{{% /notice %}}

### Mục tiêu tuần 8

* Kiểm thử end-to-end hệ thống Cloud Finance Platform đã triển khai.
* Xác nhận các luồng chính của ứng dụng, mạng, cơ sở dữ liệu và thông báo.
* Rà soát giao diện, cấu hình bảo mật và chi phí vận hành AWS.
* Ghi nhận và khắc phục các lỗi còn tồn tại.
* Hoàn thiện video demo, tài liệu kỹ thuật, Portfolio và báo cáo thực tập.

---

### Các công việc triển khai trong tuần

| Thứ   | Công việc                                                                                                                                                                                                                                                                                                   | Ngày bắt đầu | Ngày hoàn thành | Nguồn tài liệu                                                                                                                                                               |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Thứ 2 | - Kiểm thử luồng end-to-end từ Frontend qua CloudFront, ALB và Gateway Service đến các Backend Microservices.<br>- Kiểm tra giao tiếp qua ECS Service Connect, kết nối Amazon RDS và log trên Amazon CloudWatch.<br>- Ghi nhận S3 Receipts/Exports là hạng mục chưa tích hợp hoàn chỉnh.                    | 10/08/2026   | 10/08/2026      | Repository đồ án:<br>https://github.com/Tahumn/cloud-finance-platform                                                                                                        |
| Thứ 3 | - Kiểm thử các chức năng xác thực, giao dịch, danh mục, ngân sách và mục tiêu tiết kiệm.<br>- Kiểm thử chức năng lập kế hoạch và giao dịch định kỳ.<br>- Ghi nhận các lỗi chức năng và phản hồi chưa đúng để xử lý.                                                                                         | 11/08/2026   | 11/08/2026      | Repository đồ án:<br>https://github.com/Tahumn/cloud-finance-platform                                                                                                        |
| Thứ 4 | - Kiểm thử các chức năng OCR và AI Agent đã tích hợp.<br>- Kiểm thử luồng Notification API, Redis Queue và Notification Worker.<br>- Gửi email thử nghiệm qua Amazon SES đến identity đã xác minh.<br>- Kiểm tra log ứng dụng và ECS trên Amazon CloudWatch.                                                | 12/08/2026   | 12/08/2026      | Repository đồ án:<br>https://github.com/Tahumn/cloud-finance-platform<br><br>Nguồn học:<br>https://cloudjourney.awsstudygroup.com/<br>https://www.youtube.com/@AWSStudyGroup |
| Thứ 5 | - Kiểm tra giao diện responsive trên các kích thước màn hình khác nhau.<br>- Rà soát AWS WAF, IAM Role, IAM Policy, Security Group và AWS Secrets Manager.<br>- Kiểm tra quyền truy cập tài nguyên và bảo đảm không để lộ thông tin nhạy cảm trong Repository.                                              | 13/08/2026   | 13/08/2026      | Repository đồ án:<br>https://github.com/Tahumn/cloud-finance-platform                                                                                                        |
| Thứ 6 | - Ghi nhận và khắc phục các lỗi triển khai còn tồn tại.<br>- Kiểm tra Health Check của ALB và ECS Service.<br>- Thử nghiệm khả năng khôi phục ECS Task khi container gặp lỗi.<br>- Rà soát mức sử dụng dịch vụ, AWS Budgets và chi phí vận hành dự kiến.                                                    | 14/08/2026   | 14/08/2026      | Nguồn học:<br>https://cloudjourney.awsstudygroup.com/<br>https://www.youtube.com/@AWSStudyGroup                                                                              |
| Thứ 7 | - Quay video demo các chức năng chính của hệ thống.<br>- Hoàn thiện sơ đồ kiến trúc AWS, tài liệu triển khai và tài liệu CI/CD.<br>- Tổng hợp các lỗi đã gặp và giải pháp xử lý.<br>- Cập nhật Worklog tuần 8 và Portfolio Hugo.<br>- Đồng bộ tài liệu cuối cùng lên GitHub và hoàn thiện báo cáo thực tập. | 15/08/2026   | 15/08/2026      | Repository Portfolio:<br>https://github.com/Tahumn/AWS-Internship-Portfolio<br><br>Repository đồ án:<br>https://github.com/Tahumn/cloud-finance-platform                     |

---

### Công việc thực hiện cho dự án cá nhân

**Tên dự án**

Cloud Finance Platform – Personal Finance Management System

**Các nội dung đã thực hiện**

* Kiểm thử luồng end-to-end trên kiến trúc AWS đã triển khai.
* Kiểm tra các chức năng xác thực, tài chính, lập kế hoạch, giao dịch định kỳ, OCR và AI.
* Kiểm thử luồng thông báo qua Redis và gửi email Amazon SES đến identity đã xác minh.
* Kiểm tra ECS Service Connect, kết nối Amazon RDS và log Amazon CloudWatch.
* Kiểm thử giao diện responsive và rà soát các cấu hình bảo mật chính.
* Ghi nhận S3 Receipts/Exports là hạng mục chưa tích hợp hoàn chỉnh.
* Kiểm tra Health Check, khả năng khôi phục ECS Task và chi phí sử dụng AWS.
* Hoàn thiện video demo, tài liệu kiến trúc và báo cáo thực tập.

---

### Kết quả đạt được tuần 8

* Hoàn thành kiểm thử end-to-end các luồng chính của hệ thống.
* Xác nhận hoạt động của Frontend, Backend Microservices, Amazon RDS và Redis.
* Kiểm thử gửi email Amazon SES trong giới hạn Sandbox.
* Ghi nhận và khắc phục các lỗi ứng dụng và triển khai còn tồn tại.
* Rà soát cấu hình bảo mật và chi phí sử dụng dịch vụ AWS.
* Hoàn thiện Worklog, Portfolio, video demo và báo cáo thực tập.
