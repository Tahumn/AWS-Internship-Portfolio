---
title: "Sự kiện 3 – FCAJ x Agentic AI Build Week: Show Up. Build. Pitch. WIN!"
date: 2026-07-25
weight: 3
chapter: false
pre: " <b> 4.3. </b> "
---

{{% notice info %}}
 **Vai trò:** Người tham dự
{{% /notice %}}

# BÁO CÁO SỰ KIỆN: FCAJ X AGENTIC AI BUILD WEEK – SHOW UP. BUILD. PITCH. WIN!

## Thông tin sự kiện

&emsp;**Tên sự kiện:** FCAJ x Agentic AI Build Week: Show Up. Build. Pitch. WIN!  

&emsp;**Ngày tổ chức:** 25/07/2026  

&emsp;**Địa điểm:** Tầng 26, Tòa nhà Bitexco Financial Tower, số 02 Hải Triều, phường Sài Gòn, Thành phố Hồ Chí Minh  

&emsp;**Hình thức:** Chia sẻ và trình bày các dự án Agentic AI  

&emsp;**Vai trò:** Người tham dự  

---

## Tổng quan sự kiện

Ngày **25/07/2026**, mình tham dự sự kiện **FCAJ x Agentic AI Build Week: Show Up. Build. Pitch. WIN!** tại Tòa nhà Bitexco Financial Tower, Thành phố Hồ Chí Minh.

Sự kiện tập trung vào những kinh nghiệm thực tế khi phát triển sản phẩm Agentic AI trong khoảng thời gian giới hạn. Thông qua phần trình bày của đại diện AWS và các đội dự án, người tham dự được tìm hiểu cách chuyển một ý tưởng thành sản phẩm thử nghiệm, xây dựng bản demo và trình bày giải pháp dựa trên tính khả thi kỹ thuật cùng giá trị kinh doanh.

Chương trình cũng giới thiệu nhiều nội dung về AI Agent, hệ thống Multi-Agent, kiến trúc AWS, phát triển Minimum Viable Product, teamwork và kỹ năng pitching.

---

## Hình ảnh sự kiện

{{< figure
    src="/images/event3_1.jpg"
    title="FCAJ x Agentic AI Build Week: Show Up. Build. Pitch. WIN!"
>}}

---

## Các chủ đề chính

### 1. Agentic AI và tương lai công việc

Phần mở đầu giới thiệu Agentic AI như một hướng phát triển trong đó hệ thống AI không chỉ trả lời từng câu hỏi riêng lẻ.

Một AI Agent có thể:

- Phân tích vấn đề.
- Lập kế hoạch thực hiện.
- Sử dụng các công cụ bên ngoài.
- Duy trì ngữ cảnh.
- Thực hiện nhiều bước để hoàn thành mục tiêu.
- Trả kết quả để con người kiểm tra.

Các diễn giả nhấn mạnh AI nên hỗ trợ nâng cao năng suất thay vì thay thế hoàn toàn khả năng ra quyết định của con người. Con người vẫn cần xác định mục tiêu, kiểm tra kết quả và kiểm soát những hành động quan trọng.

---

### 2. AI Conversational Ordering

Một trong những giải pháp được trình bày là hệ thống đặt món bằng hội thoại dành cho lĩnh vực dịch vụ ăn uống.

Thay vì yêu cầu người dùng mở một ứng dụng riêng, tìm kiếm thực đơn và thực hiện nhiều thao tác, hệ thống cho phép khách hàng đặt món thông qua nền tảng nhắn tin.

AI Agent có thể hỗ trợ:

- Tìm kiếm món ăn.
- Gợi ý sản phẩm phù hợp.
- Thêm hoặc thay đổi sản phẩm trong giỏ hàng.
- Đề xuất chương trình khuyến mãi.
- Tổng hợp thông tin đơn hàng.
- Yêu cầu người dùng xác nhận trước khi gửi đơn.

Một nguyên tắc quan trọng của giải pháp là **Human-in-the-loop**. AI không tự động hoàn tất đơn hàng khi chưa có xác nhận, qua đó giảm rủi ro hiểu sai sản phẩm, số lượng hoặc yêu cầu của khách hàng.

