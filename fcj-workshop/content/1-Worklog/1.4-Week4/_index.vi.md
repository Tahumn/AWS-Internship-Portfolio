---

title: "Worklog Tuần 4"
date: 2026-07-13
weight: 4
chapter: false
pre: " <b> 1.4. </b> "
----------------------

{{% notice warning %}}
⚠️ **Lưu ý:** Nội dung dưới đây phản ánh các hoạt động học tập và công việc dự án thực tế đã thực hiện trong tuần thứ tư của chương trình thực tập.
{{% /notice %}}

### Mục tiêu tuần 4

* Tiếp tục phát triển dự án Cloud Finance Platform.
* Cải thiện cấu trúc Frontend, Backend và các microservice.
* Tích hợp các chức năng tài chính, xác thực, OCR, AI và thông báo.
* Củng cố môi trường phát triển cục bộ bằng Docker Compose, PostgreSQL và Redis.
* Kiểm thử các API đã xây dựng và cập nhật tài liệu dự án.

---

### Các công việc triển khai trong tuần

| Thứ   | Công việc                                                                                                                                                                                                                                                                                                | Ngày bắt đầu | Ngày hoàn thành | Nguồn tài liệu                                                                                                                                                               |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Thứ 2 | - Rà soát cấu trúc Frontend và Backend hiện có.<br>- Chuẩn hóa thư mục, quy tắc đặt tên và cách tổ chức mã nguồn.<br>- Kiểm tra luồng giao tiếp giữa Frontend, Gateway Service và các Backend Microservices.                                                                                             | 13/07/2026   | 13/07/2026      | Repository đồ án:<br>https://github.com/Tahumn/cloud-finance-platform                                                                                                        |
| Thứ 3 | - Tiếp tục phát triển Gateway Service bằng FastAPI và Socket.IO.<br>- Cải thiện chức năng xác thực, quản lý phiên đăng nhập và phân quyền.<br>- Rà soát quy ước Request, Response và Error Handling cho REST API.                                                                                        | 14/07/2026   | 14/07/2026      | Repository đồ án:<br>https://github.com/Tahumn/cloud-finance-platform                                                                                                        |
| Thứ 4 | - Tiếp tục phát triển chức năng quản lý tài khoản, danh mục và giao dịch.<br>- Bổ sung và cải thiện chức năng ngân sách và mục tiêu tiết kiệm.<br>- Kiểm thử các REST API liên quan trên môi trường local.                                                                                               | 15/07/2026   | 15/07/2026      | Repository đồ án:<br>https://github.com/Tahumn/cloud-finance-platform                                                                                                        |
| Thứ 5 | - Tiếp tục xây dựng chức năng lập kế hoạch và quản lý giao dịch định kỳ.<br>- Phát triển bước đầu OCR Service để nhận dạng thông tin từ hóa đơn.<br>- Tiếp tục tích hợp AI Agent với Gemini để hỗ trợ phân tích và gợi ý tài chính.                                                                      | 16/07/2026   | 16/07/2026      | Repository đồ án:<br>https://github.com/Tahumn/cloud-finance-platform<br><br>Nguồn học:<br>https://cloudjourney.awsstudygroup.com/<br>https://www.youtube.com/@AWSStudyGroup |
| Thứ 6 | - Xây dựng và tích hợp Notification API cùng Notification Worker.<br>- Thiết lập PostgreSQL và Redis phục vụ phát triển và kiểm thử local.<br>- Điều chỉnh Dockerfile, Docker Compose và các biến môi trường cho các service.<br>- Kiểm tra khả năng giao tiếp giữa các microservice đang được tích hợp. | 17/07/2026   | 17/07/2026      | Repository đồ án:<br>https://github.com/Tahumn/cloud-finance-platform                                                                                                        |
| Thứ 7 | - Kiểm thử các chức năng xác thực, giao dịch, lập kế hoạch, OCR và AI trên môi trường local.<br>- Ghi nhận và khắc phục lỗi Frontend, Backend và kết nối cơ sở dữ liệu.<br>- Cập nhật tài liệu API và thiết kế cơ sở dữ liệu.<br>- Cập nhật Worklog tuần 4 và đồng bộ tài liệu dự án lên GitHub.         | 18/07/2026   | 18/07/2026      | Repository Portfolio:<br>https://github.com/Tahumn/AWS-Internship-Portfolio<br><br>Repository đồ án:<br>https://github.com/Tahumn/cloud-finance-platform                     |

---

### Công việc thực hiện cho dự án cá nhân

**Tên dự án**

Cloud Finance Platform – Personal Finance Management System

**Các nội dung đã thực hiện**

* Rà soát và chuẩn hóa cấu trúc Frontend, Backend và các microservice.
* Tiếp tục phát triển Gateway Service bằng FastAPI và Socket.IO.
* Cải thiện chức năng xác thực, quản lý phiên và phân quyền.
* Tiếp tục xây dựng các chức năng tài khoản, danh mục, giao dịch, ngân sách và mục tiêu tiết kiệm.
* Tích hợp chức năng lập kế hoạch và giao dịch định kỳ vào hệ thống.
* Phát triển bước đầu OCR Service và tiếp tục tích hợp AI Agent với Gemini.
* Xây dựng Notification API và Notification Worker.
* Cải thiện môi trường local bằng Docker Compose, PostgreSQL và Redis.
* Kiểm thử các REST API đã xây dựng và khắc phục lỗi trong quá trình tích hợp.

---

### Kết quả đạt được tuần 4

* Cải thiện tính tổ chức và nhất quán của mã nguồn dự án.
* Mở rộng các chức năng quản lý tài chính chính của ứng dụng.
* Tích hợp thêm các thành phần lập kế hoạch, OCR, AI và thông báo.
* Xây dựng môi trường local ổn định hơn để chạy nhiều service.
* Kiểm tra được luồng giao tiếp giữa Frontend, Gateway Service, các microservice và cơ sở dữ liệu.
* Cập nhật tài liệu API, cơ sở dữ liệu và Worklog trên GitHub.
