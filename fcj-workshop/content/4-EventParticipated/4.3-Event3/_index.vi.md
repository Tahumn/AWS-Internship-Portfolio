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

# Bài thu hoạch sự kiện AI & AWS Community Sharing

## Mục đích của sự kiện

Sự kiện được tổ chức nhằm mang đến cho người tham dự cái nhìn toàn diện về xu hướng ứng dụng Trí tuệ nhân tạo (AI) trong doanh nghiệp hiện nay. Nội dung chương trình không chỉ tập trung vào các mô hình AI tạo sinh (Generative AI) mà còn mở rộng sang nhiều chủ đề thực tiễn như AI Voice, AI Agent, Amazon Q, FinOps, DevOps Agent, AI trong quản trị nhân sự và kinh nghiệm xây dựng Startup AI.

Thông qua các bài trình bày của những chuyên gia đang trực tiếp triển khai các giải pháp AI tại doanh nghiệp, người tham dự có cơ hội tiếp cận:

- Những xu hướng AI mới nhất trong doanh nghiệp.
- Kinh nghiệm triển khai AI từ Proof of Concept (PoC) đến Production.
- Cách ứng dụng các dịch vụ AWS để xây dựng hệ thống AI thực tế.
- Những bài học về tối ưu chi phí, vận hành và mở rộng hệ thống.
- Vai trò của AI trong việc nâng cao năng suất làm việc và hỗ trợ ra quyết định.

---

# Các chủ đề nổi bật của sự kiện

## 1. AI Startup – Từ ý tưởng đến sản phẩm thực tế

Một trong những phiên chia sẻ đầu tiên tập trung vào quá trình xây dựng Startup AI.

Diễn giả nhấn mạnh rằng rất nhiều nhóm phát triển thường dành quá nhiều thời gian để hoàn thiện ý tưởng nhưng lại thiếu hành động. Theo kinh nghiệm thực tế, điều quan trọng nhất không phải là ý tưởng hoàn hảo mà là nhanh chóng xây dựng MVP (Minimum Viable Product), đưa sản phẩm tới khách hàng và liên tục cải tiến dựa trên phản hồi thực tế. :contentReference[oaicite:0]{index=0}

Một số kinh nghiệm đáng chú ý:

- Luôn bắt đầu từ bài toán thực tế của doanh nghiệp.
- Không xây dựng AI chỉ vì công nghệ mới.
- Liên tục thử nghiệm và cải tiến.
- Tìm "champion customer" để kiểm chứng giá trị sản phẩm.
- Chấp nhận thay đổi khi thị trường thay đổi.

Đây là tư duy rất phù hợp đối với các nhóm phát triển Startup AI hiện nay.

---

## 2. AI Voice và Conversational AI

Đây là một trong những phiên chia sẻ mình thấy thú vị nhất.

Diễn giả giới thiệu cách xây dựng hệ thống AI Voice có khả năng giao tiếp tự nhiên với người dùng thay vì chỉ chuyển đổi Speech-to-Text và Text-to-Speech đơn thuần. AI cần hiểu được ngữ cảnh, biết khi nào nên trả lời và khi nào nên chờ người dùng tiếp tục nói. :contentReference[oaicite:1]{index=1}

Ngoài việc xử lý giọng nói, hệ thống thực tế còn phải giải quyết nhiều bài toán khác như:

- Prompt Management.
- Knowledge Base.
- Versioning.
- Audit Log.
- Human Handoff.
- Multi-turn Conversation.
- Context Memory.

Đặc biệt, diễn giả nhấn mạnh rằng trong môi trường doanh nghiệp, AI không thể hoạt động độc lập mà cần phối hợp với con người. Khi AI không thể xử lý một tình huống hoặc nhận thấy khách hàng không hài lòng, hệ thống cần tự động chuyển cuộc hội thoại sang nhân viên hỗ trợ. Đây là một kiến trúc Hybrid AI rất phổ biến hiện nay. :contentReference[oaicite:2]{index=2}

---

## 3. AI Agent và DevOps Automation

Một chủ đề khác được quan tâm là việc ứng dụng AI Agent trong vận hành hệ thống.

