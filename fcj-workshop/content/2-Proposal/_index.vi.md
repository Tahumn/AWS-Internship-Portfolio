---
title: "Bản đề xuất"
date: 2026-06-22
weight: 2
chapter: false
pre: " <b> 2. </b> "
---

# Cloud Finance Platform
## Nền tảng quản lý tài chính cá nhân thông minh trên AWS

### 1. Tóm tắt điều hành

Cloud Finance Platform là nền tảng quản lý tài chính cá nhân được xây dựng nhằm hỗ trợ người dùng theo dõi thu nhập, chi tiêu, tài khoản tài chính, ngân sách, hóa đơn, mục tiêu tiết kiệm và các giao dịch định kỳ trên một hệ thống tập trung.

Bên cạnh các chức năng quản lý tài chính cơ bản, hệ thống tích hợp trí tuệ nhân tạo nhằm hỗ trợ người dùng nhập giao dịch bằng ngôn ngữ tự nhiên, phân loại thu nhập và chi tiêu, phân tích tình hình tài chính và đưa ra gợi ý phù hợp. Chức năng OCR cho phép nhận dạng thông tin từ hình ảnh hóa đơn, giảm thao tác nhập liệu thủ công.

Hệ thống được phát triển theo kiến trúc microservices và triển khai trên Amazon Web Services. Backend gồm 9 service chạy độc lập trên Amazon ECS Fargate. Frontend được lưu trữ trên Amazon S3 và phân phối qua Amazon CloudFront. Dữ liệu nghiệp vụ được lưu trong Amazon RDS for PostgreSQL, Redis được sử dụng làm hàng đợi xử lý thông báo, còn Amazon SES hỗ trợ gửi OTP và email giao dịch.

Mục tiêu của dự án là xây dựng một hệ thống có khả năng triển khai thực tế, bảo mật, dễ giám sát, hỗ trợ CI/CD và có thể mở rộng từ môi trường demo sang production.

### 2. Tuyên bố vấn đề

#### Vấn đề hiện tại

Người dùng thường quản lý tài chính cá nhân bằng sổ tay, bảng tính hoặc nhiều ứng dụng riêng biệt. Phương pháp này dẫn đến một số hạn chế:

- Dữ liệu thu nhập, chi tiêu và tài khoản bị phân tán.
- Người dùng phải nhập giao dịch thủ công.
- Khó theo dõi ngân sách và mục tiêu tiết kiệm.
- Khó phát hiện các khoản chi tiêu bất thường.
- Hóa đơn giấy hoặc hình ảnh hóa đơn chưa được quản lý tập trung.
- Giao dịch định kỳ dễ bị quên hoặc ghi nhận không đúng thời điểm.
- Các báo cáo tài chính thiếu tính trực quan và khả năng phân tích.
- Người dùng chưa nhận được hỗ trợ phù hợp dựa trên dữ liệu tài chính cá nhân.

#### Giải pháp đề xuất

Cloud Finance Platform cung cấp một nền tảng thống nhất với các chức năng:

- Đăng ký, đăng nhập và xác thực người dùng.
- Đăng nhập bằng tài khoản Google.
- Quản lý tài khoản tài chính và nguồn tiền.
- Quản lý giao dịch thu nhập và chi tiêu.
- Phân loại giao dịch theo danh mục.
- Thiết lập và theo dõi ngân sách.
- Quản lý mục tiêu tiết kiệm.
- Quản lý giao dịch định kỳ.
- Nhận dạng hóa đơn bằng OCR.
- Tạo giao dịch từ dữ liệu hóa đơn.
- Trò chuyện với AI bằng ngôn ngữ tự nhiên.
- Phân tích dữ liệu và đưa ra gợi ý tài chính.
- Gửi OTP và thông báo qua email.
- Cung cấp dashboard và báo cáo trực quan.

Hệ thống sử dụng kiến trúc microservices để phân chia chức năng thành các service độc lập. Mỗi service có trách nhiệm nghiệp vụ rõ ràng, có khả năng triển khai và giám sát riêng.

#### Lợi ích và giá trị đầu tư

Giải pháp mang lại các lợi ích:

