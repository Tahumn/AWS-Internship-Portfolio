---

title: "Week 7 Worklog"
date: 2026-08-03
weight: 7
chapter: false
pre: " <b> 1.7. </b> "
----------------------

{{% notice warning %}}
⚠️ **Note:** The following content reflects the actual deployment and operational activities carried out during the seventh internship week.
{{% /notice %}}

### Week 7 Objectives

* Distribute backend traffic through an Application Load Balancer.
* Deploy the production Frontend using Amazon S3 and CloudFront.
* Configure AWS WAF, Amazon SES and Amazon CloudWatch.
* Provision the S3 Receipts/Exports storage resources.
* Establish CI/CD workflows using GitHub Actions and AWS OIDC.
* Update the deployment architecture and technical documentation.

---

### Weekly Tasks

| Day | Task                                                                                                                                                                                                                                                                                                                                                                                                                                   | Start Date | Completion Date | Reference Materials                                                                                                                                                                     |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mon | - Deploy an Application Load Balancer across two Public Subnets.<br>- Create a Target Group for the Gateway Service.<br>- Configure the Listener, forwarding rules and Health Check.<br>- Verify traffic from the ALB to the Gateway Service on Amazon ECS Fargate.                                                                                                                                                                    | 03/08/2026 | 03/08/2026      | Learning materials:<br>https://cloudjourney.awsstudygroup.com/<br>https://www.youtube.com/@AWSStudyGroup<br><br>Project repository:<br>https://github.com/Tahumn/cloud-finance-platform |
| Tue | - Build the production version of the Frontend.<br>- Create an Amazon S3 Bucket for the Static Web Application.<br>- Upload the built Frontend files to Amazon S3.<br>- Configure Amazon CloudFront to distribute the Frontend and forward backend requests to the ALB.<br>- Verify website access through CloudFront.                                                                                                                 | 04/08/2026 | 04/08/2026      | Project repository:<br>https://github.com/Tahumn/cloud-finance-platform<br><br>Learning materials:<br>https://cloudjourney.awsstudygroup.com/                                           |
| Wed | - Configure AWS WAF to protect the CloudFront distribution.<br>- Configure Amazon SES for authentication, OTP, password recovery and notification emails.<br>- Record that Amazon SES is operating in Sandbox and can only send test emails to verified identities.<br>- Configure Amazon CloudWatch logs and monitor ECS Task, CPU, memory and network status.<br>- Review IAM Roles, IAM Policies and Security Groups.               | 05/08/2026 | 05/08/2026      | https://cloudjourney.awsstudygroup.com/<br>https://www.youtube.com/@AWSStudyGroup                                                                                                       |
| Thu | - Provision the Amazon S3 Bucket for receipts and exported files.<br>- Prepare the folder structure, Bucket Policy and required access permissions.<br>- Update the design for the OCR Service read/write flow with S3 Receipts/Exports.<br>- Record that application integration, Presigned URL and upload/download testing are still pending.                                                                                        | 06/08/2026 | 06/08/2026      | Project repository:<br>https://github.com/Tahumn/cloud-finance-platform                                                                                                                 |
| Fri | - Create GitHub Actions workflows for Continuous Integration and deployment.<br>- Configure GitHub Actions OIDC authentication with AWS.<br>- Build one shared Backend Docker Image.<br>- Push the Backend Image to Amazon ECR using an immutable Git commit SHA tag.<br>- Configure each ECS Service to use the shared Image with its own service command.<br>- Create the Frontend deployment workflow for Amazon S3 and CloudFront. | 07/08/2026 | 07/08/2026      | Project repository:<br>https://github.com/Tahumn/cloud-finance-platform                                                                                                                 |
| Sat | - Verify the CI/CD workflow from GitHub Actions to Amazon ECR, ECS, S3 and CloudFront.<br>- Check ALB routing, CloudFront access, WAF protection and CloudWatch logs.<br>- Monitor the Amazon SES Production Access request.<br>- Update the Week 7 Worklog, deployment diagram and technical documentation.<br>- Synchronize the Portfolio and project documents with GitHub.                                                         | 08/08/2026 | 08/08/2026      | Portfolio repository:<br>https://github.com/Tahumn/AWS-Internship-Portfolio<br><br>Project repository:<br>https://github.com/Tahumn/cloud-finance-platform                              |

---

### Personal Project Progress

**Project Name**

Cloud Finance Platform – Personal Finance Management System

**Tasks Completed**

* Deployed the Application Load Balancer and configured routing to the Gateway Service.
* Deployed the production Frontend using Amazon S3 and CloudFront instead of Amazon ECS Fargate.
* Configured AWS WAF to protect the CloudFront distribution.
* Configured Amazon SES in Sandbox for sending test emails to verified identities.
* Configured Amazon CloudWatch logging and basic ECS resource monitoring.
* Provisioned the S3 Receipts/Exports Bucket and prepared its access configuration.
* Recorded the S3 Receipts/Exports application integration as pending.
* Created GitHub Actions workflows using AWS OIDC authentication.
* Built and pushed one shared Backend Image using an immutable Git commit SHA tag.
* Configured each ECS Service to run its corresponding command from the shared Backend Image.

---

### Week 7 Achievements

* Established the public access flow from CloudFront through the ALB to the Gateway Service.
* Deployed the Frontend as a Static Web Application using Amazon S3 and CloudFront.
* Added WAF protection, CloudWatch logging and SES test-email support.
* Prepared the S3 Receipts/Exports storage resources without overstating unfinished integration.
* Established CI/CD workflows for the Backend and Frontend.
* Updated the AWS architecture diagram, Worklog and technical documentation.
