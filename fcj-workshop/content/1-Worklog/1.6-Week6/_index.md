---

title: "Week 6 Worklog"
date: 2026-07-27
weight: 6
chapter: false
pre: " <b> 1.6. </b> "
----------------------

{{% notice warning %}}
⚠️ **Note:** The following content reflects the actual data-layer and container deployment activities completed during the sixth internship week.
{{% /notice %}}

### Week 6 Objectives

* Deploy the project’s data layer using Amazon RDS for PostgreSQL and Redis.
* Secure database credentials and sensitive configuration using AWS Secrets Manager.
* Deploy the backend services using Amazon ECS Fargate.
* Configure internal service communication using ECS Service Connect.
* Verify database connectivity and service communication.
* Document the deployed data and container architecture.

---

### Weekly Tasks

| Day | Task                                                                                                                                                                                                                                                                                                                                                                                                                                             | Start Date | Completion Date | Reference Materials                                                                                                                                                                     |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mon | - Create an Amazon RDS for PostgreSQL instance for the system.<br>- Configure the RDS Security Group to allow access from the ECS Security Group through TCP port 5432.<br>- Review the database connection settings for the backend services.                                                                                                                                                                                                   | 27/07/2026 | 27/07/2026      | Learning materials:<br>https://cloudjourney.awsstudygroup.com/<br>https://www.youtube.com/@AWSStudyGroup<br><br>Project repository:<br>https://github.com/Tahumn/cloud-finance-platform |
| Tue | - Create six logical databases: Auth DB, Finance DB, AI DB, Notification DB, Planning DB and Recurring DB.<br>- Execute Alembic migrations to initialize a separate schema for each logical database.<br>- Verify read and write connectivity between the backend services and Amazon RDS.                                                                                                                                                       | 28/07/2026 | 28/07/2026      | Project repository:<br>https://github.com/Tahumn/cloud-finance-platform                                                                                                                 |
| Wed | - Deploy Redis for the notification-processing queue.<br>- Configure the Notification API to enqueue jobs into Redis.<br>- Configure the Notification Worker to consume jobs from Redis.<br>- Evaluate a Redis Multi-AZ architecture as a future production target.                                                                                                                                                                              | 29/07/2026 | 29/07/2026      | Learning materials:<br>https://cloudjourney.awsstudygroup.com/<br>https://www.youtube.com/@AWSStudyGroup<br><br>Project repository:<br>https://github.com/Tahumn/cloud-finance-platform |
| Thu | - Create secrets for database connections, email configuration and external services in AWS Secrets Manager.<br>- Configure the ECS Task IAM Role to access the required secrets.<br>- Remove sensitive configuration from source code and Docker Images.<br>- Create the Amazon ECS Cluster and begin preparing ECS Task Definitions.                                                                                                           | 30/07/2026 | 30/07/2026      | Project repository:<br>https://github.com/Tahumn/cloud-finance-platform                                                                                                                 |
| Fri | - Configure CPU, memory, port mappings, environment variables and secrets for the ECS Task Definitions.<br>- Deploy nine backend services using Amazon ECS Fargate in the Private Application Subnets.<br>- Configure ECS Service Connect for internal communication between the microservices.<br>- Inspect ECS Task and ECS Service status in the AWS Console.                                                                                 | 31/07/2026 | 31/07/2026      | Learning materials:<br>https://cloudjourney.awsstudygroup.com/<br><br>Project repository:<br>https://github.com/Tahumn/cloud-finance-platform                                           |
| Sat | - Verify communication between the deployed services and Amazon RDS.<br>- Record and resolve issues related to Docker Images, Task Definitions, IAM Roles and database connections.<br>- Maintain `desiredCount = 1` for each service in the current environment.<br>- Research and propose an ECS Auto Scaling Policy for production without applying it to the current deployment.<br>- Update the Week 6 Worklog and technical documentation. | 01/08/2026 | 01/08/2026      | Portfolio repository:<br>https://github.com/Tahumn/AWS-Internship-Portfolio<br><br>Project repository:<br>https://github.com/Tahumn/cloud-finance-platform                              |

---

### Personal Project Progress

**Project Name**

Cloud Finance Platform – Personal Finance Management System

**Tasks Completed**

* Created Amazon RDS for PostgreSQL and configured database access through TCP port 5432.
* Organized six logical databases for the backend microservices.
* Executed Alembic migrations to initialize the required database schemas.
* Deployed Redis and established the notification enqueue and consume workflow.
* Stored database and external-service credentials in AWS Secrets Manager.
* Created the Amazon ECS Cluster and ECS Task Definitions.
* Deployed nine backend services using Amazon ECS Fargate.
* Configured ECS Service Connect for internal service communication.
* Verified service status, database connectivity and communication between microservices.
* Documented the current `desiredCount = 1` configuration and proposed Auto Scaling for production.

---

### Week 6 Achievements

* Established the main database layer using Amazon RDS for PostgreSQL.
* Initialized six logical databases through Alembic migrations.
* Implemented the Redis-based notification queue workflow.
* Improved sensitive-information management using AWS Secrets Manager.
* Deployed nine backend services on Amazon ECS Fargate.
* Enabled internal communication using ECS Service Connect.
* Verified the main connections between ECS services, Redis and Amazon RDS.
* Updated the data-layer, ECS architecture and deployment documentation.