- Tập trung dữ liệu tài chính cá nhân trên một nền tảng.
- Giảm thời gian nhập liệu thông qua AI và OCR.
- Hỗ trợ kiểm soát chi tiêu và ngân sách.
- Cải thiện khả năng lập kế hoạch tài chính.
- Tăng khả năng theo dõi giao dịch định kỳ.
- Cung cấp kiến trúc có khả năng mở rộng.
- Tăng tính bảo mật nhờ IAM, Security Group, AWS WAF và Secrets Manager.
- Tự động hóa build và triển khai bằng GitHub Actions.
- Cung cấp log và thông tin giám sát tập trung bằng Amazon CloudWatch.

Đây là dự án học thuật và thực tập, vì vậy giá trị chính không được đánh giá bằng thời gian hoàn vốn tài chính. Giá trị của dự án nằm ở khả năng áp dụng kiến thức phát triển phần mềm, microservices, container, DevOps, bảo mật và triển khai cloud vào một hệ thống hoạt động hoàn chỉnh.

### 3. Kiến trúc giải pháp

Cloud Finance Platform được triển khai trong một AWS Region. Hệ thống sử dụng Amazon VPC với các Public Subnet, Private Application Subnet và Private Database Subnet được phân bố trên hai Availability Zone.

Người dùng truy cập frontend thông qua Amazon CloudFront. Frontend là ứng dụng SPA được lưu trong một Amazon S3 private bucket và CloudFront truy cập bucket thông qua Origin Access Control.

Các yêu cầu API và WebSocket được CloudFront chuyển tiếp đến Application Load Balancer. ALB chuyển lưu lượng đến Gateway Service chạy trên Amazon ECS Fargate. Gateway Service tiếp nhận yêu cầu từ client và định tuyến đến các microservice nội bộ thông qua ECS Service Connect và AWS Cloud Map.

Backend gồm 9 service:

1. Gateway Service.
2. Auth Service.
3. Finance Service.
4. AI Agent Service.
5. Notification API.
6. Notification Worker.
7. Planning Service.
8. Recurring Service.
9. OCR Service.

Amazon RDS for PostgreSQL được sử dụng làm cơ sở dữ liệu quan hệ. Môi trường demo sử dụng một RDS instance chứa 6 logical database:

- Auth DB.
- Finance DB.
- AI DB.
- Notification DB.
- Planning DB.
- Recurring DB.

Mô hình này bảo đảm quyền sở hữu dữ liệu theo từng service ở cấp logical database, đồng thời tối ưu chi phí cho môi trường demo. Trong môi trường production, các database có thể được tách thành các RDS instance độc lập khi có yêu cầu cao hơn về hiệu năng, bảo mật hoặc khả năng mở rộng.

Amazon ElastiCache for Redis được sử dụng làm hàng đợi giữa Notification API và Notification Worker. AWS Secrets Manager lưu trữ thông tin nhạy cảm. Amazon CloudWatch thu thập log và metrics. Amazon SES gửi OTP và email thông báo. AI Agent và OCR Service tích hợp với Gemini API thông qua kết nối outbound từ NAT Gateway.

{{< figure
    src="/AWS-Internship-Portfolio/images/5-Workshop/5.1-Workshop-overview/ArchitechtureFinal.drawio.png"
    title="Kiến trúc Cloud Finance Platform - AWS"
>}}

#### Các dịch vụ AWS sử dụng

- **Amazon VPC**: Cách ly và tổ chức tài nguyên mạng của hệ thống.
- **Public Subnet**: Chứa Application Load Balancer và NAT Gateway.
- **Private Application Subnet**: Chứa các ECS Fargate Task.
- **Private Database Subnet**: Chứa Amazon RDS và Redis.
- **Internet Gateway**: Cung cấp kết nối Internet cho Public Subnet.
- **NAT Gateway**: Cung cấp kết nối outbound cho ECS Task trong Private Subnet.
- **Application Load Balancer**: Tiếp nhận và chuyển tiếp lưu lượng đến Gateway Service.
- **Amazon ECS on AWS Fargate**: Chạy các backend microservice dưới dạng container.
- **Amazon ECS Service Connect**: Hỗ trợ service discovery và giao tiếp nội bộ.
- **AWS Cloud Map**: Cung cấp namespace và service discovery cho ECS.
- **Amazon ECR**: Lưu trữ Docker image của backend.
- **Amazon RDS for PostgreSQL**: Lưu trữ dữ liệu nghiệp vụ.
- **Amazon ElastiCache for Redis**: Hỗ trợ queue, cache và pub/sub.
- **Amazon S3**: Lưu trữ frontend và chuẩn bị lưu trữ hóa đơn, ảnh và tệp xuất dữ liệu.
- **Amazon CloudFront**: Phân phối frontend và chuyển tiếp yêu cầu backend.
- **AWS WAF**: Bảo vệ CloudFront khỏi các yêu cầu không hợp lệ.
- **AWS Secrets Manager**: Lưu trữ database credentials, SMTP credentials và API key.
- **Amazon CloudWatch**: Thu thập log, metrics và hỗ trợ giám sát.
- **Amazon SES**: Gửi OTP và email thông báo giao dịch.
- **AWS IAM**: Quản lý quyền truy cập cho người dùng, ECS Task và GitHub Actions.

