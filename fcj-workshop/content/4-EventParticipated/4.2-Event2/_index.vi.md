---
title: "Event 3"
date: 2024-01-01
weight: 3
chapter: false
pre: " <b> 4.3. </b> "
---

{{% notice warning %}}
⚠️ **Lưu ý:** Các thông tin dưới đây chỉ nhằm mục đích tham khảo, vui lòng **không sao chép nguyên văn** cho bài báo cáo của bạn.
{{% /notice %}}

# Bài thu hoạch sự kiện AWS Agentic AI Build Week & Hackathon Sharing

## Mục đích của sự kiện

Sự kiện được tổ chức nhằm chia sẻ những kiến thức và kinh nghiệm thực tế trong quá trình xây dựng sản phẩm tại chương trình **AWS Agentic AI Build Week & Hackathon**. Nội dung tập trung vào xu hướng Agentic AI, cách thiết kế hệ thống AI trên nền tảng Amazon Web Services (AWS), kinh nghiệm phát triển sản phẩm trong thời gian giới hạn và bài học làm việc nhóm từ các đội thi đạt giải.

Thông qua phần trình bày của đại diện AWS và các đội tham gia Hackathon, người tham dự có cơ hội:

- Hiểu rõ hơn về Agentic AI và mô hình Multi-Agent.
- Tìm hiểu cách xây dựng sản phẩm AI từ ý tưởng đến phiên bản MVP.
- Tiếp cận kiến trúc ứng dụng AI sử dụng các dịch vụ AWS.
- Học hỏi kinh nghiệm tối ưu chi phí và khả năng mở rộng hệ thống.
- Hiểu vai trò của teamwork, quản lý thời gian và kỹ năng thuyết trình.
- Nhận thức rõ hơn về việc kết hợp AI với nhu cầu thực tế của doanh nghiệp.

---

# Các chủ đề nổi bật của sự kiện

## 1. Agentic AI và tư duy đổi mới trong tương lai

Mở đầu chương trình, đại diện AWS chia sẻ về sự phát triển nhanh chóng của AI và những thay đổi mà công nghệ này có thể tạo ra trong công việc. AI trong tương lai không chỉ dừng lại ở việc trả lời câu hỏi mà có thể hoạt động như một Agent có khả năng phân tích, lập kế hoạch, sử dụng công cụ và thực hiện nhiều bước để hoàn thành một mục tiêu.

Diễn giả nhấn mạnh rằng AI không thay thế hoàn toàn con người. Con người vẫn giữ vai trò xác định mục tiêu, kiểm tra kết quả và quyết định cách sử dụng công nghệ. Vì vậy, mỗi cá nhân cần duy trì tinh thần học tập liên tục, chủ động thử nghiệm và sẵn sàng thay đổi những cách làm cũ khi công nghệ phát triển.

Một số thông điệp nổi bật gồm:

- Không nên giới hạn bản thân trong các phương pháp đã có sẵn.
- Cần chủ động học hỏi và thử nghiệm công nghệ mới.
- AI nên được xem là công cụ hỗ trợ nâng cao năng suất.
- Con người vẫn phải kiểm soát các quyết định quan trọng.
- Khả năng thích nghi là kỹ năng cần thiết trong ngành Công nghệ thông tin.

---

## 2. AI Conversational Ordering – Đặt món qua hội thoại

Một trong những dự án nổi bật tại sự kiện là giải pháp **AI Conversational Ordering** dành cho lĩnh vực thức ăn nhanh.

Nhóm phát triển nhận thấy rằng quá trình đặt món qua ứng dụng truyền thống có thể gây bất tiện vì khách hàng phải chuyển sang một nền tảng khác, đăng nhập, tìm kiếm món ăn và thực hiện nhiều thao tác. Vì vậy, nhóm xây dựng một AI Agent cho phép người dùng đặt món trực tiếp thông qua các nền tảng nhắn tin như Zalo hoặc WhatsApp.

AI có thể hỗ trợ người dùng:

