---
title: "Bảo mật, kiểm thử và vận hành"
date: 2026-08-01
weight: 5
chapter: false
pre: " <b> 5.5. </b> "
---

Chương này đánh giá hệ thống đang chạy thay vì lặp lại sơ đồ kiến trúc. Bảo mật được phân tích như một chuỗi cấp quyền; monitoring được liên kết với từng kiểu lỗi cụ thể; một test chỉ được xem là đạt khi quan sát được cả tín hiệu hạ tầng lẫn kết quả nghiệp vụ.

1. [Phân tích IAM và Secrets Manager](5.5.1-iam-secrets/): ranh giới tin cậy, task role và execution role, giới hạn tài nguyên và giải thích chi tiết từng khối Policy JSON.
2. [Monitoring và kiểm thử nghiệm thu](5.5.2-monitoring-testing/): bằng chứng CloudWatch, tiêu chí health, kiểm thử dương/âm và xác minh ở mức ứng dụng.
3. [Phân tích sự cố và khoảng cách đến production](5.5.3-incidents-limitations/): ECS stability timeout, frontend asset cũ, phương pháp chẩn đoán, cách khắc phục và giới hạn còn lại.

Báo cáo phân biệt rõ bằng chứng đã triển khai với định hướng hoàn thiện. Ví dụ, bucket receipts đã tồn tại nhưng luồng OCR tự động lưu object vẫn pending; SES gửi được đến identity đã verify nhưng quyền gửi production còn phụ thuộc phê duyệt của AWS.