#### Thiết kế thành phần

- **Frontend**: Cung cấp giao diện dashboard, giao dịch, ngân sách, báo cáo, mục tiêu, hóa đơn và chatbot.
- **Gateway Service**: Là điểm truy cập backend, xử lý REST API và WebSocket.
- **Auth Service**: Quản lý người dùng, JWT, OTP, đăng nhập Google và onboarding.
- **Finance Service**: Quản lý tài khoản, danh mục, giao dịch, ngân sách, mục tiêu và dữ liệu hóa đơn.
- **AI Agent Service**: Phân tích yêu cầu ngôn ngữ tự nhiên và hỗ trợ người dùng quản lý tài chính.
- **Notification API**: Tiếp nhận yêu cầu tạo thông báo và đưa công việc vào Redis.
- **Notification Worker**: Nhận công việc từ Redis và thực hiện gửi thông báo hoặc email.
- **Planning Service**: Quản lý kế hoạch và các gợi ý tài chính.
- **Recurring Service**: Quản lý lịch và giao dịch thu, chi định kỳ.
- **OCR Service**: Nhận dạng nội dung hóa đơn và chuyển dữ liệu đã trích xuất sang Finance Service.

### 4. Triển khai kỹ thuật

#### Các giai đoạn triển khai

Dự án được thực hiện qua các giai đoạn:

1. **Nghiên cứu và phân tích yêu cầu**
   - Nghiên cứu AWS, cloud computing và kiến trúc microservices.
   - Phân tích chức năng của hệ thống.
   - Xác định các service và luồng dữ liệu.

2. **Thiết kế hệ thống**
   - Thiết kế kiến trúc ứng dụng.
   - Thiết kế kiến trúc AWS.
   - Thiết kế ERD và mô hình logical database.
   - Đánh giá Lambda, API Gateway, DynamoDB và ECS Fargate.
   - Lựa chọn ECS Fargate, ALB và RDS PostgreSQL.

3. **Phát triển ứng dụng**
   - Phát triển frontend.
   - Phát triển Gateway và các backend microservice.
   - Tích hợp Gemini, OCR, Redis và email.
   - Kiểm thử hệ thống trên môi trường local bằng Docker Compose.

4. **Triển khai hạ tầng AWS**
   - Tạo VPC, subnet, route table và Security Group.
   - Tạo ECR và push Docker image.
   - Tạo RDS, Redis và Secrets Manager.
   - Chạy database migration.
   - Triển khai các service trên ECS Fargate.
   - Thiết lập ECS Service Connect.

5. **Triển khai frontend và phân phối lưu lượng**
   - Triển khai frontend lên Amazon S3.
   - Cấu hình Amazon CloudFront.
   - Tạo ALB và Target Group.
   - Kết nối CloudFront với ALB.
   - Cấu hình AWS WAF.

6. **Thiết lập CI/CD và giám sát**
   - Cấu hình GitHub Actions OIDC.
   - Build và push backend image theo Git commit SHA.
   - Cập nhật các ECS Service.
   - Build và upload frontend lên S3.
   - Invalidate CloudFront cache.
   - Theo dõi hệ thống bằng CloudWatch.

7. **Kiểm thử và hoàn thiện**
   - Kiểm thử end-to-end.
   - Kiểm thử responsive.
   - Kiểm thử authentication, AI, OCR và notification.
   - Rà soát bảo mật và chi phí.
   - Hoàn thiện tài liệu và video demo.

