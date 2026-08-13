---

title: "7 IAM Best Practices giúp bảo vệ AWS Account hiệu quả hơn"
date: 2026-08-06
weight: 1
chapter: false
pre: " <b> 3.1. </b> "
----------------------

{{% notice info %}}
🔐 **Lưu ý bảo mật:** AWS Identity and Access Management là một trong những nền tảng quan trọng nhất để bảo vệ danh tính, workload và tài nguyên trên AWS.
{{% /notice %}}

# 7 IAM BEST PRACTICES GIÚP BẢO VỆ AWS ACCOUNT HIỆU QUẢ HƠN

Khi bắt đầu sử dụng AWS, nhiều người thường tập trung vào việc tạo EC2, lưu trữ dữ liệu trên Amazon S3 hoặc triển khai cơ sở dữ liệu bằng Amazon RDS.

Tuy nhiên, trước khi quan tâm hệ thống chạy nhanh đến đâu, chúng ta cần trả lời một câu hỏi quan trọng hơn:

> Ai được phép truy cập tài nguyên và họ được phép thực hiện những hành động nào?

Đó chính là vai trò của **AWS Identity and Access Management – IAM**.

IAM hỗ trợ quản lý danh tính, xác thực người dùng và kiểm soát quyền truy cập đến các tài nguyên trong AWS Account. Khi một người dùng hoặc ứng dụng gửi yêu cầu, AWS sẽ đánh giá danh tính, policy, hành động và tài nguyên liên quan trước khi cho phép hoặc từ chối yêu cầu đó.

Dưới đây là bảy nguyên tắc quan trọng giúp AWS Account an toàn và dễ quản lý hơn.

---

{{< figure src="/images/IAMbaomat.png" title="Các nguyên tắc bảo mật AWS IAM" >}}

---

## 1. Không sử dụng Root User cho công việc hằng ngày

Root User được tạo cùng với AWS Account và có quyền truy cập rất cao đối với tài nguyên, thông tin tài khoản và thanh toán.

AWS khuyến nghị không sử dụng Root User cho các công việc thường ngày như:

* Khởi tạo EC2 Instance.
* Chỉnh sửa Security Group.
* Quản lý S3 Bucket.
* Triển khai tài nguyên của ứng dụng.

Sau khi tạo AWS Account, nên thực hiện các việc sau:

* Đặt mật khẩu mạnh và riêng biệt.
* Bật MFA cho Root User.
* Không tạo Access Key cho Root User.
* Chỉ đăng nhập Root User khi cần thực hiện tác vụ đặc biệt.

Đối với công việc quản trị thông thường, nên sử dụng AWS IAM Identity Center, cơ chế liên kết danh tính hoặc IAM Role với phạm vi quyền phù hợp.

---

## 2. Bật Multi-Factor Authentication

Mật khẩu dù mạnh vẫn có thể bị lộ do phishing, rò rỉ dữ liệu hoặc sử dụng lại trên nhiều nền tảng.

Multi-Factor Authentication bổ sung thêm một bước xác thực ngoài mật khẩu, giúp giảm nguy cơ tài khoản bị truy cập trái phép.

MFA nên được bật cho:

* AWS Account Root User.
* Tài khoản có quyền quản trị.
* Danh tính có quyền thay đổi IAM.
* Những IAM User vẫn còn được sử dụng.

AWS hỗ trợ nhiều phương thức MFA như passkey, security key và ứng dụng tạo mã xác thực. Trong đó, nên ưu tiên passkey hoặc security key khi có thể.

---

## 3. Áp dụng nguyên tắc Least Privilege

Least Privilege có nghĩa là một người dùng hoặc ứng dụng chỉ được cấp đúng những quyền cần thiết để hoàn thành công việc.

Ví dụ, nếu một ứng dụng chỉ cần đọc ảnh trong một S3 Bucket thì có thể chỉ cần:

```text
s3:ListBucket
s3:GetObject
```

Không nên gán `AdministratorAccess` hoặc quyền đầy đủ cho toàn bộ Amazon S3.

