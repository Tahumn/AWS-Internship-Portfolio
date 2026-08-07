---

title: "Worklog Tuần 7"
date: 2026-08-03
weight: 7
chapter: false
pre: " <b> 1.7. </b> "
----------------------

{{% notice warning %}}
⚠️ **Lưu ý:** Nội dung dưới đây phản ánh các hoạt động triển khai và vận hành thực tế trong tuần thứ bảy của chương trình thực tập.
{{% /notice %}}

### Mục tiêu tuần 7

* Phân phối lưu lượng Backend thông qua Application Load Balancer.
* Triển khai phiên bản production của Frontend bằng Amazon S3 và CloudFront.
* Cấu hình AWS WAF, Amazon SES và Amazon CloudWatch.
* Provision tài nguyên S3 Receipts/Exports.
* Thiết lập quy trình CI/CD bằng GitHub Actions và AWS OIDC.
* Cập nhật sơ đồ triển khai và tài liệu kỹ thuật.

---

### Các công việc triển khai trong tuần

| Thứ   | Công việc                                                                                                                                                                                                                                                                                                                                                                                                                      | Ngày bắt đầu | Ngày hoàn thành | Nguồn tài liệu                                                                                                                                                               |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Thứ 2 | - Triển khai Application Load Balancer trên hai Public Subnet.<br>- Tạo Target Group cho Gateway Service.<br>- Cấu hình Listener, quy tắc chuyển tiếp và Health Check.<br>- Kiểm tra luồng truy cập từ ALB đến Gateway Service trên Amazon ECS Fargate.                                                                                                                                                                        | 03/08/2026   | 03/08/2026      | Nguồn học:<br>https://cloudjourney.awsstudygroup.com/<br>https://www.youtube.com/@AWSStudyGroup<br><br>Repository đồ án:<br>https://github.com/Tahumn/cloud-finance-platform |
| Thứ 3 | - Build phiên bản production của Frontend.<br>- Tạo Amazon S3 Bucket để lưu trữ Static Web Application.<br>- Upload các tệp Frontend đã build lên Amazon S3.<br>- Cấu hình Amazon CloudFront để phân phối Frontend và chuyển các yêu cầu Backend đến ALB.<br>- Kiểm tra khả năng truy cập website thông qua CloudFront.                                                                                                        | 04/08/2026   | 04/08/2026      | Repository đồ án:<br>https://github.com/Tahumn/cloud-finance-platform<br><br>Nguồn học:<br>https://cloudjourney.awsstudygroup.com/                                           |
| Thứ 4 | - Cấu hình AWS WAF để bảo vệ CloudFront Distribution.<br>- Cấu hình Amazon SES phục vụ email xác thực, OTP, khôi phục mật khẩu và thông báo.<br>- Ghi nhận Amazon SES đang hoạt động trong Sandbox và chỉ gửi thử nghiệm đến các identity đã xác minh.<br>- Cấu hình Amazon CloudWatch Logs và theo dõi trạng thái ECS Task, CPU, Memory và Network.<br>- Rà soát IAM Role, IAM Policy và Security Group.                      | 05/08/2026   | 05/08/2026      | https://cloudjourney.awsstudygroup.com/<br>https://www.youtube.com/@AWSStudyGroup                                                                                            |
| Thứ 5 | - Provision Amazon S3 Bucket phục vụ lưu trữ hóa đơn và tệp xuất dữ liệu.<br>- Chuẩn bị cấu trúc thư mục, Bucket Policy và quyền truy cập cần thiết.<br>- Cập nhật thiết kế luồng OCR Service đọc và ghi dữ liệu với S3 Receipts/Exports.<br>- Ghi nhận việc tích hợp ứng dụng, Presigned URL và kiểm thử upload/download vẫn đang chờ hoàn thiện.                                                                             | 06/08/2026   | 06/08/2026      | Repository đồ án:<br>https://github.com/Tahumn/cloud-finance-platform                                                                                                        |
| Thứ 6 | - Xây dựng GitHub Actions workflow cho Continuous Integration và triển khai.<br>- Cấu hình GitHub Actions OIDC để xác thực với AWS.<br>- Build một Backend Docker Image dùng chung.<br>- Push Backend Image lên Amazon ECR bằng tag bất biến theo Git commit SHA.<br>- Cấu hình mỗi ECS Service sử dụng Image dùng chung nhưng thực thi command riêng.<br>- Xây dựng workflow triển khai Frontend lên Amazon S3 và CloudFront. | 07/08/2026   | 07/08/2026      | Repository đồ án:<br>https://github.com/Tahumn/cloud-finance-platform                                                                                                        |
| Thứ 7 | - Kiểm tra quy trình CI/CD từ GitHub Actions đến Amazon ECR, ECS, S3 và CloudFront.<br>- Kiểm tra ALB Routing, CloudFront, WAF và CloudWatch Logs.<br>- Theo dõi yêu cầu Amazon SES Production Access.<br>- Cập nhật Worklog tuần 7, sơ đồ triển khai và tài liệu kỹ thuật.<br>- Đồng bộ tài liệu Portfolio và đồ án lên GitHub.                                                                                               | 08/08/2026   | 08/08/2026      | Repository Portfolio:<br>https://github.com/Tahumn/AWS-Internship-Portfolio<br><br>Repository đồ án:<br>https://github.com/Tahumn/cloud-finance-platform                     |

---

### Công việc thực hiện cho dự án cá nhân

**Tên dự án**

Cloud Finance Platform – Personal Finance Management System

**Các nội dung đã thực hiện**

* Triển khai Application Load Balancer và cấu hình routing đến Gateway Service.
* Triển khai Frontend bằng Amazon S3 và CloudFront, không sử dụng Amazon ECS Fargate.
* Cấu hình AWS WAF để bảo vệ CloudFront Distribution.
* Cấu hình Amazon SES trong Sandbox để gửi email thử nghiệm đến identity đã xác minh.
* Cấu hình Amazon CloudWatch Logs và theo dõi cơ bản tài nguyên ECS.
* Provision S3 Receipts/Exports Bucket và chuẩn bị cấu hình quyền truy cập.
* Ghi nhận phần tích hợp ứng dụng với S3 Receipts/Exports vẫn đang chờ hoàn thiện.
* Xây dựng GitHub Actions workflow sử dụng AWS OIDC.
* Build và push một Backend Image dùng chung với tag Git commit SHA bất biến.
* Cấu hình từng ECS Service thực thi command riêng từ Backend Image dùng chung.

---

### Kết quả đạt được tuần 7

* Thiết lập được luồng truy cập từ CloudFront qua ALB đến Gateway Service.
* Triển khai Frontend dưới dạng Static Web Application bằng Amazon S3 và CloudFront.
* Bổ sung WAF, CloudWatch và khả năng gửi email thử nghiệm bằng Amazon SES.
* Chuẩn bị tài nguyên S3 Receipts/Exports nhưng không ghi nhận sai rằng phần tích hợp đã hoàn thành.
* Thiết lập quy trình CI/CD cho Backend và Frontend.
* Cập nhật sơ đồ kiến trúc AWS, Worklog và tài liệu kỹ thuật.