#### Yêu cầu kỹ thuật

- **Frontend**: React, Vite, JavaScript/JSX, responsive web design.
- **Backend**: Python, FastAPI, Uvicorn và Socket.IO.
- **Cơ sở dữ liệu**: PostgreSQL và Alembic migration.
- **Queue và cache**: Redis và RQ Worker.
- **AI**: Google Gemini API.
- **OCR**: Tesseract OCR kết hợp xử lý và chuẩn hóa dữ liệu.
- **Container**: Docker và Docker Compose.
- **Cloud**: AWS VPC, ECS Fargate, ECR, RDS, ElastiCache, S3, CloudFront, ALB, WAF, SES, Secrets Manager và CloudWatch.
- **CI/CD**: GitHub Actions và OpenID Connect.
- **Quản lý mã nguồn**: Git và GitHub.

### 5. Lộ trình và các mốc triển khai

#### Tuần 1 – Nền tảng và công cụ

- Cài đặt Git, GitHub, Visual Studio Code và Hugo.
- Tìm hiểu tổng quan AWS.
- Làm quen với draw.io và AWS Architecture Icons.
- Khởi tạo Worklog và Portfolio.

#### Tuần 2 – Các dịch vụ AWS cơ bản

- Tìm hiểu IAM, MFA, VPC, EC2, S3 và AWS Budgets.
- Thực hành quản lý tài nguyên AWS.
- Khởi tạo cấu trúc dự án và repository.

#### Tuần 3 – Phân tích và thiết kế

- Phân tích yêu cầu nghiệp vụ.
- Thiết kế microservices và cơ sở dữ liệu.
- Nghiên cứu Lambda, API Gateway và DynamoDB.
- Lựa chọn ECS Fargate, ALB và RDS PostgreSQL.

#### Tuần 4 – Phát triển ứng dụng

- Phát triển frontend và backend.
- Tích hợp AI, OCR và notification.
- Hoàn thiện Docker Compose.
- Kiểm thử hệ thống trên môi trường local.

#### Tuần 5 – Hạ tầng mạng và ECR

- Triển khai VPC với 6 subnet.
- Cấu hình route table, NAT Gateway và Security Group.
- Build và push Docker image lên ECR.

#### Tuần 6 – Dữ liệu và ECS Fargate

- Triển khai RDS PostgreSQL và 6 logical database.
- Triển khai Redis và Secrets Manager.
- Chạy Alembic migration.
- Triển khai 9 service trên ECS Fargate.
- Thiết lập Service Connect.

#### Tuần 7 – Phân phối, bảo mật và CI/CD

- Triển khai ALB, S3, CloudFront và AWS WAF.
- Cấu hình Amazon SES và CloudWatch.
- Thiết lập GitHub Actions OIDC.
- Tự động hóa triển khai backend và frontend.

#### Tuần 8 – Kiểm thử và báo cáo

- Kiểm thử toàn bộ hệ thống.
- Rà soát bảo mật và chi phí.
- Hoàn thiện kiến trúc và tài liệu kỹ thuật.
- Quay video demo.
- Hoàn thiện Worklog, Portfolio và báo cáo thực tập.

### 6. Ước tính ngân sách

Chi phí được ước tính cho môi trường demo triển khai tại AWS Region Asia Pacific (Singapore) – `ap-southeast-1`. Phép tính giả định hệ thống hoạt động liên tục khoảng 730 giờ mỗi tháng, mỗi ECS Service duy trì một task và lưu lượng sử dụng ở mức thấp.

