---
title: "Sharing and Feedback"
date: 2026-08-01
weight: 7
chapter: false
pre: " <b> 7. </b> "
---

During my participation in the **First Cloud AI Journey** internship program, I had the opportunity to study Amazon Web Services through a structured path, beginning with foundational knowledge and progressing toward the design and deployment of a practical cloud system.

The group project I participated in was **Cloud Finance Platform – Personal Finance Management System**, developed by a team of four members. The platform supports financial accounts, income and expense transactions, budgets, savings goals, financial planning, recurring transactions, receipt recognition using OCR, and an AI-powered financial assistant.

Through the program, I learned not only how to use individual AWS services but also how to analyze requirements, design architecture, develop applications, deploy infrastructure, troubleshoot failures, monitor systems, and control cloud operating costs.

### Overall Evaluation

**1. Learning and Working Environment**

The internship environment encouraged me to independently study, practice, and apply technical knowledge to the project. The learning content progressed from Git, GitHub, Hugo, and fundamental AWS services to architecture design and practical system deployment.

I appreciated that the program encouraged interns to consult official documentation, perform hands-on exercises, and document their progress in a Worklog. This approach helped me develop the habit of validating information, recording failures, and investigating solutions instead of relying entirely on step-by-step instructions.

However, AWS covers a broad range of services, and a significant amount of knowledge had to be studied within a limited period. Additional technical checkpoints or periodic architecture reviews could help interns identify unsuitable decisions earlier and reduce later rework.

**2. Support from Mentors and Program Administrators**

The mentors and program team provided the learning roadmap, reference materials, and general direction required to approach AWS systematically. I especially appreciated being encouraged to consult official AWS documentation and attempt to solve problems independently before requesting assistance.

During the deployment of Cloud Finance Platform, I encountered issues involving ECS Fargate, Docker images, task definitions, Service Connect, database migrations, CloudFront, the Application Load Balancer, Google Sign-In, Amazon SES, and CI/CD. Investigating logs, identifying root causes, and adjusting configurations provided valuable practical experience.

I would appreciate additional mentor reviews focused on architecture, security, cost management, and troubleshooting methods. Short reviews at key milestones would help interns validate their implementation direction before moving to the next phase.

**3. Relevance to My Academic Major**

The internship content was highly relevant to my Information Technology studies. The project required knowledge of web programming, databases, computer networks, security, system analysis, architecture design, and source-code management.

The program also introduced me to new areas, including:

- Cloud and microservices architecture.
- Containerization with Docker.
- Container deployment using Amazon ECS Fargate.
- VPC, subnet, route table, and Security Group design.
- Database deployment using Amazon RDS.
- Redis queues and background processing.
- Frontend delivery using Amazon S3 and CloudFront.
- Security using AWS WAF, IAM, and Secrets Manager.
- Monitoring using Amazon CloudWatch.
- CI/CD using GitHub Actions and AWS OIDC.
- Integration of AI and OCR into a practical system.

These topics helped me connect academic knowledge with the process of building and operating a complete application.

**4. Learning and Skill Development Opportunities**

One of the program’s strongest aspects was the opportunity to implement a system that could be deployed and tested in a real cloud environment. Instead of studying AWS services independently, I learned how multiple services interact within a complete architecture.

Through the project, I improved my ability to:

- Analyze requirements and divide a system into microservices.
- Design architecture diagrams using draw.io and AWS Architecture Icons.
- Build, manage, and test Docker images.
- Use the AWS CLI to inspect and manage resources.
- Read CloudWatch Logs and investigate ECS failures.
- Execute Alembic migrations on Amazon RDS.
- Configure internal communication using ECS Service Connect.
- Configure CloudFront to forward API traffic to an ALB.
- Manage sensitive configuration using Secrets Manager.
- Build CI/CD workflows using GitHub Actions OIDC.
- Test responsive interfaces on desktop and mobile devices.
- Write technical documentation, Worklogs, and Portfolio content.

I also learned that cloud deployment involves more than making an application publicly accessible. Security, resilience, observability, cost management, and rollback strategies must also be considered.

**5. Learning Culture and Teamwork**

The group project helped me understand the importance of responsibility assignment, progress reporting, and source-code synchronization. Team members needed to agree on the architecture, branching conventions, commit practices, and integration process to reduce conflicts.

My primary focus was AWS architecture, infrastructure deployment, ECS, databases, networking, CI/CD, and troubleshooting. These deployment activities had to be coordinated with the frontend and backend code developed by other team members.

I believe the team could further improve its workflow by using GitHub Issues, Project Boards, pull-request reviews, and phase-based checklists. These tools would clarify responsibilities and reduce dependence on informal communication.

