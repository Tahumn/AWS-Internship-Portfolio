---
title: "CI/CD và xác minh triển khai"
date: 2026-08-01
weight: 3
chapter: false
pre: " <b> 5.4.3. </b> "
---

## Pipeline dùng OIDC

Workflow `Deploy AWS` được trigger thủ công cho demo và chỉ yêu cầu `id-token: write`, `contents: read`. GitHub đổi OIDC token lấy AWS credential tạm thời bằng role `CloudFinanceGitHubActionsRole`; repository không lưu AWS access key dài hạn.

Backend image dùng tag `sha-${{ github.sha }}` để release bất biến và truy vết được từ commit đến ECR image, rồi đến ECS task-definition revision. Với từng service, workflow đọc task definition hiện tại, chỉ thay image/command của container tương ứng, xóa field do server sinh, đăng ký revision mới và force rolling update.

![Amazon ECR private repository với backend image tag theo Git SHA](/images/5-Workshop/ECR.png)

Ảnh cho thấy private repository `cloud-finance-backend` tại Region Singapore chứa các backend image có tag dạng `sha-…`. Tag này liên kết phiên bản image với commit phát hành, là cơ sở để đối chiếu tiếp đến ECS task-definition revision.

![GitHub Actions triển khai thành công](/images/5-Workshop/CI_CD.png)

## Thứ tự phát hành frontend

Frontend build với `VITE_API_BASE=/api/v1` để browser giữ cùng CloudFront domain. Hashed asset được upload trước với cache immutable một năm. `index.html` được upload sau cùng với `no-cache,no-store,must-revalidate`, rồi mới invalidate CloudFront. Thứ tự này có chủ đích: nếu index mới xuất hiện trước asset mà nó tham chiếu, request asset có thể rơi vào SPA fallback và nhận HTML, gây lỗi JavaScript MIME.

~~~bash
aws s3 sync frontend/dist "s3://$FRONTEND_BUCKET" \
  --delete --exclude "index.html" \
  --cache-control "public,max-age=31536000,immutable"

aws s3 cp frontend/dist/index.html \
  "s3://$FRONTEND_BUCKET/index.html" \
  --content-type "text/html" \
  --cache-control "no-cache,no-store,must-revalidate"
~~~

## Nghiệm thu release

Một build màu xanh chưa đủ. Release chỉ được chấp nhận khi:

- OIDC cấp credential tạm cho đúng repository/environment;
- ECR có đúng tag Git SHA;
- từng ECS service tham chiếu revision mới và đạt stable;
- Gateway target healthy;
- static asset và deep SPA route tải được qua CloudFront;
- `/api/v1/auth/me` không token trả `401`, chứng minh đầy đủ route edge đến Auth;
- có bản ghi CloudFront invalidation.

![Trang đăng nhập Cloud Finance được phân phối từ AWS](/images/5-Workshop/WEPTrienKhai.png)

Ảnh này chứng minh lớp frontend được phân phối, nhưng không đủ để kết luận backend đúng. Vì vậy nó được đối chiếu thêm với ECS, target health, HTTP status và CloudWatch ở chương kiểm thử.
