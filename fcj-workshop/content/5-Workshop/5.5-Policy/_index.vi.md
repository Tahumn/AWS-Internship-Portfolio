---
title: "Kiểm thử, giám sát, bảo mật và chi phí"
date: 2026-08-01
weight: 5
chapter: false
pre: " <b> 5.5. </b> "
---

## 1. Kiểm tra hạ tầng

~~~powershell
aws ecs describe-services --cluster cloud-finance-cluster --services cloud-finance-auth cloud-finance-finance cloud-finance-notifications cloud-finance-notifications-worker cloud-finance-planning cloud-finance-recurring cloud-finance-ocr cloud-finance-ai cloud-finance-gateway --region $region --query "services[].{Service:serviceName,Desired:desiredCount,Running:runningCount,Pending:pendingCount}" --output table
aws elbv2 describe-target-health --target-group-arn TARGET_GROUP_ARN --region $region --output table
curl.exe -i https://CLOUDFRONT_DOMAIN/api/v1/auth/me
~~~

Request chưa đăng nhập phải trả 401, không phải 504. Mã 401 chứng minh CloudFront, ALB, Gateway, Service Connect và Auth đã kết nối được.

## 2. Kế hoạch kiểm thử chức năng

| Test | Thao tác | Kết quả mong đợi |
|---|---|---|
| Xác thực | Google Sign-In hoặc OTP | Có token; onboarding chỉ hiện lần đầu |
| Giao dịch | Thêm thu nhập và chi tiêu | Dashboard và danh sách cập nhật |
| AI đa giao dịch | Nhập một câu tiếng Việt chứa cả thu và chi | Tách, phân loại đúng; tạo mới không hỏi xác nhận |
| Ngân sách/mục tiêu | Tạo ngân sách hoặc mục tiêu | Tạo ngay; sửa/xóa phải xác nhận |
| Định kỳ | Tạo giao dịch định kỳ | Rule được lưu và Recurring xử lý |
| Thông báo | Kích hoạt thông báo giao dịch | API enqueue, worker consume từ Redis |
| OCR | Upload hóa đơn | Trích merchant/amount; lưu hóa đơn và giao dịch |
| WebSocket | Mở trang thông báo | Nhận cập nhật realtime không reload |
| Responsive | Chrome DevTools 390 × 844 | Không tràn ngang; login/dashboard dùng được |

## 3. Log, metric và alarm