- Tìm kiếm món ăn trong thực đơn.
- Tư vấn món ăn phù hợp.
- Thêm hoặc thay đổi sản phẩm trong giỏ hàng.
- Gợi ý chương trình khuyến mãi.
- Kiểm tra lại thông tin đơn hàng.
- Xác nhận đơn trước khi hoàn tất.

Giải pháp giúp rút ngắn quy trình đặt hàng, giảm số bước thao tác và tạo cảm giác tự nhiên hơn khi người dùng giao tiếp với hệ thống.

Một điểm quan trọng là AI không tự động hoàn tất đơn hàng ngay sau khi hiểu yêu cầu. Hệ thống sẽ hiển thị lại toàn bộ thông tin để khách hàng xác nhận. Cách làm này giúp hạn chế rủi ro khi AI hiểu sai số lượng, sản phẩm hoặc yêu cầu của người dùng, đồng thời thể hiện rõ nguyên tắc **Human-in-the-loop**.

---

## 3. Kiến trúc đa kênh và khả năng giám sát hệ thống

Nhóm thiết kế hệ thống theo hướng đa kênh. Mỗi nền tảng nhắn tin được kết nối thông qua một lớp Adapter để chuyển đổi dữ liệu về cùng một định dạng trước khi gửi đến AI Agent.

Thiết kế này mang lại nhiều lợi ích:

- Dễ bổ sung kênh giao tiếp mới.
- Không phụ thuộc hoàn toàn vào một nền tảng.
- Có thể tái sử dụng phần xử lý AI.
- Thuận lợi khi mở rộng sang doanh nghiệp khác.
- Giảm khối lượng thay đổi khi tích hợp hệ thống mới.

Ngoài giao diện dành cho khách hàng, nhóm còn xây dựng Dashboard để nhân viên theo dõi lịch sử hội thoại, kiểm tra cách AI xử lý yêu cầu và hỗ trợ khách hàng khi xảy ra lỗi.

Qua nội dung này, mình hiểu rằng một hệ thống AI thực tế không chỉ cần chatbot mà còn cần các chức năng giám sát, lưu lịch sử, kiểm soát lỗi và cho phép con người can thiệp khi cần thiết.

---

## 4. AgentCore và khả năng ghi nhớ ngữ cảnh

Trong phần trình bày kiến trúc, nhóm giới thiệu việc sử dụng AgentCore để hỗ trợ xây dựng và vận hành AI Agent.

Khả năng quản lý bộ nhớ giúp hệ thống duy trì ngữ cảnh trong cuộc trò chuyện và có thể ghi nhớ một số lựa chọn trước đó của người dùng. Nhờ đó, AI có thể đưa ra phản hồi phù hợp hơn và giảm việc người dùng phải lặp lại thông tin.

Khả năng ghi nhớ ngữ cảnh có thể hỗ trợ:

- Cá nhân hóa trải nghiệm.
- Duy trì nội dung xuyên suốt cuộc trò chuyện.
- Gợi ý lại sản phẩm từng được lựa chọn.
- Giảm số lần người dùng phải nhập lại thông tin.
- Tăng tính tự nhiên trong giao tiếp với AI.

Tuy nhiên, khi lưu trữ thông tin người dùng, hệ thống cũng cần quan tâm đến bảo mật, quyền truy cập và chính sách quản lý dữ liệu.

---

## 5. Multi-Agent Strategy Intelligence

Một dự án khác được giới thiệu là hệ thống **Multi-Agent Strategy Intelligence**.

Thay vì giao toàn bộ nhiệm vụ cho một Agent, hệ thống chia bài toán thành nhiều phần và giao cho các Agent chuyên biệt. Mỗi Agent có thể đảm nhận một vai trò như:

- Thu thập dữ liệu.
- Phân tích thông tin.
- Đánh giá thị trường.
- Xác định rủi ro.
- Tổng hợp kết quả.
- Đề xuất chiến lược.

