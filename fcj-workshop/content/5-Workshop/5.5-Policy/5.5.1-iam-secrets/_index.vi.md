---
title: "Phân tích IAM và Secrets Manager"
date: 2026-08-01
weight: 1
chapter: false
pre: " <b> 5.5.1. </b> "
---

## Tách role theo ranh giới tin cậy

Môi trường dùng các role cho từng ranh giới tin cậy thay vì một credential administrator dùng chung.

![Các IAM role trong môi trường Cloud Finance](/images/5-Workshop/IAMRole.png)

`CloudFinanceGitHubActionsRole` tin cậy GitHub OIDC và chỉ phục vụ workflow triển khai. `ecsTaskExecutionRole` được ECS agent assume để pull image, tạo log stream và lấy secret được khai báo trong task definition. `cloudFinanceECSTaskRole` đại diện cho quyền mà code ứng dụng sử dụng. Service-linked role của ECS, RDS, ElastiCache và ELB do AWS quản lý, không phải quyền nghiệp vụ của ứng dụng.

Sự phân tách này giúp chẩn đoán đúng lớp: lỗi lấy secret trước khi container khởi động thuộc execution path; lỗi code gọi S3 hay AWS API khác thuộc task role.

## Trust policy của GitHub OIDC

Đây là cấu trúc policy hiệu lực cho deployment role. Account, repository và environment được thể hiện vì chính chúng xác định chủ thể nào được nhận AWS credential.

~~~json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "Federated": "arn:aws:iam::347412228908:oidc-provider/token.actions.githubusercontent.com"
    },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": {
        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
        "token.actions.githubusercontent.com:sub": "repo:Tahumn/cloud-finance-platform:environment:production"
      }
    }
  }]
}
~~~

### Giải thích từng khối

- `Principal.Federated` không tin cậy mọi người dùng GitHub; nó tin token được xác thực bởi GitHub OIDC provider đã cấu hình.
- `sts:AssumeRoleWithWebIdentity` chỉ cho phép đổi token lấy session tạm, không cấp quyền đăng nhập Console hay tạo access key dài hạn.
- `aud = sts.amazonaws.com` ngăn token cấp cho audience khác bị phát lại vào STS.
- `sub = repo:...:environment:production` khóa quyền vào đúng repository và environment `production`. Subject theo branch có định dạng khác; nhầm hai định dạng từng gây lỗi `Not authorized to perform sts:AssumeRoleWithWebIdentity`.

Trust policy trả lời **ai được assume role**. Permissions policy riêng trả lời **session sau khi assume được làm gì**. Trộn hai khái niệm thường dẫn đến workflow không đăng nhập được hoặc quyền quá rộng.

## Policy lấy secret của ECS

Task definition tham chiếu JSON key trong Secrets Manager. Execution role cần `GetSecretValue`; `kms:Decrypt` cần thiết khi secret được mã hóa bằng customer-managed key. Policy giới hạn có cấu trúc:

~~~json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadCloudFinanceSecrets",
      "Effect": "Allow",
      "Action": "secretsmanager:GetSecretValue",
      "Resource": [
        "arn:aws:secretsmanager:ap-southeast-1:347412228908:secret:cloud-finance/*",
        "arn:aws:secretsmanager:ap-southeast-1:347412228908:secret:rds!db-*"
      ]
    },
    {
      "Sid": "DecryptSecretsThroughSecretsManager",
      "Effect": "Allow",
      "Action": "kms:Decrypt",
      "Resource": "KMS_KEY_ARN",
      "Condition": {
        "StringEquals": {
          "kms:ViaService": "secretsmanager.ap-southeast-1.amazonaws.com"
        }
      }
    }
  ]
}
~~~

### Vì sao cần từng trường

- `Resource` giới hạn vào prefix của dự án và RDS-managed secret, thay vì mọi secret trong account.
- Wildcard cuối ARN cần vì Secrets Manager thêm chuỗi suffix; nó không mở quyền sang prefix khác.
- `kms:ViaService` buộc decrypt đi qua Secrets Manager tại đúng region. Với customer-managed key, `Resource` nên là key ARN, không dùng `*`.
- `DescribeSecret` không bắt buộc chỉ để inject một secret đã biết ARN. Chỉ thêm action khi code thực sự gọi API đó.

![Danh sách secret Cloud Finance không hiển thị giá trị](/images/5-Workshop/SecretStore.png)

Ảnh chỉ hiển thị tên và mục đích, không chụp value. `cloud-finance/databases` chứa URL của logical database; Redis, Gemini, SMTP và application authentication được tách để có thể rotate và phân quyền độc lập. RDS-managed secret vẫn là nguồn credential do AWS quản lý riêng.

## Task role và tích hợp S3 đang pending

Bucket receipts đã tồn tại nhưng OCR tự động lưu object vẫn được ghi nhận là pending. Vì vậy báo cáo không tuyên bố task role hiện tại đã chứng minh quyền S3 production. Khi hoàn thiện, OCR chỉ nên có `s3:PutObject`, `s3:GetObject` và action metadata cần thiết trên prefix receipts; không cấp `s3:*` cho mọi bucket. Đây là khuyến nghị triển khai, được tách rõ khỏi bằng chứng đã có.

## Kiểm thử phủ định về quyền

- Token từ repository/environment khác phải bị từ chối assume role.
- ECS task thiếu execution policy phải lỗi lấy secret trước startup.
- Application không được đọc secret ngoài phạm vi dự án.
- RDS/Redis vẫn không thể truy cập từ Internet dù IAM thay đổi, vì network control là lớp độc lập.

Các kiểm tra thể hiện defense in depth: IAM kiểm soát AWS API, security group kiểm soát đường mạng và JWT kiểm soát quyền người dùng.

