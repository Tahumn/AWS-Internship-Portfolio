---

title: "Week 8 Worklog"
date: 2026-08-01
weight: 8
chapter: false
pre: " <b> 1.8. </b> "
---

{{% notice warning %}}
⚠️ **Note:** The dates in the table follow the Week 8 work schedule. Some testing, evaluation, and documentation tasks were completed ahead of schedule; the results below reflect work that was actually completed.
{{% /notice %}}

### Week 8 Objectives

* Perform end-to-end testing of the deployed Cloud Finance Platform.
* Verify the main application, networking, database and notification flows.
* Review the user interface, security configuration and AWS operating costs.
* Record and resolve remaining deployment issues.
* Complete the demonstration video, technical documentation, Portfolio and internship report.

---

### Weekly Tasks

| Day | Task                                                                                                                                                                                                                                                                                                                                          | Start Date | Completion Date | Reference Materials                                                                                                                                                                     |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mon | - Test the end-to-end request flow from the Frontend through CloudFront, ALB and Gateway Service to the Backend Microservices.<br>- Verify ECS Service Connect communication, Amazon RDS connectivity and Amazon CloudWatch logs.<br>- Record S3 Receipts/Exports as an incomplete integration item.                                          | 10/08/2026 | 10/08/2026      | Project repository:<br>https://github.com/Tahumn/cloud-finance-platform                                                                                                                 |
| Tue | - Test authentication, transactions, categories, budgets and savings goals.<br>- Test financial planning and recurring-transaction functions.<br>- Record functional errors and unexpected responses for correction.                                                                                                                          | 11/08/2026 | 11/08/2026      | Project repository:<br>https://github.com/Tahumn/cloud-finance-platform                                                                                                                 |
| Wed | - Test the implemented OCR and AI Agent functions.<br>- Test the Notification API, Redis Queue and Notification Worker workflow.<br>- Send test emails through Amazon SES to a verified identity.<br>- Review application and ECS logs in Amazon CloudWatch.                                                                                  | 12/08/2026 | 12/08/2026      | Project repository:<br>https://github.com/Tahumn/cloud-finance-platform<br><br>Learning materials:<br>https://cloudjourney.awsstudygroup.com/<br>https://www.youtube.com/@AWSStudyGroup |
| Thu | - Check the responsive interface on different screen sizes.<br>- Review AWS WAF, IAM Roles, IAM Policies, Security Groups and AWS Secrets Manager.<br>- Verify resource permissions and ensure that sensitive information is not exposed in the repository.                                                                                   | 13/08/2026 | 13/08/2026      | Project repository:<br>https://github.com/Tahumn/cloud-finance-platform                                                                                                                 |
| Fri | - Record and resolve remaining deployment issues.<br>- Verify ALB and ECS Health Checks.<br>- Test ECS Task recovery after a container failure.<br>- Review AWS service usage, AWS Budgets and estimated operating costs.                                                                                                                     | 14/08/2026 | 14/08/2026      | Learning materials:<br>https://cloudjourney.awsstudygroup.com/<br>https://www.youtube.com/@AWSStudyGroup                                                                                |
| Sat | - Record a demonstration video of the main system functions.<br>- Complete the AWS architecture, deployment and CI/CD documentation.<br>- Summarize encountered issues and applied solutions.<br>- Update the Week 8 Worklog and Hugo Portfolio.<br>- Synchronize the final project documents with GitHub and complete the internship report. | 15/08/2026 | 15/08/2026      | Portfolio repository:<br>https://github.com/Tahumn/AWS-Internship-Portfolio<br><br>Project repository:<br>https://github.com/Tahumn/cloud-finance-platform                              |

---

### Personal Project Progress

**Project Name**

Cloud Finance Platform – Personal Finance Management System

**Tasks Completed**

* Tested the end-to-end request flow across the deployed AWS architecture.
* Verified the main authentication, finance, planning, recurring, OCR and AI functions.
* Tested the Redis-based notification workflow and Amazon SES email delivery to a verified identity.
* Reviewed ECS Service Connect, Amazon RDS connectivity and Amazon CloudWatch logs.
* Tested the responsive interface and reviewed the main AWS security configurations.
* Recorded S3 Receipts/Exports as an incomplete integration item.
* Reviewed Health Checks, ECS Task recovery and AWS operating costs.
* Completed the demonstration video, architecture documentation and internship report.

---

### Week 8 Achievements

* Completed end-to-end testing of the main system flows.
* Verified the operation of the deployed Frontend, Backend Microservices, Amazon RDS and Redis.
* Validated Amazon SES email delivery within the Sandbox limitation.
* Identified and resolved remaining application and deployment issues.
* Reviewed security controls and AWS service costs.
* Completed the Worklog, Portfolio, demonstration video and final internship report.