Các diễn giả trình bày cách AI Agent có thể:

- Phân tích log.
- Phát hiện lỗi.
- Đề xuất hướng xử lý.
- Tự động tạo kế hoạch sửa lỗi.
- Tích hợp với các công cụ DevOps.

Điểm đáng chú ý là AI Agent không chỉ dừng lại ở việc đưa ra gợi ý mà còn có thể mở rộng thông qua MCP, Skills hoặc các Extension để tương tác với nhiều công cụ khác nhau. Ngoài ra, AI Agent hoàn toàn có khả năng kết hợp với AWS Lambda hoặc AWS Systems Manager nhằm tự động hóa nhiều quy trình vận hành. :contentReference[oaicite:3]{index=3}

Tuy nhiên, diễn giả cũng nhấn mạnh rằng AI Agent chỉ đóng vai trò hỗ trợ. Chất lượng của AI phụ thuộc rất nhiều vào kiến thức, quy trình và dữ liệu của doanh nghiệp. AI không thể thay thế hoàn toàn kỹ sư mà chỉ giúp họ làm việc nhanh và hiệu quả hơn. :contentReference[oaicite:4]{index=4}

---

## 4. AI trong quản trị nhân sự

Một phiên chia sẻ rất thực tế đến từ đội ngũ Noventiq tập trung vào việc ứng dụng AI trong quản trị nhân sự.

Các diễn giả chỉ ra rằng doanh nghiệp hiện nay đang gặp nhiều khó khăn như:

- Tuyển dụng mất nhiều thời gian.
- Khó đánh giá ứng viên.
- Thiếu dữ liệu hỗ trợ ra quyết định.
- Chi phí tuyển dụng cao.
- Khó xây dựng chiến lược nhân sự dài hạn.

Để giải quyết các vấn đề trên, nhóm diễn giả giới thiệu Amazon Q như một trợ lý AI dành cho bộ phận HR. Amazon Q có thể hỗ trợ tổng hợp dữ liệu, phân tích hồ sơ ứng viên, tạo báo cáo và đưa ra các gợi ý giúp bộ phận nhân sự ra quyết định nhanh hơn. :contentReference[oaicite:5]{index=5} :contentReference[oaicite:6]{index=6}

---

## 5. Amazon Q và Enterprise AI

Một trong những nội dung được quan tâm nhiều nhất trong sự kiện là phần giới thiệu về **Amazon Q**, trợ lý AI dành cho doanh nghiệp được Amazon Web Services phát triển nhằm hỗ trợ tăng năng suất làm việc của cả đội ngũ kỹ thuật và các phòng ban nghiệp vụ.

Khác với các chatbot AI thông thường, Amazon Q được xây dựng hướng đến môi trường doanh nghiệp với khả năng kết nối nhiều nguồn dữ liệu nội bộ như tài liệu, wiki, hệ thống quản lý dự án, kho mã nguồn và các dịch vụ AWS. Nhờ đó, người dùng có thể tìm kiếm thông tin nhanh chóng mà không cần mất nhiều thời gian tra cứu từ nhiều hệ thống khác nhau. :contentReference[oaicite:0]{index=0}

Diễn giả cũng chia sẻ nhiều ví dụ thực tế về việc ứng dụng Amazon Q trong doanh nghiệp:

- Hỗ trợ lập trình viên phân tích và giải thích source code.
- Sinh tài liệu kỹ thuật từ mã nguồn.
- Hỗ trợ tạo unit test và review code.
- Tìm kiếm thông tin trong tài liệu nội bộ.
- Hỗ trợ các phòng ban như HR, Sales, Marketing và Customer Support.

Một điểm đặc biệt là Amazon Q được thiết kế với các cơ chế phân quyền và bảo mật dữ liệu doanh nghiệp. AI chỉ có thể truy cập các tài nguyên mà người dùng được cấp quyền, giúp đảm bảo tính bảo mật và tuân thủ các chính sách quản trị dữ liệu của tổ chức. Điều này giúp doanh nghiệp yên tâm hơn khi triển khai AI vào môi trường sản xuất. :contentReference[oaicite:1]{index=1}

