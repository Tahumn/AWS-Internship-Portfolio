---
title: "Chuẩn bị"
date: 2026-08-01
weight: 2
chapter: false
pre: " <b> 5.2. </b> "
---

## Tài khoản và công cụ

- Tài khoản AWS có quyền thao tác tại ap-southeast-1.
- Tài khoản GitHub và repository đã clone/fork.
- AWS CLI v2, Git, Docker Desktop, Python 3.11, Node.js 20+ và npm.
- Session Manager plugin để chẩn đoán bằng ECS Exec.
- Google OAuth client và Gemini API key.
- Email identity đã verify trong SES; khi còn Sandbox, email nhận cũng phải được verify.

Kiểm tra:

~~~powershell
aws --version
docker --version
node --version
npm --version
aws sts get-caller-identity
aws configure get region
~~~

Thiết lập Region:

~~~powershell
$region = "ap-southeast-1"
$env:AWS_REGION = $region
~~~

## Chuẩn bị source code

~~~powershell
git clone https://github.com/Tahumn/cloud-finance-platform.git
Set-Location cloud-finance-platform
Copy-Item .env.example .env
docker compose --profile micro up -d --build
docker compose ps
~~~

Không commit .env, mật khẩu database/SMTP, JWT secret hoặc Gemini key.

## Quyền AWS

Trong workshop có thể dùng administrator để triển khai lần đầu. Để báo cáo có chất lượng production, cần tách:

- Human administrator có MFA.
- ecsTaskExecutionRole để pull image, ghi log và inject secret.
- Application task role chỉ có quyền AWS API mà code thực sự cần.
- CloudFinanceGitHubActionsRole được GitHub OIDC assume.

Trust policy OIDC phải giới hạn đúng repository và environment production. Không lưu AWS access key trong GitHub.

## Thiết lập kiểm soát chi phí

1. Mở **Billing and Cost Management → Budgets → Create budget**.
2. Chọn **Cost budget → Monthly**.
3. Đặt tên cloud-finance-monthly-budget.
4. Nhập giới hạn và tạo cảnh báo 50%, 80%, 100%.
5. Xác nhận email nhận thông báo.

## Trạng thái ban đầu trước khi triển khai

Trước khi bắt đầu phần thực hành, nhóm đã chuẩn bị source code dạng monorepo gồm backend FastAPI, frontend React/Vite, Dockerfile, Docker Compose, Alembic migration và GitHub Actions workflow. Chín image local được build và kiểm tra trước khi push lên ECR.

Thông tin môi trường thực tế:

| Thuộc tính | Giá trị |
|---|---|
| AWS Region | ap-southeast-1 |
| VPC CIDR | 10.0.0.0/16 |
| ECS cluster | cloud-finance-cluster |
| ECR repository | cloud-finance-backend |
| Frontend bucket | cloud-finance-frontend-347412228908 |
| CloudFront distribution | E36WAN2GEDWN5C |
| CloudFront URL | https://d29kxn0rxd6abn.cloudfront.net |
| Runtime | Python 3.11, FastAPI, React 18, Node.js 20 |
| Database engine | PostgreSQL 16 |
| Container port | 8000 |

## Kiểm tra trước triển khai

Nhóm thực hiện ba lớp kiểm tra:

1. **Source:** không có secret trong Git; .env nằm trong .gitignore.
2. **Local:** Docker image build thành công; frontend npm build thành công; API health trả 200.
3. **AWS identity:** aws sts get-caller-identity trả đúng account và Region trước khi tạo tài nguyên.

Kết quả này giúp tránh các lỗi phổ biến như push image nhầm account/Region, frontend build dùng localhost API hoặc task không pull được image.