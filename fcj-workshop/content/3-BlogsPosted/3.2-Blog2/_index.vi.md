---

title: "Amazon ECS Service Auto Scaling – Tự động điều chỉnh tài nguyên theo nhu cầu"
date: 2026-08-05
weight: 2
chapter: false
pre: " <b> 3.2. </b> "
---

{{% notice info %}}
📈 **Lưu ý:** Bài viết tổng hợp những kiến thức mình tìm hiểu về Amazon ECS Service Auto Scaling. Auto Scaling được đánh giá như một phương án cho production và chưa được áp dụng vào môi trường thực tập hiện tại.
{{% /notice %}}

# AMAZON ECS SERVICE AUTO SCALING – TỰ ĐỘNG ĐIỀU CHỈNH TÀI NGUYÊN THEO NHU CẦU

Khi triển khai ứng dụng bằng Amazon ECS Fargate, rất khó dự đoán chính xác hệ thống sẽ cần bao nhiêu task tại từng thời điểm.

Nếu chạy quá ít task, ứng dụng có thể phản hồi chậm khi lưu lượng tăng. Nếu duy trì quá nhiều task liên tục, hệ thống sẽ sử dụng tài nguyên không cần thiết và làm tăng chi phí vận hành.

**Amazon ECS Service Auto Scaling** giúp giải quyết vấn đề này bằng cách tự động điều chỉnh số lượng ECS Task theo mức sử dụng thực tế.

---

## ECS Service Auto Scaling hoạt động như thế nào?

Khi cấu hình Auto Scaling cho một ECS Service, chúng ta thường xác định:

* **Minimum capacity:** Số task tối thiểu phải luôn duy trì.
* **Maximum capacity:** Số task tối đa mà service được phép tạo.
* **Scaling metric:** Chỉ số được dùng để quyết định scale.
* **Target value:** Mức sử dụng mà hệ thống cố gắng duy trì.

Một số metric phổ biến gồm:

* Mức sử dụng CPU trung bình của ECS Service.
* Mức sử dụng Memory trung bình của ECS Service.
* Số request trên mỗi target của Application Load Balancer.
* Custom Metric trên Amazon CloudWatch.

Quy trình đơn giản có thể được mô tả như sau:

```text
Lưu lượng truy cập tăng
        ↓
CPU, Memory hoặc số request đạt ngưỡng
        ↓
Application Auto Scaling tăng desired task count
        ↓
Amazon ECS khởi tạo thêm task
        ↓
Application Load Balancer phân phối lưu lượng đến các task khỏe mạnh
```

Khi lưu lượng giảm, hệ thống có thể giảm bớt task nhưng vẫn duy trì số lượng tối thiểu đã cấu hình.

---

## Auto Scaling không chỉ dành cho hệ thống lớn

Điều mình thích nhất là Auto Scaling không chỉ dành cho những hệ thống có quy mô cực lớn.

Ngay cả với ứng dụng nhỏ hoặc dự án học tập, việc tìm hiểu Auto Scaling cũng giúp mình hiểu rõ hơn cách một hệ thống Cloud phản ứng khi tải thay đổi.

Thay vì phải đoán trước chính xác sẽ cần bao nhiêu server, người triển khai chỉ cần xác định giới hạn tối thiểu, tối đa và để AWS điều chỉnh theo tình hình sử dụng thực tế.

Đây cũng là một trong những điểm khác biệt rõ ràng giữa triển khai ứng dụng trên Cloud và duy trì một máy chủ truyền thống có tài nguyên cố định.

---

## Hình ảnh kiến trúc

{{< figure src="/images/blog2.jpg" title="Kiến trúc ứng dụng AWS sử dụng Amazon ECS Fargate và Application Load Balancer" >}}

Sơ đồ minh họa một kiến trúc tham khảo sử dụng Amazon ECS Fargate và Application Load Balancer cho tầng ứng dụng, kết hợp Amazon S3, Amazon SQS và Amazon DynamoDB cho các nhu cầu lưu trữ và xử lý bất đồng bộ. Đây là hình minh họa cho chủ đề Auto Scaling, không phải kiến trúc đang chạy của Cloud Finance Platform.

---

## Một vài lưu ý khi cấu hình

* Không nên đặt ngưỡng CPU quá thấp vì service có thể scale khi tải chưa đáng kể.
* Nên thiết lập thời gian cooldown phù hợp để tránh scale out và scale in liên tục.
* Nếu ứng dụng sử dụng RAM nhiều hơn CPU, nên theo dõi Memory Utilization.
* Cần đặt giới hạn task tối thiểu và tối đa hợp lý để kiểm soát chi phí.
* Task mới cần vượt qua Health Check trước khi nhận lưu lượng.
* Với ứng dụng HTTP hoặc HTTPS, Application Load Balancer giúp phân phối request đến các ECS Task khỏe mạnh.
* Việc scale tầng ứng dụng không đồng nghĩa cơ sở dữ liệu và các tài nguyên phụ thuộc cũng tự động scale.

Vì vậy, Auto Scaling nên được sử dụng cùng với hệ thống giám sát, Health Check và kế hoạch tài nguyên phù hợp.

---

## Điều mình rút ra

Sau khi tìm hiểu tính năng này, mình nhận thấy Auto Scaling không phải là một tính năng “xa xỉ” chỉ dành cho hệ thống lớn.

Điều quan trọng là ứng dụng có thể sử dụng đúng lượng tài nguyên tại đúng thời điểm:

* Khi ít người dùng, service có thể chạy với ít task hơn để giảm chi phí.
* Khi lượng truy cập tăng, hệ thống có thể bổ sung task để duy trì hiệu năng.
* Khi tải trở lại bình thường, những task không còn cần thiết có thể được loại bỏ.

Khả năng này giúp việc triển khai trên Cloud linh hoạt hơn so với duy trì cố định một số lượng máy chủ truyền thống.

Đối với dự án **Cloud Finance Platform**, môi trường hiện tại duy trì `desiredCount = 1` cho từng ECS Service. ECS Service Auto Scaling được đề xuất cho môi trường production nhằm cải thiện tính sẵn sàng và hiệu quả sử dụng tài nguyên khi số lượng người dùng tăng lên.

---

## Bài viết đã đăng

---

{{< figure src="/images/MinhchungBlog2.png" title="Bài viết về Amazon ECS Service Auto Scaling đã được chia sẻ trên cộng đồng" >}}

[Xem bài viết trong cộng đồng First Cloud Journey](https://www.facebook.com/groups/660548818043427/?multi_permalinks=2238712130227080&hoisted_section_header_type=recently_seen)

---

## Tài liệu tham khảo

* [Amazon ECS Service Auto Scaling – AWS Documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-auto-scaling.html)
* [Amazon CloudWatch Metrics for ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/available-metrics.html)
* [Application Auto Scaling User Guide](https://docs.aws.amazon.com/autoscaling/application/userguide/what-is-application-auto-scaling.html)
* [Amazon ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/)