Ngoài ra, diễn giả cũng giới thiệu khả năng mở rộng của Amazon Q thông qua các **Agent**, **Skills** và **Extensions**, cho phép AI tương tác với nhiều hệ thống khác nhau như Jira, GitHub, Slack, Microsoft Teams và các dịch vụ AWS để tự động hóa nhiều quy trình làm việc.

---

## 6. AI trong FinOps và tối ưu chi phí Cloud

Một chủ đề rất thiết thực được chia sẻ trong workshop là **FinOps** – phương pháp quản lý và tối ưu chi phí điện toán đám mây.

Theo diễn giả, khi doanh nghiệp bắt đầu sử dụng AI với quy mô lớn, chi phí hạ tầng có thể tăng rất nhanh nếu không có chiến lược quản lý phù hợp. Việc tối ưu chi phí không chỉ là trách nhiệm của bộ phận tài chính mà cần có sự phối hợp giữa các nhóm kỹ thuật, vận hành và quản lý.

Một số kinh nghiệm được chia sẻ bao gồm:

- Theo dõi mức sử dụng tài nguyên thường xuyên.
- Xây dựng dashboard theo dõi chi phí.
- Lựa chọn đúng loại dịch vụ phù hợp với từng workload.
- Tắt các tài nguyên không còn sử dụng.
- Thiết lập ngân sách và cảnh báo chi phí.
- Sử dụng Reserved Instances hoặc Savings Plans khi phù hợp.
- Đánh giá ROI của từng dự án AI trước khi mở rộng quy mô. :contentReference[oaicite:2]{index=2}

Diễn giả cũng nhấn mạnh rằng mục tiêu của FinOps không phải chỉ là giảm chi phí mà còn tối ưu hiệu quả đầu tư, đảm bảo doanh nghiệp đạt được giá trị cao nhất từ các dịch vụ Cloud.

Đây là một góc nhìn rất thực tế vì nhiều dự án AI hiện nay thường chỉ tập trung vào mô hình mà chưa quan tâm đầy đủ đến chi phí vận hành lâu dài.

---

# Những gì học được

Qua sự kiện, mình học được rất nhiều kiến thức cả về công nghệ lẫn tư duy triển khai AI trong doanh nghiệp.

## Về tư duy phát triển sản phẩm

- Không nên bắt đầu từ công nghệ mà cần xuất phát từ bài toán kinh doanh thực tế.
- Luôn xây dựng MVP trước để kiểm chứng ý tưởng.
- Liên tục cải tiến sản phẩm dựa trên phản hồi của người dùng.
- AI chỉ thực sự có giá trị khi giải quyết được nhu cầu cụ thể của doanh nghiệp.

## Về AI và kiến trúc hệ thống

- Hiểu rõ hơn cách xây dựng AI Agent trong doanh nghiệp.
- Biết cách kết hợp LLM với Knowledge Base và các hệ thống hiện có.
- Hiểu vai trò của Context Management trong các hệ thống AI hội thoại.
- Nhận thức được tầm quan trọng của Human-in-the-loop trong các ứng dụng AI.
- Biết thêm về khả năng mở rộng AI thông qua Agent và MCP.

## Về AWS

Workshop giúp mình hiểu rõ hơn vai trò của các dịch vụ AWS trong hệ sinh thái AI hiện đại, đặc biệt là:

- Amazon Q
- AWS Lambda
- Amazon Bedrock
- Các dịch vụ phục vụ xây dựng AI Agent
- Các công cụ hỗ trợ DevOps và tự động hóa

Ngoài ra, mình cũng hiểu rằng khi xây dựng ứng dụng AI trên AWS cần quan tâm đến khả năng mở rộng, bảo mật, chi phí và khả năng bảo trì lâu dài thay vì chỉ tập trung vào mô hình AI.

---

# Ứng dụng vào công việc và đồ án

Sau khi tham gia workshop, mình nhận thấy nhiều kiến thức có thể áp dụng trực tiếp vào các dự án đang thực hiện.

Đối với đồ án game **The Last Rule**, mình có thể nghiên cứu xây dựng AI Agent để hỗ trợ NPC đưa ra các phản hồi thông minh hơn dựa trên ngữ cảnh của trò chơi thay vì chỉ sử dụng các đoạn hội thoại cố định.