Các Agent phối hợp với nhau để tạo ra kết quả cuối cùng. Cách tiếp cận này phù hợp với những bài toán có nhiều bước và cần xử lý nhiều nguồn dữ liệu.

Qua phần chia sẻ, mình hiểu rằng Multi-Agent Architecture giúp phân tách trách nhiệm rõ ràng hơn. Tuy nhiên, hệ thống cũng cần có cơ chế điều phối, kiểm tra kết quả và quản lý trạng thái giữa các Agent.

---

## 6. Kiến trúc AWS cho ứng dụng AI

Nhóm phát triển hệ thống Multi-Agent đã sử dụng nhiều dịch vụ AWS, bao gồm:

- **AWS Amplify:** hỗ trợ phát triển và triển khai giao diện ứng dụng.
- **AWS WAF:** bảo vệ ứng dụng trước các yêu cầu không hợp lệ.
- **Amazon Cognito:** quản lý đăng nhập và xác thực người dùng.
- **AWS Lambda:** xử lý các chức năng Backend theo mô hình Serverless.
- **Amazon S3:** lưu trữ tài liệu và dữ liệu.
- **Amazon DynamoDB:** lưu dữ liệu NoSQL và trạng thái xử lý.
- **Amazon Bedrock:** cung cấp các mô hình nền tảng cho ứng dụng AI.
- **AgentCore:** hỗ trợ xây dựng và vận hành AI Agent.

Kiến trúc này cho thấy một ứng dụng AI hoàn chỉnh không chỉ gồm mô hình ngôn ngữ mà còn cần nhiều thành phần hỗ trợ như xác thực, lưu trữ, bảo mật, điều phối và giám sát hệ thống.

Việc lựa chọn dịch vụ AWS cần dựa trên yêu cầu thực tế, khả năng mở rộng và ngân sách của dự án, thay vì sử dụng quá nhiều dịch vụ không cần thiết.

---

## 7. Xây dựng MVP trong Hackathon

Các đội thi phải phát triển sản phẩm trong khoảng thời gian giới hạn. Vì vậy, việc xác định phạm vi và ưu tiên tính năng đóng vai trò rất quan trọng.

Thay vì cố gắng hoàn thiện toàn bộ hệ thống, nhóm cần tập trung vào phiên bản MVP có thể chứng minh được:

- Vấn đề cần giải quyết.
- Nhóm người dùng mục tiêu.
- Giá trị mà AI mang lại.
- Quy trình hoạt động chính.
- Một bản Demo có thể sử dụng.
- Kiến trúc có thể tiếp tục mở rộng.

Bài học quan trọng là sản phẩm cần hoạt động được trước khi bổ sung quá nhiều tính năng. Một dự án có ít chức năng nhưng hoàn chỉnh sẽ hiệu quả hơn một dự án có nhiều chức năng nhưng không thể trình diễn.

---

## 8. Teamwork và kỹ năng thuyết trình

Bên cạnh kỹ thuật, các đội thi cũng chia sẻ nhiều kinh nghiệm về teamwork.

Trong một nhóm, mỗi thành viên có thể đảm nhận một vai trò khác nhau như nghiên cứu, thiết kế, lập trình, kiểm thử hoặc chuẩn bị nội dung thuyết trình. Việc phân chia nhiệm vụ hợp lý giúp nhóm tận dụng được điểm mạnh của từng người và hoàn thành sản phẩm đúng thời hạn.

Để làm việc nhóm hiệu quả, các thành viên cần:

- Lắng nghe ý kiến của nhau.
- Thống nhất mục tiêu chung.
- Phân chia công việc rõ ràng.
- Chủ động cập nhật tiến độ.
- Hỗ trợ nhau khi gặp khó khăn.
- Ưu tiên kết quả chung thay vì ý kiến cá nhân.

Ngoài ra, kỹ năng thuyết trình cũng rất quan trọng. Một đội cần giải thích rõ vấn đề, giải pháp, kiến trúc AWS, vai trò của AI, chi phí dự kiến và giá trị kinh doanh trong thời gian ngắn.

