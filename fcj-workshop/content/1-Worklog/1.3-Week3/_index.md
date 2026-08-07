---

title: "Week 3 Worklog"
date: 2026-07-06
weight: 3
chapter: false
pre: " <b> 1.3. </b> "
----------------------

{{% notice warning %}}
⚠️ **Note:** The following content reflects the actual learning activities and project tasks completed during the third internship week.
{{% /notice %}}

### Week 3 Objectives

* Analyze the business requirements of the Cloud Finance Platform.
* Identify the main functional modules, microservices and REST APIs.
* Design the initial system architecture and database model.
* Research and compare suitable AWS deployment approaches.
* Select an AWS architecture that matches the project’s technical requirements.

---

### Weekly Tasks

| Day | Task                                                                                                                                                                                                                                                                                                                                                                                             | Start Date | Completion Date | Reference Materials                                                                                                                                        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mon | - Analyze the business requirements of the personal finance management system.<br>- Identify the main functions, including authentication, accounts, transactions, budgets, savings goals, planning, recurring transactions, OCR, AI and notifications.<br>- Define the initial project scope and development priorities.                                                                        | 06/07/2026 | 06/07/2026      | Project repository:<br>https://github.com/Tahumn/cloud-finance-platform                                                                                    |
| Tue | - Analyze how the system could be divided into independent microservices.<br>- Define the communication flow between the Frontend, Gateway Service and Backend Microservices.<br>- Identify the main REST APIs required for each functional group.                                                                                                                                               | 07/07/2026 | 07/07/2026      | Project repository:<br>https://github.com/Tahumn/cloud-finance-platform                                                                                    |
| Wed | - Draft the overall system architecture using Draw.io and AWS Architecture Icons.<br>- Design the initial Entity Relationship Diagram.<br>- Analyze the main entities and relationships, including User, Account, Category, Transaction, Budget, Savings Goal, Planning and Recurring Transaction.<br>- Select PostgreSQL as the main relational database.                                       | 08/07/2026 | 08/07/2026      | Learning materials:<br>https://cloudjourney.awsstudygroup.com/<br>https://www.youtube.com/@AWSStudyGroup                                                   |
| Thu | - Research Serverless architecture and the operating principles of AWS Lambda.<br>- Create and test a small Lambda Function using a Test Event as a Proof of Concept.<br>- Study how Amazon API Gateway can expose REST APIs and integrate with AWS Lambda.                                                                                                                                      | 09/07/2026 | 09/07/2026      | https://cloudjourney.awsstudygroup.com/<br>https://www.youtube.com/@AWSStudyGroup                                                                          |
| Fri | - Research Amazon DynamoDB concepts, including Partition Key, Sort Key, Query, Scan and Global Secondary Index.<br>- Compare the Serverless approach using Lambda, API Gateway and DynamoDB with the container approach using ALB, ECS Fargate and RDS PostgreSQL.<br>- Evaluate the project requirements for microservices, WebSocket communication, background processing and relational data. | 10/07/2026 | 10/07/2026      | https://cloudjourney.awsstudygroup.com/<br>https://www.youtube.com/@AWSStudyGroup                                                                          |
| Sat | - Decide not to use Lambda, API Gateway and DynamoDB as the primary deployment architecture.<br>- Select ALB, ECS Fargate and Amazon RDS PostgreSQL as the project’s main deployment direction.<br>- Update the Week 3 Worklog and architecture documents.<br>- Synchronize project files and Portfolio content with GitHub.                                                                     | 11/07/2026 | 11/07/2026      | Portfolio repository:<br>https://github.com/Tahumn/AWS-Internship-Portfolio<br><br>Project repository:<br>https://github.com/Tahumn/cloud-finance-platform |

---

### Personal Project Progress

**Project Name**

Cloud Finance Platform – Personal Finance Management System

**Tasks Completed**

* Analyzed the business requirements and defined the initial project scope.
* Identified the main functional modules and proposed microservice boundaries.
* Defined the communication flow between the Frontend, Gateway Service and Backend Microservices.
* Drafted the overall AWS architecture and initial database model.
* Selected PostgreSQL and proposed multiple logical databases for the microservices.
* Researched Lambda, API Gateway and DynamoDB through documentation and a small Proof of Concept.
* Compared Serverless and container-based deployment approaches.
* Selected ALB, ECS Fargate and Amazon RDS PostgreSQL as the primary deployment architecture.

---

### Week 3 Achievements

* Defined the main requirements and functional scope of the Cloud Finance Platform.
* Created an initial microservice and REST API design.
* Drafted the system architecture and Entity Relationship Diagram.
* Gained practical knowledge of Lambda, API Gateway and DynamoDB.
* Clearly distinguished between the researched Serverless approach and the selected container-based architecture.
* Prepared the technical foundation for continued application development and AWS deployment.