**6. Program Content and Supporting Resources**

The AWS learning materials, Worklog, Workshop, and Portfolio requirements were valuable. Documenting the implementation process provided a record of deployment steps, encountered issues, and applied solutions.

However, AWS interfaces, policies, and service capabilities may change over time. The program should regularly update its materials and clearly distinguish between reference content, mandatory tasks, optional services, and production recommendations.

I also recommend providing a cost-control checklist for hourly billed services such as NAT Gateway, Application Load Balancer, Amazon RDS, Redis, and ECS Fargate. This would help interns avoid leaving unnecessary resources active after completing an exercise.

### Most Satisfying Experience

The most satisfying part of the internship was successfully deploying a relatively complete microservices system on AWS instead of stopping at theoretical research.

The deployed Cloud Finance Platform included:

- A frontend hosted on Amazon S3 and distributed through CloudFront.
- Backend microservices running on Amazon ECS Fargate.
- A Gateway Service behind an Application Load Balancer.
- Internal communication through ECS Service Connect.
- Amazon RDS for PostgreSQL containing six logical databases.
- A Redis queue for the Notification API and Notification Worker.
- AWS Secrets Manager for sensitive configuration.
- Amazon CloudWatch for logs and metrics.
- Amazon SES for testing OTP and notification emails.
- AWS WAF protecting CloudFront.
- GitHub Actions OIDC for automated build and deployment.

I was also satisfied with resolving practical issues such as ECS task startup failures, missing ECR images, blocked database migrations, CloudFront 504 responses, incorrect Service Connect configuration, Google OAuth `origin_mismatch`, and deprecated Gemini models.

These problems helped me understand the architecture more deeply than simply following a predefined deployment guide.

### Areas the Program Could Improve

The program already provides useful learning materials, reference links, and instructional videos. In my opinion, it could be further improved by adding:

- Short review sessions at important milestones to help interns validate their implementation direction.
- A summarized checklist for AWS security, cost control, and resource cleanup.
- More opportunities for project teams to share architecture decisions and troubleshooting experience.

These additions could help interns track their progress more effectively and avoid common deployment mistakes.

### Would I Recommend This Program?

I would recommend the program to students interested in cloud computing, AWS, DevOps, and practical application deployment.

The program is particularly suitable for learners who are willing to study independently, read technical documentation, and patiently investigate failures. Its practical content provides valuable experience in combining multiple AWS services into a working system.

However, participants should have foundational knowledge of programming, computer networks, databases, Git, and Docker. They should also monitor AWS costs carefully because some services incur hourly charges even when the application has few users.

### Suggestions and Expectations

I suggest that the program add:

- Architecture reviews at major project milestones.
- Security and cost-control checklists.
- Advanced workshops on ECS Fargate and Service Connect.
- A CI/CD workshop using GitHub Actions OIDC.
- Practical Infrastructure as Code content.
- Guidance for monitoring dashboards and CloudWatch alarms.
- Load testing, Auto Scaling, and disaster recovery content.
- Guidance for writing architecture documentation and explaining technical decisions.
- Experience-sharing sessions with teams that have completed their deployments.

I would like to participate in future advanced programs or workshops involving AWS, DevOps, cloud architecture, and artificial intelligence. If I have the opportunity to continue developing Cloud Finance Platform, I would like to:

- Complete the S3 Receipts/Exports integration.
- Implement Presigned URL receipt uploads.
- Add automated testing to the CI/CD workflow.
- Apply Infrastructure as Code.
- Configure ECS Service Auto Scaling.
- Use Multi-AZ RDS and Redis in production.
- Complete the monitoring and alerting dashboard.
- Optimize AWS resources and operating costs.
- Evaluate migration from Gemini to Amazon Bedrock.

### Additional Comments

The internship taught me that cloud computing covers a broad range of knowledge and must be reinforced through practice. A strong architecture does not necessarily use the largest number of services. It should fit the source code, business requirements, operational capacity, and available budget.

Cloud Finance Platform uses one RDS PostgreSQL instance containing multiple logical databases instead of deploying a separate RDS instance for every service. This decision controls costs in the demonstration environment while maintaining logical data ownership. Similarly, the system uses one NAT Gateway, Single-AZ RDS, and a single Redis node for the demonstration environment while clearly defining Multi-AZ improvements for production.

Overall, the program provided a positive experience and helped me improve my technical knowledge, independent learning, problem-solving, and documentation skills. It established a valuable foundation for my continued development toward a future role as a Cloud Engineer, DevOps Engineer, or Backend Engineer.