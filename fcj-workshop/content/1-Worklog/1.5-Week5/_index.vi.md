---

title: "Worklog Tuần 5"
date: 2026-07-20
weight: 5
chapter: false
pre: " <b> 1.5. </b> "
----------------------

{{% notice warning %}}
⚠️ **Lưu ý:** Nội dung dưới đây phản ánh các hoạt động thiết kế hạ tầng mạng AWS và triển khai kho lưu trữ Docker Image đã thực hiện trong tuần thứ năm của chương trình thực tập.
{{% /notice %}}

### Mục tiêu tuần 5

* Rà soát và điều chỉnh kiến trúc triển khai AWS của hệ thống.
* Thiết kế Amazon VPC và cấu trúc subnet phục vụ triển khai.
* Cấu hình các thành phần mạng và bảo mật cơ bản.
* Chuẩn bị Docker Image cho các Backend Microservices.
* Lưu trữ và quản lý Docker Image bằng Amazon ECR.
* Cập nhật sơ đồ mạng và tài liệu triển khai.

---

### Các công việc triển khai trong tuần

| Thứ   | Công việc                                                                                                                                                                                                                                                                                                                                     | Ngày bắt đầu | Ngày hoàn thành | Nguồn tài liệu                                                                                                                                                               |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Thứ 2 | - Rà soát kiến trúc AWS hiện tại của Cloud Finance Platform.<br>- Xác định yêu cầu mạng cho các tầng public, application và database.<br>- Lập kế hoạch xây dựng VPC trên hai Availability Zone.                                                                                                                                              | 20/07/2026   | 20/07/2026      | Nguồn học:<br>https://cloudjourney.awsstudygroup.com/<br>https://www.youtube.com/@AWSStudyGroup<br><br>Repository đồ án:<br>https://github.com/Tahumn/cloud-finance-platform |
| Thứ 3 | - Tạo Amazon VPC phục vụ môi trường triển khai.<br>- Thiết kế sáu subnet trên hai Availability Zone, gồm hai Public Subnet, hai Private Application Subnet và hai Private Database Subnet.<br>- Cấu hình Internet Gateway để hỗ trợ kết nối mạng công khai.                                                                                   | 21/07/2026   | 21/07/2026      | https://cloudjourney.awsstudygroup.com/<br>https://www.youtube.com/@AWSStudyGroup                                                                                            |
| Thứ 4 | - Cấu hình Route Table cho các nhóm Public Subnet, Private Application Subnet và Private Database Subnet.<br>- Cấu hình NAT Gateway phục vụ lưu lượng outbound từ các tài nguyên trong Private Application Subnet.<br>- So sánh phương án một NAT Gateway hiện tại với mục tiêu production sử dụng một NAT Gateway cho mỗi Availability Zone. | 22/07/2026   | 22/07/2026      | https://cloudjourney.awsstudygroup.com/                                                                                                                                      |
| Thứ 5 | - Cấu hình Security Group cho Application Load Balancer, ECS Fargate, Amazon RDS và Redis.<br>- Rà soát các luồng kết nối được phép giữa các thành phần của hệ thống.<br>- Sử dụng AWS CLI để kiểm tra một số tài nguyên và cấu hình AWS đã tạo.                                                                                              | 23/07/2026   | 23/07/2026      | Nguồn học:<br>https://cloudjourney.awsstudygroup.com/<br>https://www.youtube.com/@AWSStudyGroup                                                                              |
| Thứ 6 | - Tạo Amazon ECR Private Repository có tên `cloud-finance-backend`.<br>- Chuẩn hóa Dockerfile và quy trình build Docker Image.<br>- Build chín Docker Image tương ứng với chín service của hệ thống.<br>- Sử dụng tag riêng để phân biệt các Image trong cùng một ECR Repository.                                                             | 24/07/2026   | 24/07/2026      | Repository đồ án:<br>https://github.com/Tahumn/cloud-finance-platform                                                                                                        |
| Thứ 7 | - Push các Docker Image đã gắn tag lên Amazon ECR.<br>- Kiểm tra danh sách Image, tag và phiên bản trong ECR Repository.<br>- Chuẩn bị Image URI phục vụ xây dựng ECS Task Definition ở giai đoạn tiếp theo.<br>- Cập nhật sơ đồ VPC, tài liệu triển khai ECR và Worklog tuần 5.<br>- Đồng bộ tài liệu dự án và Portfolio lên GitHub.         | 25/07/2026   | 25/07/2026      | Repository Portfolio:<br>https://github.com/Tahumn/AWS-Internship-Portfolio<br><br>Repository đồ án:<br>https://github.com/Tahumn/cloud-finance-platform                     |

---

### Công việc thực hiện cho dự án cá nhân

**Tên dự án**

Cloud Finance Platform – Personal Finance Management System

**Các nội dung đã thực hiện**

* Rà soát và điều chỉnh kiến trúc triển khai AWS.
* Thiết kế Amazon VPC trên hai Availability Zone.
* Xây dựng cấu trúc sáu subnet cho các tầng public, application và database.
* Cấu hình Internet Gateway, Route Table và NAT Gateway.
* Chuẩn bị Security Group cho các thành phần AWS chính.
* Rà soát các luồng kết nối được phép giữa các tầng của hệ thống.
* Tạo Amazon ECR Private Repository `cloud-finance-backend`.
* Chuẩn hóa quy trình build và gắn tag Docker Image.
* Build, gắn tag và push chín Image của các service lên Amazon ECR.
* Chuẩn bị Image URI cho giai đoạn triển khai Amazon ECS tiếp theo.

---

### Kết quả đạt được tuần 5

* Hoàn thành hạ tầng mạng AWS ban đầu cho dự án.
* Xây dựng được cấu trúc subnet rõ ràng trên hai Availability Zone.
* Cấu hình định tuyến, kết nối outbound và các kiểm soát bảo mật cơ bản.
* Phân biệt được cấu hình NAT hiện tại với mục tiêu High Availability cho production.
* Tạo và quản lý Docker Image của Backend bằng Amazon ECR.
* Chuẩn bị các thành phần mạng và container cần thiết cho giai đoạn triển khai Amazon ECS.
* Cập nhật sơ đồ kiến trúc, Worklog và tài liệu kỹ thuật.
