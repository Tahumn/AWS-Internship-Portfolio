---

title: "Week 5 Worklog"
date: 2026-07-20
weight: 5
chapter: false
pre: " <b> 1.5. </b> "
----------------------

{{% notice warning %}}
⚠️ **Note:** The following content reflects the actual AWS networking and container-registry activities completed during the fifth internship week.
{{% /notice %}}

### Week 5 Objectives

* Review and refine the AWS deployment architecture.
* Design the Amazon VPC and subnet structure for the system.
* Configure basic networking and security components.
* Prepare Docker Images for the backend microservices.
* Store and manage the application Images using Amazon ECR.
* Update the networking diagram and deployment documentation.

---

### Weekly Tasks

| Day | Task                                                                                                                                                                                                                                                                                                                                     | Start Date | Completion Date | Reference Materials                                                                                                                                                                     |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mon | - Review the current AWS architecture of the Cloud Finance Platform.<br>- Identify the networking requirements for the public, application and database layers.<br>- Plan a VPC architecture across two Availability Zones.                                                                                                              | 20/07/2026 | 20/07/2026      | Learning materials:<br>https://cloudjourney.awsstudygroup.com/<br>https://www.youtube.com/@AWSStudyGroup<br><br>Project repository:<br>https://github.com/Tahumn/cloud-finance-platform |
| Tue | - Create the Amazon VPC for the deployment environment.<br>- Design six subnets across two Availability Zones, including two Public Subnets, two Private Application Subnets and two Private Database Subnets.<br>- Configure the Internet Gateway for public network access.                                                            | 21/07/2026 | 21/07/2026      | https://cloudjourney.awsstudygroup.com/<br>https://www.youtube.com/@AWSStudyGroup                                                                                                       |
| Wed | - Configure Route Tables for the public, private application and private database subnet groups.<br>- Configure a NAT Gateway for outbound traffic from resources in the Private Application Subnets.<br>- Compare the current single-NAT design with the production target of one NAT Gateway per Availability Zone.                    | 22/07/2026 | 22/07/2026      | https://cloudjourney.awsstudygroup.com/                                                                                                                                                 |
| Thu | - Configure Security Groups for the Application Load Balancer, ECS Fargate, Amazon RDS and Redis.<br>- Review the permitted communication flows between the system components.<br>- Use AWS CLI to inspect and verify selected AWS resources and configurations.                                                                         | 23/07/2026 | 23/07/2026      | Learning materials:<br>https://cloudjourney.awsstudygroup.com/<br>https://www.youtube.com/@AWSStudyGroup                                                                                |
| Fri | - Create the `cloud-finance-backend` Amazon ECR Private Repository.<br>- Standardize the Dockerfiles and Docker Image build process.<br>- Build nine Docker Images corresponding to the nine system services.<br>- Apply separate tags to distinguish the Images within the same ECR Repository.                                         | 24/07/2026 | 24/07/2026      | Project repository:<br>https://github.com/Tahumn/cloud-finance-platform                                                                                                                 |
| Sat | - Push the tagged Docker Images to Amazon ECR.<br>- Verify the Image list, tags and versions in the ECR Repository.<br>- Prepare the Image URIs for future ECS Task Definitions.<br>- Update the VPC diagram, ECR deployment documentation and Week 5 Worklog.<br>- Synchronize the updated project and Portfolio documents with GitHub. | 25/07/2026 | 25/07/2026      | Portfolio repository:<br>https://github.com/Tahumn/AWS-Internship-Portfolio<br><br>Project repository:<br>https://github.com/Tahumn/cloud-finance-platform                              |

---

### Personal Project Progress

**Project Name**

Cloud Finance Platform – Personal Finance Management System

**Tasks Completed**

* Reviewed and refined the AWS deployment architecture.
* Designed an Amazon VPC across two Availability Zones.
* Created a six-subnet structure for the public, application and database layers.
* Configured the Internet Gateway, Route Tables and NAT Gateway.
* Prepared Security Groups for the main AWS components.
* Reviewed the permitted communication flows between system layers.
* Created the `cloud-finance-backend` Amazon ECR Private Repository.
* Standardized the Docker Image build and tagging process.
* Built, tagged and pushed nine service Images to Amazon ECR.
* Prepared the Image URIs required for the next ECS deployment phase.

---

### Week 5 Achievements

* Completed the initial AWS networking infrastructure for the project.
* Established a clear subnet structure across two Availability Zones.
* Configured basic routing, outbound connectivity and security controls.
* Understood the difference between the current NAT design and the production high-availability target.
* Created and managed the backend Docker Images using Amazon ECR.
* Prepared the networking and container artifacts required for Amazon ECS deployment.
* Updated the architecture diagram, Worklog and technical documentation.