Trong quá trình phát triển phần mềm, mình cũng muốn thử nghiệm sử dụng Amazon Q để hỗ trợ đọc hiểu source code, tạo tài liệu kỹ thuật và tăng tốc quá trình lập trình.

Bên cạnh đó, các kiến thức về FinOps giúp mình có ý thức hơn trong việc quản lý tài nguyên Cloud, đặc biệt khi triển khai ứng dụng trên AWS nhằm tránh phát sinh các chi phí không cần thiết.

Những chia sẻ về Startup AI cũng giúp mình thay đổi tư duy phát triển sản phẩm. Thay vì cố gắng xây dựng một hệ thống quá lớn ngay từ đầu, mình sẽ ưu tiên phát triển phiên bản tối thiểu khả dụng (MVP), thu thập phản hồi của người dùng rồi tiếp tục cải tiến.

---

# Trải nghiệm trong sự kiện

Đây là một trong những workshop mang lại cho mình nhiều kiến thức thực tế nhất về việc ứng dụng AI trong doanh nghiệp.

Điểm mình ấn tượng nhất là các diễn giả không chỉ giới thiệu công nghệ mà còn chia sẻ nhiều kinh nghiệm triển khai thực tế, những khó khăn gặp phải và cách giải quyết khi đưa AI vào môi trường sản xuất.

Các ví dụ minh họa giúp mình hiểu rõ rằng xây dựng một hệ thống AI hoàn chỉnh không chỉ đơn giản là gọi API của một mô hình ngôn ngữ lớn mà còn cần giải quyết nhiều vấn đề như quản lý dữ liệu, bảo mật, phân quyền, chi phí, khả năng mở rộng và trải nghiệm người dùng.

Ngoài ra, workshop còn giúp mình hiểu rõ hơn xu hướng phát triển AI hiện nay, đặc biệt là AI Agent, Enterprise AI và các công cụ hỗ trợ lập trình như Amazon Q. Đây đều là những công nghệ đang được nhiều doanh nghiệp lớn áp dụng.

Thông qua chương trình, mình cũng có cơ hội tiếp cận với nhiều góc nhìn mới về cách ứng dụng AI trong các lĩnh vực như nhân sự, chăm sóc khách hàng, phát triển phần mềm và quản lý hạ tầng Cloud.

---

# Bài học rút ra

Sau khi tham gia sự kiện, mình rút ra một số bài học quan trọng:

- AI không thể thay thế hoàn toàn con người mà đóng vai trò là công cụ hỗ trợ nâng cao năng suất làm việc.
- Muốn triển khai AI thành công cần xuất phát từ bài toán kinh doanh thay vì chạy theo xu hướng công nghệ.
- Việc xây dựng AI trong doanh nghiệp đòi hỏi sự kết hợp giữa mô hình AI, dữ liệu, quy trình và con người.
- Amazon Q và các AI Agent mở ra nhiều cơ hội để tự động hóa các công việc lặp lại, giúp đội ngũ kỹ thuật tập trung hơn vào các nhiệm vụ mang lại giá trị cao.
- Khi triển khai AI trên Cloud cần luôn cân nhắc giữa hiệu năng, khả năng mở rộng và chi phí vận hành.
- Workshop giúp mình có thêm nhiều ý tưởng để áp dụng AI vào đồ án, nghiên cứu khoa học và các dự án cá nhân trong tương lai.

---

## Một số hình ảnh khi tham gia sự kiện

* Thêm các hình ảnh của các bạn tại đây.

> Nhìn chung, workshop đã mang đến cho mình cái nhìn toàn diện hơn về hệ sinh thái AI trên AWS, từ việc xây dựng sản phẩm, phát triển AI Agent, ứng dụng Amazon Q cho doanh nghiệp đến tối ưu chi phí Cloud với FinOps. Những kiến thức và kinh nghiệm thu nhận được sẽ là nền tảng quan trọng giúp mình áp dụng vào quá trình học tập, nghiên cứu và phát triển các dự án thực tế trong tương lai.