---

### 3. Kiến trúc đa kênh và giám sát

Giải pháp đặt món sử dụng lớp Adapter để chuyển đổi tin nhắn từ nhiều nền tảng giao tiếp về cùng một định dạng.

Thiết kế này mang lại các lợi ích:

- Dễ bổ sung kênh giao tiếp mới.
- Có thể tái sử dụng thành phần xử lý AI.
- Giảm sự phụ thuộc vào một nền tảng.
- Thuận lợi hơn khi bảo trì và mở rộng.

Nhóm cũng xây dựng Dashboard để theo dõi lịch sử hội thoại, phản hồi của AI và các vấn đề vận hành.

Qua đó, mình nhận ra một hệ thống AI thực tế không chỉ cần giao diện chatbot mà còn cần giám sát, logging, xử lý lỗi và cơ chế để con người can thiệp.

---

### 4. Hệ thống Multi-Agent

Một dự án khác giới thiệu cách sử dụng Multi-Agent cho các bài toán phân tích và xây dựng chiến lược.

Thay vì giao toàn bộ công việc cho một Agent, hệ thống chia quy trình cho nhiều Agent chuyên biệt, chẳng hạn:

- Data Collection Agent.
- Analysis Agent.
- Market Evaluation Agent.
- Risk Assessment Agent.
- Strategy Recommendation Agent.

Các Agent phối hợp để tạo ra kết quả cuối cùng.

Cách tiếp cận này giúp phân chia trách nhiệm rõ ràng và cho phép từng thành phần được phát triển độc lập. Tuy nhiên, hệ thống vẫn cần cơ chế điều phối, quản lý trạng thái và kiểm tra kết quả giữa các Agent.

---

### 5. Kiến trúc AWS cho Agentic AI

Các giải pháp được trình bày sử dụng nhiều dịch vụ AWS như:

- **AWS Amplify:** phát triển và triển khai Frontend.
- **AWS WAF:** bảo vệ ứng dụng.
- **Amazon Cognito:** xác thực người dùng.
- **AWS Lambda:** xử lý Backend theo mô hình Serverless.
- **Amazon S3:** lưu trữ tệp và dữ liệu.
- **Amazon DynamoDB:** lưu dữ liệu NoSQL và trạng thái workflow.
- **Amazon Bedrock:** cung cấp mô hình nền tảng.
- **AgentCore:** hỗ trợ xây dựng và vận hành AI Agent.

Kiến trúc cho thấy một ứng dụng AI hoàn chỉnh cần nhiều hơn mô hình ngôn ngữ. Hệ thống còn cần xác thực, lưu trữ, bảo mật, điều phối, giám sát và quản lý chi phí.

---

### 6. Xây dựng MVP

Do thời gian phát triển bị giới hạn, các đội cần kiểm soát phạm vi dự án và ưu tiên những chức năng quan trọng.

Một MVP phù hợp cần thể hiện:

- Vấn đề cần giải quyết.
- Nhóm người dùng mục tiêu.
- Giá trị mà AI mang lại.
- Quy trình hoạt động chính.
- Bản demo có thể sử dụng.
- Khả năng tiếp tục mở rộng.

Bài học quan trọng là một sản phẩm nhỏ nhưng hoạt động được có giá trị hơn một ý tưởng lớn nhưng không thể trình diễn hoàn chỉnh.

---

### 7. Pitching và teamwork

Sự kiện cũng nhấn mạnh vai trò của teamwork và kỹ năng thuyết trình.

Trong một nhóm, các thành viên có thể phụ trách nghiên cứu, thiết kế kiến trúc, lập trình, kiểm thử, giao diện hoặc chuẩn bị phần trình bày.

Một phần pitching hiệu quả cần giải thích rõ:

- Vấn đề.
- Giải pháp đề xuất.
- Người dùng mục tiêu.
- Vai trò của AI.
- Kiến trúc AWS.
- Bản demo sản phẩm.
- Chi phí dự kiến.
- Giá trị kinh doanh.