| Dịch vụ AWS | Cấu hình demo | Chi phí ước tính/tháng |
|---|---|---:|
| Amazon ECS on AWS Fargate | 9 service, mỗi service 1 task; cấu hình CPU và bộ nhớ nhỏ | 100–115 USD |
| Amazon RDS for PostgreSQL | 1 `db.t4g.micro`, Single-AZ, 20 GiB gp3, chứa 6 logical database | 18–25 USD |
| Amazon ElastiCache for Redis | 1 Redis node, không bật Multi-AZ trong demo | 15–22 USD |
| NAT Gateway | 1 NAT Gateway và lưu lượng outbound thấp | 35–45 USD |
| Application Load Balancer | 1 ALB, 1 Target Group, lưu lượng thấp | 20–28 USD |
| Amazon S3 | Frontend SPA và bucket receipts/exports, dung lượng thấp | 1–3 USD |
| Amazon CloudFront | Phân phối frontend và chuyển tiếp API, lưu lượng demo | 1–5 USD |
| Amazon ECR | Lưu trữ backend Docker image và các phiên bản image | 1–4 USD |
| AWS Secrets Manager | Các secret cho database, Gemini, Redis và SMTP | 2–5 USD |
| Amazon CloudWatch | Log Group của các ECS Service, metrics và thời hạn lưu log 14 ngày | 3–10 USD |
| AWS WAF | 1 Web ACL, các managed rule và số lượng request thấp | 6–12 USD |
| Amazon SES | OTP và email thông báo với số lượng thử nghiệm thấp | Dưới 1 USD |
| AWS IAM, Security Group và AWS Budgets | Không thu phí trực tiếp | 0 USD |
| **Tổng cộng ước tính** | **Môi trường demo hoạt động liên tục** | **Khoảng 202–275 USD/tháng** |

Quy đổi theo tỷ giá tham khảo `1 USD ≈ 25.000 VNĐ`, tổng chi phí vận hành liên tục tương đương khoảng:

- **5.050.000–6.875.000 VNĐ/tháng**.
- **168.000–229.000 VNĐ/ngày**.

Đây là mức ước tính khi các tài nguyên có tính phí theo giờ được duy trì liên tục. Chi phí thực tế có thể thấp hoặc cao hơn tùy theo cấu hình CPU, bộ nhớ của từng ECS Task, lượng log, dữ liệu truyền qua NAT Gateway, số lượng request và thời gian tài nguyên được duy trì.

#### Phương án tối ưu chi phí cho môi trường demo

Hệ thống áp dụng các biện pháp sau để giới hạn chi phí:

- Sử dụng một NAT Gateway thay vì một NAT Gateway cho mỗi Availability Zone.
- Sử dụng một RDS PostgreSQL instance chứa 6 logical database.
- Sử dụng RDS Single-AZ thay vì Multi-AZ trong môi trường demo.
- Sử dụng một Redis node và chưa bật automatic failover.
- Duy trì `desiredCount = 1` cho mỗi ECS Service.
- Giới hạn thời gian lưu CloudWatch Logs ở mức 14 ngày.
- Sử dụng một backend Docker image dùng chung cho 9 ECS Service.
- Chỉ duy trì các phiên bản Docker image cần thiết trên Amazon ECR.
- Cấu hình AWS Budgets và cảnh báo chi phí.
- Giảm `desiredCount` của ECS Service về `0` khi không cần chạy backend.
- Xóa NAT Gateway và giải phóng Elastic IP khi kết thúc giai đoạn demo dài ngày.
- Xóa ALB, Redis và RDS sau khi đã hoàn thành báo cáo nếu không còn nhu cầu sử dụng.
- Tạo RDS snapshot trước khi xóa database nếu cần bảo toàn dữ liệu.

#### Các thành phần phát sinh chi phí chính

- **Amazon ECS Fargate**: Chi phí CPU và bộ nhớ của 9 service.
- **Amazon RDS for PostgreSQL**: Chi phí DB instance, storage và backup.
- **Amazon ElastiCache for Redis**: Chi phí cache node.
- **NAT Gateway**: Chi phí theo giờ và dung lượng dữ liệu xử lý.
- **Application Load Balancer**: Chi phí theo giờ và Load Balancer Capacity Unit.
- **Amazon CloudFront**: Chi phí request và data transfer.
- **Amazon S3**: Chi phí lưu trữ và request.
- **Amazon ECR**: Chi phí lưu trữ Docker image.
- **AWS Secrets Manager**: Chi phí theo số lượng secret và API call.
- **Amazon CloudWatch**: Chi phí lưu trữ log, metrics và alarm.
- **Amazon SES**: Chi phí theo số lượng email gửi.
- **AWS WAF**: Chi phí Web ACL, rule và request.

Để tối ưu chi phí, hệ thống áp dụng:

- Một NAT Gateway thay vì một NAT Gateway cho mỗi Availability Zone.
- Một RDS instance chứa 6 logical database.
- RDS Single-AZ.
- Redis single-node.
- Mỗi ECS Service duy trì `desiredCount = 1`.
- CloudWatch Log Group sử dụng chính sách retention giới hạn.
- AWS Budgets được cấu hình để cảnh báo chi phí.
- Các tài nguyên không cần thiết được dừng hoặc xóa sau quá trình demo.