---

# Những gì học được

Qua sự kiện, mình học được nhiều kiến thức về AI, AWS và tư duy phát triển sản phẩm.

## Về tư duy phát triển sản phẩm

- Cần bắt đầu từ một vấn đề thực tế của người dùng.
- Không nên sử dụng AI chỉ vì đây là công nghệ mới.
- Nên xây dựng MVP trước khi mở rộng sản phẩm.
- Cần cân bằng giữa tính năng, thời gian và chi phí.
- Một sản phẩm tốt phải mang lại giá trị thực tế cho người dùng.

## Về Agentic AI

- AI Agent có thể lập kế hoạch và thực hiện nhiều bước.
- Multi-Agent phù hợp với những quy trình có nhiều nhiệm vụ chuyên biệt.
- Bộ nhớ giúp AI duy trì ngữ cảnh và cá nhân hóa trải nghiệm.
- Human-in-the-loop giúp tăng độ an toàn và độ tin cậy.
- Hệ thống AI cần có Dashboard giám sát và cơ chế xử lý lỗi.

## Về AWS

Mình hiểu rõ hơn vai trò của Amazon Bedrock, AgentCore, Amazon Cognito, AWS Lambda, Amazon S3, DynamoDB, AWS Amplify và AWS WAF trong việc xây dựng ứng dụng AI.

Ngoài ra, mình nhận thấy việc lựa chọn kiến trúc cần dựa trên nhu cầu thực tế, khả năng bảo trì, bảo mật và chi phí vận hành.

## Về kỹ năng làm việc

- Cần biết ưu tiên công việc trong điều kiện thời gian giới hạn.
- Teamwork có ảnh hưởng trực tiếp đến kết quả dự án.
- Kỹ năng trình bày kiến trúc cũng quan trọng như kỹ năng lập trình.
- Phản hồi từ người dùng và ban giám khảo giúp sản phẩm được cải thiện tốt hơn.

---

# Ứng dụng vào công việc và đồ án

Những kiến thức từ sự kiện có thể áp dụng vào quá trình thực tập Cloud Computing và dự án **Cloud Finance Platform**.

## 1. Tích hợp AI Agent

Cloud Finance Platform có thể nghiên cứu sử dụng AI Agent để:

- Phân tích thu nhập và chi tiêu.
- Giải thích các giao dịch.
- Cảnh báo khi chi tiêu vượt ngân sách.
- Gợi ý kế hoạch tiết kiệm.
- Tóm tắt tình hình tài chính theo tuần hoặc tháng.
- Trả lời câu hỏi dựa trên dữ liệu tài chính của người dùng.

Hệ thống cũng có thể chia thành nhiều Agent như Transaction Agent, Budget Agent, Planning Agent và Report Agent để xử lý từng nhiệm vụ riêng.

## 2. Áp dụng Human-in-the-loop

Đối với dữ liệu tài chính, AI chỉ nên đưa ra đề xuất. Các hành động như chỉnh sửa ngân sách, xóa giao dịch hoặc thay đổi kế hoạch tài chính cần được người dùng xác nhận trước khi thực hiện.

## 3. Xây dựng Dashboard giám sát AI

Nhóm phát triển có thể theo dõi:

- Lịch sử hội thoại.
- Kết quả phân tích của AI.
- Các lỗi phát sinh.
- Thời gian phản hồi.
- Chi phí sử dụng mô hình.
- Phản hồi của người dùng.

Dashboard giúp kiểm tra chất lượng và cải thiện hệ thống theo thời gian.

## 4. Áp dụng tư duy MVP

Thay vì xây dựng ngay một trợ lý tài chính quá phức tạp, dự án có thể bắt đầu với một MVP gồm:

- Trả lời câu hỏi về tổng thu và chi.
- Phân tích các danh mục chi tiêu lớn.
- Cảnh báo khi ngân sách gần vượt giới hạn.
- Gợi ý kế hoạch tiết kiệm cơ bản.