Chất lượng kỹ thuật rất quan trọng, nhưng đội phát triển cũng cần truyền đạt ý tưởng rõ ràng trong thời gian giới hạn.

---

## Những kiến thức đạt được

Sau khi tham dự sự kiện, mình hiểu rõ hơn về:

- Cách AI Agent lập kế hoạch và thực hiện nhiều bước.
- Sự khác nhau giữa một Agent và hệ thống Multi-Agent.
- Tầm quan trọng của Human-in-the-loop.
- Vai trò của bộ nhớ ngữ cảnh và hệ thống giám sát.
- Cách các dịch vụ AWS hỗ trợ ứng dụng Agentic AI.
- Cách xác định và ưu tiên phạm vi MVP.
- Ảnh hưởng của teamwork và pitching đến kết quả dự án.

Mình cũng nhận ra rằng việc lựa chọn kiến trúc cần dựa trên yêu cầu, bảo mật, khả năng mở rộng, khả năng bảo trì và ngân sách của dự án.

---

## Áp dụng vào dự án

Những kiến thức từ sự kiện có thể áp dụng vào dự án **Cloud Finance Platform – Personal Finance Management System**.

AI Agent trong hệ thống có thể hỗ trợ người dùng:

- Phân tích thu nhập và chi tiêu.
- Giải thích các giao dịch tài chính.
- Phát hiện mức chi tiêu bất thường.
- Cảnh báo khi ngân sách gần vượt giới hạn.
- Gợi ý kế hoạch tiết kiệm cơ bản.
- Tóm tắt tình hình tài chính.

Tuy nhiên, người dùng vẫn cần xác nhận trước khi AI thực hiện các hành động nhạy cảm như xóa giao dịch, chỉnh sửa ngân sách hoặc thay đổi kế hoạch tài chính.

Sự kiện cũng giúp mình nhận thấy dự án nên ưu tiên xây dựng một MVP thực tế trước khi mở rộng thêm các chức năng Agentic AI phức tạp.

---

## Trải nghiệm khi tham dự

Mình tham dự sự kiện với vai trò người nghe và theo dõi các phần trình bày cùng demo sản phẩm.

Điểm mình ấn tượng nhất là các đội không chỉ giới thiệu giải pháp cuối cùng mà còn chia sẻ quá trình phát triển, những khó khăn kỹ thuật và các quyết định phải đưa ra trong thời gian giới hạn.

Sự kiện cho thấy một sản phẩm AI thành công cần kết hợp kỹ thuật, hiểu biết kinh doanh, trải nghiệm người dùng, teamwork và khả năng thuyết trình.

Đây cũng là cơ hội giúp mình có thêm nhiều ý tưởng để áp dụng Agentic AI và các dịch vụ AWS vào dự án học tập và phát triển phần mềm.

---

## Bài học rút ra

- AI cần giải quyết một vấn đề thực tế của người dùng hoặc doanh nghiệp.
- Nên ưu tiên một MVP hoạt động được trước các chức năng nâng cao.
- Những quyết định quan trọng của AI cần có sự xác nhận của con người.
- Hệ thống Multi-Agent cần cơ chế điều phối và kiểm tra kết quả rõ ràng.
- Dịch vụ AWS phải được lựa chọn theo nhu cầu thực tế.
- Giám sát, bảo mật và chi phí cần được xem xét ngay từ giai đoạn thiết kế.
- Teamwork và pitching là những phần quan trọng của quá trình xây dựng sản phẩm.

---

## Kết luận

**FCAJ x Agentic AI Build Week: Show Up. Build. Pitch. WIN!** mang đến nhiều kiến thức thực tế về Agentic AI, kiến trúc AWS và quá trình phát triển sản phẩm trong thời gian giới hạn.

Thông qua các dự án được trình bày, mình hiểu rõ hơn về AI Agent, hệ thống Multi-Agent, Human-in-the-loop, phát triển MVP và kỹ năng pitching.

Những kiến thức và ý tưởng từ sự kiện có thể hỗ trợ quá trình thực tập Cloud Computing và việc tiếp tục phát triển dự án Cloud Finance Platform.