### 7. Đánh giá rủi ro

#### Ma trận rủi ro

- **Chi phí AWS vượt dự kiến**: Ảnh hưởng cao, xác suất trung bình.
- **ECS Task không khởi động được**: Ảnh hưởng cao, xác suất trung bình.
- **Lỗi kết nối giữa các microservice**: Ảnh hưởng cao, xác suất trung bình.
- **Lỗi database migration**: Ảnh hưởng cao, xác suất trung bình.
- **Rò rỉ thông tin nhạy cảm**: Ảnh hưởng rất cao, xác suất thấp.
- **Gemini API không khả dụng hoặc thay đổi model**: Ảnh hưởng trung bình, xác suất trung bình.
- **Amazon SES bị giới hạn trong Sandbox**: Ảnh hưởng trung bình, xác suất cao trong giai đoạn demo.
- **NAT Gateway Single-AZ gặp sự cố**: Ảnh hưởng cao, xác suất thấp.
- **S3 Receipts/Exports chưa tích hợp hoàn chỉnh**: Ảnh hưởng trung bình, xác suất hiện hữu.

#### Chiến lược giảm thiểu

- Thiết lập AWS Budgets và theo dõi chi phí thường xuyên.
- Sử dụng ECS health check và ALB health check.
- Sử dụng Service Connect để hỗ trợ service discovery.
- Chạy migration độc lập và kiểm tra exit code trước khi triển khai service.
- Lưu thông tin nhạy cảm trong AWS Secrets Manager.
- Không lưu Access Key dài hạn trong GitHub.
- Sử dụng GitHub Actions OIDC để xác thực với AWS.
- Sử dụng tag Docker image theo Git commit SHA để hỗ trợ rollback.
- Theo dõi log và metrics trong CloudWatch.
- Xác minh email identity khi SES vẫn ở Sandbox.
- Chuẩn bị phương án thay đổi Gemini model khi model cũ bị ngừng hỗ trợ.

#### Kế hoạch dự phòng

- Rollback ECS Service về Task Definition hoặc Docker image trước đó.
- Giảm `desiredCount` về 0 khi cần tạm dừng dịch vụ và chi phí Fargate.
- Khôi phục database từ RDS snapshot khi cần thiết.
- Chuyển sang thao tác nhập giao dịch thủ công nếu AI hoặc OCR tạm thời không khả dụng.
- Sử dụng email identity đã xác minh trong thời gian chờ SES Production Access.
- Tách logical database thành các RDS instance riêng khi production yêu cầu cách ly cao hơn.

### 8. Kết quả kỳ vọng

#### Kết quả kỹ thuật

- Hoàn thiện nền tảng quản lý tài chính cá nhân hoạt động trên AWS.
- Triển khai thành công 9 microservice trên Amazon ECS Fargate.
- Thiết lập giao tiếp nội bộ bằng ECS Service Connect.
- Triển khai frontend bằng Amazon S3 và CloudFront.
- Kết nối hệ thống với RDS PostgreSQL và Redis.
- Tích hợp AI Agent, Gemini và OCR.
- Hỗ trợ OTP và thông báo email bằng Amazon SES.
- Thiết lập giám sát bằng Amazon CloudWatch.
- Bảo vệ hệ thống bằng AWS WAF, IAM và Security Group.
- Xây dựng quy trình CI/CD bằng GitHub Actions OIDC.
- Cung cấp giao diện responsive cho máy tính và thiết bị di động.

#### Giá trị dài hạn

- Có thể mở rộng từ môi trường demo sang production.
- Có thể chuyển RDS và Redis sang Multi-AZ.
- Có thể triển khai NAT Gateway cho từng Availability Zone.
- Có thể áp dụng ECS Service Auto Scaling.
- Có thể tách các logical database thành RDS instance độc lập.
- Có thể chuyển từ Gemini sang Amazon Bedrock hoặc nhà cung cấp AI khác.
- Có thể hoàn thiện S3 Receipts/Exports và quy trình Presigned URL.
- Có thể mở rộng nền tảng thành sản phẩm quản lý tài chính cho nhiều nhóm người dùng.