Mở **CloudWatch → Log groups → /ecs/cloud-finance/**. Mỗi service phải có log stream. Bằng chứng phù hợp gồm startup hoàn tất, /health 200, RQ worker listening và HTTP status. Không công khai token hoặc dữ liệu cá nhân.

Tạo alarm:

- ALB TargetResponseTime và HTTPCode_Target_5XX_Count.
- ECS CPUUtilization và MemoryUtilization.
- RDS CPUUtilization, FreeStorageSpace, DatabaseConnections.
- ElastiCache CPUUtilization, CurrConnections, Evictions.
- Cảnh báo chi phí bằng AWS Budgets.

Demo đặt retention 14 ngày. Production cần dashboard, người nhận alert và quy trình xử lý sự cố.

## 4. Kiểm tra bảo mật

- S3 bật Block Public Access; CloudFront dùng OAC.
- WAF gắn với CloudFront.
- RDS và Redis không public.
- ALB SG chỉ nhận CloudFront managed prefix list.
- ECS SG chỉ nhận port 8000 từ ALB SG và chính nó.
- Secret inject lúc task startup và không có trong Git.
- GitHub Actions dùng OIDC credential tạm thời.
- CloudFront redirect viewer sang HTTPS.
- Kết nối database/Redis dùng TLS khi được hỗ trợ.

## 5. Đánh giá và tối ưu chi phí

Chi phí demo chạy liên tục chủ yếu đến từ chín Fargate task, NAT Gateway, ALB, RDS và Redis. Số tiền chính xác phụ thuộc CPU/memory, giá Region, traffic, log và Free Tier.

Biện pháp tối ưu:

- Scale ECS desiredCount về 0 ngoài thời gian demo.
- Demo dùng một NAT; production dùng một NAT mỗi AZ.
- Demo dùng một RDS chung với logical database.
- Chỉ dùng RDS Single-AZ và Redis single-node cho non-production.
- Log retention 14 ngày và ECR lifecycle policy.
- Cache static asset ở CloudFront, không cache API/WebSocket.
- Theo dõi Cost Explorer và Budget mỗi ngày trong workshop.

## 6. Kết quả kiểm thử thực tế

| Hạng mục | Kết quả đã ghi nhận | Trạng thái |
|---|---|---|
| ECS | 9 service đều Desired=1, Running=1, Pending=0 | Đạt |
| ALB | Gateway target healthy trên port 8000 | Đạt |
| CloudFront API | /api/v1/auth/me trả 401 khi chưa đăng nhập | Đạt |
| Auth | Google Sign-In và JWT hoạt động; onboarding chỉ hiện lần đầu | Đạt |
| Finance | Tạo thu/chi làm cập nhật dashboard và danh sách | Đạt |
| AI | Một câu có nhiều khoản được tách thành từng giao dịch thu/chi | Đạt |
| Confirmation rule | Tạo giao dịch/ngân sách/mục tiêu không hỏi; sửa/xóa mới hỏi | Đạt |
| Notifications | Notifications API enqueue và RQ worker lắng nghe queue notifications | Đạt |
| OCR | Tesseract/Gemini trích xuất hóa đơn; transaction và metadata được ghi nhận | Đạt sau khi đổi model |
| Responsive | Login và các trang chính dùng được ở 390 × 844 | Đạt |
| CI/CD | OIDC assume role, build/push và deploy chạy được | Đạt sau khi sửa trust policy/wait step |
| SES | Gửi được đến identity đã verify; production access còn phụ thuộc AWS xét duyệt | Giới hạn Sandbox |

## 7. Các lỗi đã gặp và cách xử lý

Việc ghi lại lỗi giúp chứng minh quá trình triển khai thực tế và khả năng troubleshooting.

### 7.1. ECS task không lấy được secret

**Triệu chứng:** ResourceInitializationError, secret không chứa JSON key host.

**Nguyên nhân:** Task definition tham chiếu một JSON key không tồn tại trong RDS managed secret.

**Xử lý:** kiểm tra cấu trúc secret, dùng đúng key hoặc tạo application secret có schema thống nhất; cấp execution role quyền GetSecretValue.

### 7.2. Migration lỗi ký tự phần trăm

**Triệu chứng:** ValueError: invalid interpolation syntax trong DATABASE_URL có password URL-encoded.

**Nguyên nhân:** Alembic ConfigParser xem dấu phần trăm là interpolation token.

**Xử lý:** thay % thành %% trước khi cfg.set_main_option và chạy lại migration; kết quả ExitCode=0.

### 7.3. ECS service treo ở Pending/ExitCode 3

**Triệu chứng:** Uvicorn dừng tại “Will assume transactional DDL”; service liên tục tạo task mới.

**Nguyên nhân:** migration chạy ở application startup và cạnh tranh/giữ lock.

**Xử lý:** tạo migration task riêng; thêm SKIP_MIGRATIONS=true vào service task definition; build/push image mới và rolling update.

### 7.4. CannotPullContainerError

**Triệu chứng:** task definition tham chiếu finance-v5 nhưng tag chưa có trên ECR.

**Xử lý:** docker login ECR, push đúng tag, xác nhận bằng describe-images rồi force new deployment. Quy trình CI/CD sau đó dùng immutable Git SHA để tránh lệch tag.

### 7.5. CloudFront trả 504

**Triệu chứng:** frontend mở được nhưng login/OCR/API timeout.

**Nguyên nhân:** CloudFront gọi ALB bằng HTTP port 80 trong khi ALB SG ban đầu chỉ cho CloudFront prefix list trên 443; sau đó Gateway chưa có Service Connect.

**Xử lý:** đồng bộ origin protocol/listener/SG, bật Service Connect cho các service, kiểm tra auth từ Gateway bằng ECS Exec. Sau sửa, endpoint trả 401 đúng kỳ vọng.

### 7.6. OCR Gemini trả 404 model

**Triệu chứng:** gemini-2.5-flash-lite không còn cấp cho người dùng mới.

**Xử lý:** cập nhật model khả dụng, build/push OCR image, đăng ký task revision mới và force deployment. Health check và OCR hoạt động lại.

### 7.7. GitHub Actions OIDC bị từ chối

**Triệu chứng:** Not authorized to perform sts:AssumeRoleWithWebIdentity.

**Nguyên nhân:** trust policy không khớp repository/environment subject.

**Xử lý:** giới hạn nhưng khai báo đúng GitHub OIDC provider, audience sts.amazonaws.com và subject của environment production.

### 7.8. Workflow chờ ECS quá lâu

**Triệu chứng:** aws ecs wait services-stable vượt quá số lần thử.

**Nguyên nhân:** chờ đồng thời cả chín service khiến một deployment chậm làm toàn job thất bại.

**Xử lý:** kiểm tra event theo từng service, bật deployment circuit breaker/rollback và nên chờ từng service với timeout rõ ràng.

### 7.9. Frontend trả MIME type text/html cho JavaScript

**Nguyên nhân:** index.html cũ tham chiếu asset không còn sau S3 sync hoặc CloudFront cache.

**Xử lý:** upload asset immutable trước, upload index.html với no-cache sau cùng và invalidate /*.

## 8. Đánh giá bảo mật theo lớp

| Lớp | Biện pháp đã áp dụng |
|---|---|
| Edge | HTTPS CloudFront, WAF, private S3 OAC |
| Network | Public/private subnet, SG reference, DB không public |
| Identity | IAM role, GitHub OIDC, MFA cho người quản trị |
| Application | JWT, OTP, Google token verification, onboarding |
| Data | RDS encryption, TLS, logical database và credential theo service |
| Secrets | Secrets Manager/KMS, không commit .env |
| Operations | CloudWatch logs, health checks, Budgets |
| Delivery | Immutable image tag, task revision và rolling update |

## 9. Hạn chế còn lại và hướng production

- Demo dùng một NAT Gateway nên mất AZ đó sẽ ảnh hưởng outbound; production dùng một NAT mỗi AZ.
- RDS đang Single-AZ; production chuyển Multi-AZ, bật deletion protection và kiểm thử restore.
- Redis demo một primary; production dùng replica, automatic failover và Multi-AZ.
- ECS mỗi service một task; production dùng tối thiểu hai task cho service quan trọng và Application Auto Scaling.
- S3 receipts bucket đã provision nhưng OCR upload trực tiếp vào S3 bằng task role vẫn là phần cần hoàn thiện.
- SES có thể còn Sandbox; production cần domain identity, DKIM, bounce/complaint handling.
- Cần bổ sung Infrastructure as Code để tái tạo toàn bộ môi trường nhất quán.
## 10. Phương pháp kiểm thử

Kiểm thử được thực hiện từ trong ra ngoài: kiểm tra container health trước, sau đó gọi service-to-service, kiểm tra ALB target, CloudFront routing và cuối cùng mới kiểm tra luồng trên trình duyệt. Thứ tự này tránh nhầm một edge timeout thành lỗi nghiệp vụ.

Với mỗi kịch bản, nhóm ghi nhận thời gian, input, kết quả mong đợi, HTTP/status quan sát được, CloudWatch Log Group, image tag/task revision đang chạy và vị trí ảnh minh chứng. Token và secret value không xuất hiện trong tài liệu.

## 11. Test case nghiệp vụ và hạ tầng chi tiết

| Mã | Kịch bản và dữ liệu vào | Kết quả mong đợi | Minh chứng quan sát | Kết quả |
|---|---|---|---|---|
| INF-01 | Kiểm tra toàn bộ ECS service | Mỗi service có một task ổn định | 9 service có Desired 1, Running 1, Pending 0 | Đạt |
| INF-02 | Target group gọi `/health` cổng 8000 | Gateway target healthy | IP target `10.0.11.48` ở trạng thái healthy | Đạt |
| INF-03 | ECS Exec từ Gateway đến `http://auth:8000/health` | Service Connect resolve private alias | `{"status":"ok","service":"auth"}` | Đạt |
| INF-04 | Gọi CloudFront `/api/v1/auth/me` không JWT | Request đến Auth và bị từ chối đúng | HTTP 401, `Not authenticated` | Đạt |
| AUTH-01 | Google login lần đầu bằng tài khoản hợp lệ | Tạo tài khoản và mở onboarding | Profile setup chỉ được yêu cầu lần đầu | Đạt |
| AUTH-02 | Đăng nhập lại cùng Google account | Người dùng cũ bỏ qua onboarding | Mở thẳng dashboard | Đạt |
| AUTH-03 | Dùng JWT hết hạn/không hợp lệ | Protected API từ chối | 401, không trả dữ liệu bảo vệ | Đạt |
| FIN-01 | Thêm thu 15.000.000 và chi 50.000 đồng | Có hai giao dịch, số dư đổi đúng | Danh sách và dashboard đồng bộ | Đạt |
| AI-01 | `tôi vừa uống cà phê 50k, được mẹ cho 100k và uống trà sữa hết 50k` | Tạo 3 bản ghi: hai chi, một thu; thay đổi ròng 0 | Giao dịch được tách theo chiều tiền/danh mục, không hỏi xác nhận khi tạo | Đạt |
| AI-02 | `tạo ngân sách mua sắm 7 triệu` | Tạo ngân sách ngay | Bản ghi xuất hiện không cần xác nhận | Đạt |
| AI-03 | Yêu cầu sửa hoặc xóa bản ghi | Phải xác nhận trước thao tác phá hủy | Tạo pending action; xác nhận/hủy quyết định thực thi | Đạt |
| OCR-01 | Upload ảnh hóa đơn rõ | Trích merchant/date/amount và tạo dữ liệu tài chính | OCR trả kết quả sau khi cập nhật Gemini model | Đạt |
| OCR-02 | Mở Hóa đơn và Giao dịch sau OCR | Dữ liệu lưu hiển thị và dashboard thay đổi | Đã kiểm tra metadata/transaction; tự động lưu object S3 vẫn ghi rõ là pending | Một phần |
| NTF-01 | Gọi Notification API tạo job | API enqueue, worker consume queue `notifications` | Worker log có subscribe, scheduler lock và listening | Đạt |
| UI-01 | Mở login/dashboard ở `390 × 844` | Không tràn ngang, control dùng được | Đã kiểm tra Chrome responsive | Đạt |
| CICD-01 | Chạy thủ công Deploy AWS | OIDC, ECR, ECS, S3 và invalidation hoàn tất | Commit SHA truy vết đến ECR tag và task revision | Đạt sau sửa lỗi |
| MAIL-01 | Gửi OTP đến SES recipient đã verify | SMTP/TLS gửi thành công | Địa chỉ verify nhận được email | Đạt với giới hạn Sandbox |

### Tiêu chí nghiệm thu giao dịch AI

Tính năng AI không được nghiệm thu chỉ dựa vào câu trả lời hội thoại. Nhóm kiểm tra tác động thật đến dữ liệu:

1. Câu đầu vào được tách thành ba ý định tài chính.
2. `được mẹ cho 100k` được phân loại là thu nhập; cà phê và trà sữa là chi tiêu.
3. Danh mục được gán riêng, không gộp thành một giao dịch chi 200.000 đồng.
4. Thao tác tạo thực thi ngay.
5. Sửa và xóa vẫn được bảo vệ bằng xác nhận.
6. Tổng Finance được tính lại từ transaction đã persist.

Test này xử lý trực tiếp lỗi cũ khi chatbot hiểu cả câu thành một pending update duy nhất.

### Tiêu chí nghiệm thu OCR

OCR được kiểm tra như một luồng liên service, không chỉ là trích text. Một lần chạy thành công yêu cầu request upload đến Gateway, Gateway resolve OCR qua Service Connect, OCR xử lý ảnh, chuẩn hóa số tiền/ngày/merchant và metadata/transaction được persist qua đúng service sở hữu dữ liệu. Sự cố Gemini `404 model unavailable` được xử lý bằng cách đổi model và redeploy OCR image. Bucket S3 receipts đã provision nhưng tự động lưu object vẫn được ghi rõ là pending, không trình bày như chức năng hoàn tất.

### Tiêu chí nghiệm thu CI/CD

Một build màu xanh chưa đủ. Release chỉ được xem là truy vết được khi:

- GitHub nhận AWS credential tạm thời qua OIDC.
- ECR có đúng tag Git SHA.
- ECS service tham chiếu task-definition revision được tạo từ tag đó.
- Frontend build dùng `/api/v1` và Google Client ID đúng.
- Hashed asset được upload trước `index.html`.
- `index.html` dùng metadata no-cache.
- CloudFront invalidation được tạo.
- Smoke test API sau deploy trả status mong đợi.

## 12. Chỉ số vận hành và cách diễn giải

Môi trường demo tập trung vào tính đúng và khả năng triển khai, không đưa ra tuyên bố load test khi chưa đo. Chỉ số giữ lại cho báo cáo gồm ALB target health, ECS desired/running/pending, container health probe, trạng thái/mã hóa RDS, hoạt động Redis worker, CloudFront status, thời gian workflow và timestamp CloudWatch.

401 từ `/auth/me` là routing test thành công khi không gửi token; 504 thì không. Tương tự, container ở trạng thái RUNNING chưa được xem là đạt cho đến khi health check thành công và service steady state.

## 13. Ánh xạ bằng chứng với nhận định

| Nhận định trong báo cáo | Ảnh hoặc log cần chụp |
|---|---|
| Chín microservice đã triển khai | Bảng ECS Services có desired/running count |
| Service discovery private hoạt động | ECS Exec gọi Auth từ Gateway |
| Gateway nhận traffic qua ALB | Target group có healthy target |
| CloudFront route API được | Curl/Network response `/api/v1/auth/me` |
| Dữ liệu không public | RDS Public access = No cùng SG/subnet |
| Queue xử lý được | CloudWatch log Notification Worker |
| Có CI/CD | GitHub Actions thành công và ECR image tag SHA |
| Có giám sát | CloudWatch log groups, alarms/dashboard |
| Có kiểm soát chi phí | AWS Budgets và cleanup checklist |

Cách ánh xạ này tránh chèn ảnh chỉ để trang trí: mỗi ảnh phải chứng minh một nhận định kỹ thuật trong báo cáo.

## 14. Bằng chứng chức năng trên hệ thống đang chạy

Nhóm chỉ nghiệm thu hạ tầng sau khi các luồng người dùng tạo ra kết quả nghiệp vụ và dữ liệu bền vững đúng mong đợi. Các hình dưới đây liên kết hành vi của ứng dụng với các dịch vụ AWS đã được kiểm tra ở những phần trước.

### 14.1. AI tách nhiều giao dịch

![Trợ lý AI tách một câu thành nhiều giao dịch](/AWS-Internship-Portfolio/images/5-Workshop/Chatbox.png)

Câu tiếng Việt chứa nhiều khoản thu/chi trong cùng một yêu cầu. Trợ lý AI tách từng khoản thành các giao dịch riêng, đồng thời gán loại giao dịch và danh mục phù hợp thay vì cộng thành một số tiền duy nhất. Tổng trên dashboard được cập nhật sau khi dữ liệu được persist. Kết quả này kiểm chứng luồng Browser -> Gateway -> AI Agent -> Gemini -> Finance và quy tắc tạo mới không cần xác nhận; thao tác sửa hoặc xóa có tính phá hủy vẫn phải xác nhận.

### 14.2. Kết quả OCR hóa đơn

![Kết quả trích xuất hóa đơn bằng OCR](/AWS-Internship-Portfolio/images/5-Workshop/OCR.png)

Màn hình OCR hiển thị ảnh hóa đơn đã upload cùng ngày giao dịch, merchant, tổng tiền, giảm giá, loại giao dịch, độ tin cậy và danh mục gợi ý. Điều này chứng minh OCR workload trả dữ liệu có cấu trúc thay vì chỉ trả raw text. Người dùng được kiểm tra kết quả trước khi lưu; phần tự động lưu object hóa đơn vào S3 bucket đã provision vẫn được ghi rõ là tích hợp đang hoàn thiện, tránh phóng đại phạm vi đã làm.

### 14.3. Bằng chứng gửi email qua SES

![Thống kê gửi email Amazon SES tại Singapore](/AWS-Internship-Portfolio/images/5-Workshop/email_ecs.png)

SES dashboard tại `ap-southeast-1` ghi nhận request gửi thành công và không có reject trong khoảng thời gian được chụp. Hình này hỗ trợ kết quả kiểm thử OTP/email thông báo với identity đã verify. Tuy nhiên, nó không đồng nghĩa tài khoản được gửi tự do đến mọi địa chỉ: tài khoản vẫn chịu giới hạn SES Sandbox cho đến khi production access được duyệt. Báo cáo vì vậy phân biệt rõ tích hợp kỹ thuật thành công với quyền gửi production.

### Kết luận từ bằng chứng chức năng

Ba hình chứng minh ba khía cạnh khác nhau: AI điều phối nhiều service, OCR trích xuất dữ liệu từ ảnh và email giao dịch đi qua dịch vụ AWS được quản lý. Chúng bổ sung cho ảnh hạ tầng vì một task ở trạng thái healthy chưa đủ chứng minh nghiệp vụ hoàn tất đúng.