Một policy được giới hạn đúng tài nguyên có thể được cấu hình như sau:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::example-image-bucket"
    },
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::example-image-bucket/*"
    }
  ]
}
```

Khi xây dựng IAM Policy, nên:

* Hạn chế các hành động và tài nguyên có phạm vi quá rộng.
* Chỉ cấp quyền cho đúng dịch vụ và tài nguyên cần thiết.
* Rà soát quyền khi yêu cầu của hệ thống thay đổi.
* Loại bỏ các quyền không còn được sử dụng.

---

## 4. Ưu tiên Temporary Credentials

IAM User có thể sử dụng Access Key dài hạn. Những credential này tiếp tục hoạt động cho đến khi bị vô hiệu hóa hoặc xóa.

Nếu một Access Key dài hạn bị lộ, người khác có thể sử dụng nó để gửi yêu cầu đến AWS.

Với người dùng trong tổ chức, AWS khuyến nghị sử dụng IAM Identity Center hoặc liên kết với nhà cung cấp danh tính để nhận temporary credentials.

Có thể hiểu đơn giản:

```text
Người dùng đăng nhập
        ↓
Nhận quyền thông qua IAM Role
        ↓
AWS cấp temporary credentials
        ↓
Truy cập tài nguyên trong phạm vi cho phép
```

Temporary credentials chỉ tồn tại trong một khoảng thời gian giới hạn, giúp giảm rủi ro nếu thông tin xác thực bị lộ.

---

## 5. Sử dụng IAM Role cho ứng dụng

Một lỗi bảo mật phổ biến là đặt Access Key trực tiếp trong source code hoặc tệp môi trường:

```text
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

Nếu source code bị chia sẻ hoặc repository vô tình chuyển sang chế độ public, credential có thể bị lộ.

Đối với workload chạy trên AWS, nên sử dụng IAM Role:

* Amazon EC2 sử dụng IAM Role thông qua Instance Profile.
* Amazon ECS sử dụng ECS Task Role.
* AWS Lambda sử dụng Lambda Execution Role.

Khi đó, ứng dụng tự động nhận temporary credentials mà không cần lưu Access Key dài hạn trong source code.

Ví dụ, một ECS Task chỉ cần tải hóa đơn lên S3 có thể được cấp Task Role chứa duy nhất quyền `s3:PutObject` đối với thư mục hóa đơn cần sử dụng.

---

## 6. Quản lý Access Key thật cẩn thận

Trong một số trường hợp, hệ thống bên ngoài AWS vẫn có thể cần Access Key. Khi đó, Access Key nên được xem là ngoại lệ, không phải lựa chọn mặc định.

Một số nguyên tắc cần lưu ý:

* Không đặt Access Key trong source code.
* Không commit tệp `.env` hoặc credential lên GitHub.
* Không sử dụng chung một key cho nhiều ứng dụng.
* Chỉ cấp quyền tối thiểu cho danh tính sở hữu key.
* Vô hiệu hóa và xóa những key không còn sử dụng.
* Thay key ngay khi nghi ngờ thông tin đã bị lộ.
* Không tạo Access Key cho Root User.

Access Key cũng nên được lưu trữ bằng giải pháp quản lý secret phù hợp thay vì đặt trực tiếp trong các tệp của ứng dụng.

---

## 7. Rà soát quyền và theo dõi hoạt động

Việc cấu hình IAM không nên kết thúc sau khi policy được tạo. Quyền truy cập và hoạt động trong tài khoản cần được rà soát định kỳ.

### IAM Access Analyzer

IAM Access Analyzer hỗ trợ phát hiện những tài nguyên có khả năng được truy cập từ bên ngoài AWS Account hoặc AWS Organization.

Công cụ này cũng hỗ trợ quá trình phân tích và thu hẹp quyền theo nguyên tắc Least Privilege.

### AWS CloudTrail

AWS CloudTrail ghi nhận các hoạt động được thực hiện thông qua:

* AWS Management Console.
* AWS CLI.
* AWS SDK.
* API của các dịch vụ AWS.

Các sự kiện CloudTrail có thể hỗ trợ xác định:

* Ai đã thực hiện hành động?
* Hành động nào đã được thực hiện?
* Hành động xảy ra khi nào?
* Tài nguyên nào có liên quan?

CloudTrail Event History cho phép xem các management event gần đây. Nếu cần lưu trữ lâu hơn hoặc phân tích tập trung, có thể cấu hình CloudTrail Trail hoặc CloudTrail Lake.

---

## Checklist kiểm tra nhanh AWS Account

Trước khi kết thúc quá trình rà soát bảo mật, có thể kiểm tra các câu hỏi sau:

* Root User đã bật MFA chưa?
* Root User có đang sở hữu Access Key không?
* Workload trên EC2, ECS hoặc Lambda đã sử dụng IAM Role chưa?
* Có danh tính nào đang được cấp `AdministratorAccess` không cần thiết không?
* Có Access Key nào không còn được sử dụng không?
* Thông tin nhạy cảm có được lưu bên ngoài source code không?
* IAM Access Analyzer và AWS CloudTrail đã được kiểm tra chưa?

---

## Kết luận

IAM là một trong những nền tảng quan trọng nhất của bảo mật trên AWS.

Một hệ thống dù được thiết kế tốt vẫn có thể gặp rủi ro nếu Root User được sử dụng thường xuyên, Access Key bị đặt trong source code hoặc quyền truy cập được cấp quá rộng.

Bảy nguyên tắc quan trọng cần ghi nhớ gồm:

1. Hạn chế sử dụng Root User.
2. Bật MFA cho các danh tính quan trọng.
3. Áp dụng nguyên tắc Least Privilege.
4. Ưu tiên temporary credentials.
5. Sử dụng IAM Role cho workload.
6. Quản lý Access Key chặt chẽ.
7. Kết hợp IAM Access Analyzer và CloudTrail để rà soát hệ thống.

Chỉ với những thay đổi cơ bản như bật MFA, loại bỏ Access Key không cần thiết, thu hẹp IAM Policy và sử dụng IAM Role đúng cách, mức độ an toàn của AWS Account đã có thể được cải thiện đáng kể.

---

## Bài viết đã đăng

---

{{< figure src="/images/Blog1IAM.png" title="Bài viết về các nguyên tắc bảo mật IAM đã được chia sẻ trên cộng đồng" >}}

[Xem bài viết trong cộng đồng First Cloud Journey](https://www.facebook.com/groups/660548818043427/?multi_permalinks=2237480747016885&hoisted_section_header_type=recently_seen)

---

## Tài liệu tham khảo

* [Các nguyên tắc bảo mật IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
* [Các nguyên tắc bảo vệ AWS account root user](https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-best-practices.html)
* [Xác thực đa yếu tố cho AWS account root user](https://docs.aws.amazon.com/IAM/latest/UserGuide/enable-mfa-for-root.html)
* [Bảo vệ và quản lý access key](https://docs.aws.amazon.com/IAM/latest/UserGuide/securing_access-keys.html)
* [Giới thiệu AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html)