Sau khi có phản hồi từ người dùng, nhóm mới tiếp tục mở rộng các chức năng nâng cao.

---

# Trải nghiệm trong sự kiện

Đây là một sự kiện mang lại cho mình nhiều kiến thức thực tế về Agentic AI, kiến trúc AWS và quá trình xây dựng sản phẩm trong Hackathon.

Điểm mình ấn tượng nhất là các đội thi không chỉ giới thiệu kết quả cuối cùng mà còn chia sẻ những khó khăn trong quá trình phát triển. Các thành viên phải phối hợp trong thời gian ngắn, thay đổi ý tưởng, điều chỉnh kiến trúc và chuẩn bị phần trình bày trước ban giám khảo.

Giải pháp AI Conversational Ordering giúp mình hiểu rõ hơn cách AI được tích hợp vào một quy trình kinh doanh cụ thể. Dự án Multi-Agent Strategy Intelligence giúp mình tiếp cận cách chia một bài toán phức tạp thành nhiều nhiệm vụ và giao cho các Agent chuyên biệt.

Sự kiện cũng giúp mình nhận ra rằng kỹ năng kỹ thuật chỉ là một phần của sản phẩm. Teamwork, tư duy kinh doanh, trải nghiệm người dùng, quản lý chi phí và khả năng thuyết trình đều có ảnh hưởng lớn đến kết quả cuối cùng.

---

# Bài học rút ra

Sau khi tham gia sự kiện, mình rút ra một số bài học quan trọng:

- AI chỉ có giá trị khi giải quyết được vấn đề thực tế.
- Cần hiểu nhu cầu người dùng trước khi lựa chọn công nghệ.
- Nên xây dựng MVP để kiểm chứng ý tưởng.
- Hệ thống AI cần có bảo mật, giám sát và cơ chế xác nhận.
- Con người vẫn phải kiểm soát các quyết định quan trọng của AI.
- Kiến trúc AWS cần phù hợp với yêu cầu và ngân sách.
- Chi phí vận hành cần được xem xét từ giai đoạn thiết kế.
- Teamwork và kỹ năng thuyết trình có vai trò rất quan trọng.
- Cần duy trì tinh thần học tập liên tục để theo kịp sự phát triển của AI.

---

## Một số hình ảnh khi tham gia sự kiện

*Thêm hình ảnh tổng quan về không gian sự kiện tại đây.*

*Thêm hình ảnh phần phát biểu của đại diện AWS tại đây.*

*Thêm hình ảnh đội trình bày dự án AI Conversational Ordering tại đây.*

*Thêm hình ảnh sơ đồ kiến trúc hoặc phần Demo của dự án tại đây.*

*Thêm hình ảnh đội trình bày Multi-Agent Strategy Intelligence tại đây.*

*Thêm hình ảnh chụp lưu niệm sau sự kiện tại đây.*

---

# Kết luận

Sự kiện **AWS Agentic AI Build Week & Hackathon Sharing** đã mang đến cho mình cái nhìn thực tế hơn về Agentic AI, kiến trúc ứng dụng trên AWS và quá trình phát triển sản phẩm trong môi trường Hackathon.

Thông qua các dự án được trình bày, mình hiểu rằng một hệ thống AI hoàn chỉnh cần có sự kết hợp giữa mô hình AI, dữ liệu, bảo mật, khả năng giám sát, trải nghiệm người dùng và chi phí vận hành.

Những kiến thức về AI Agent, Multi-Agent Architecture, MVP, teamwork và các dịch vụ AWS có thể được áp dụng trực tiếp vào quá trình thực tập cũng như dự án Cloud Finance Platform.

Nhìn chung, đây là một chương trình thiết thực, giúp mình mở rộng kiến thức về AI và Cloud Computing, đồng thời tạo thêm động lực để tiếp tục học tập, thử nghiệm và phát triển những sản phẩm có giá trị trong tương lai.