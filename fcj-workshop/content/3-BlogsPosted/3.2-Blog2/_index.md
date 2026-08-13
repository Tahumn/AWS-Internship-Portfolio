---

title: "Amazon ECS Service Auto Scaling – Scale Resources Based on Demand"
date: 2026-08-05
weight: 2
chapter: false
pre: " <b> 3.2. </b> "
---

{{% notice info %}}
📈 **Note:** This article summarizes what I learned while researching Amazon ECS Service Auto Scaling. Auto Scaling was evaluated as a production improvement and was not enabled in the current internship environment.
{{% /notice %}}

# AMAZON ECS SERVICE AUTO SCALING – SCALE RESOURCES BASED ON DEMAND

When deploying an application on Amazon ECS Fargate, it is difficult to predict exactly how many tasks will be required at every moment.

Running too few tasks may cause slow responses when traffic increases. Running too many tasks continuously can waste resources and increase operating costs.

**Amazon ECS Service Auto Scaling** helps solve this problem by automatically adjusting the desired number of ECS tasks according to workload demand.

---

## How ECS Service Auto Scaling Works

When configuring Auto Scaling for an ECS Service, we normally define:

* **Minimum capacity:** The minimum number of tasks that must remain running.
* **Maximum capacity:** The maximum number of tasks that the service can create.
* **Scaling metric:** The metric used to determine whether the service should scale.
* **Target value:** The utilization level that the system attempts to maintain.

Common metrics include:

* ECS Service average CPU utilization.
* ECS Service average memory utilization.
* Application Load Balancer request count per target.
* Custom CloudWatch metrics.

A simplified process is:

```text
Traffic increases
      ↓
CPU, memory or request count reaches the configured threshold
      ↓
Application Auto Scaling increases the desired task count
      ↓
Amazon ECS launches additional tasks
      ↓
Application Load Balancer distributes traffic across healthy tasks
```

When the workload decreases, the service can reduce the number of tasks while keeping the configured minimum capacity.

---

## Auto Scaling Is Not Only for Large Systems

What I find most useful is that Auto Scaling is not limited to extremely large systems.

Even for small applications or learning projects, studying Auto Scaling helps explain how a cloud system responds to changing workloads.

Instead of predicting the exact number of servers in advance, developers can define safe minimum and maximum limits and allow AWS to adjust the capacity based on actual usage.

This is one of the clear differences between deploying applications in the cloud and running them on a traditional fixed-capacity server.

---

## Architecture Illustration

{{< figure src="/images/blog2.jpg" title="AWS application architecture using Amazon ECS Fargate and Application Load Balancer" >}}

The diagram shows a reference architecture that uses Amazon ECS Fargate and an Application Load Balancer for the application tier, with Amazon S3, Amazon SQS, and Amazon DynamoDB supporting storage and asynchronous processing. It illustrates the Auto Scaling topic and is not the deployed Cloud Finance Platform architecture.

---

## Important Configuration Notes

* Avoid setting the CPU threshold too low, as the service may scale even when the workload is still small.
* Configure suitable scale-out and scale-in cooldown periods to prevent frequent capacity changes.
* Monitor memory utilization when the application consumes more memory than CPU.
* Set realistic minimum and maximum task limits to control availability and cost.
* Ensure that new tasks pass the Health Check before receiving traffic.
* For HTTP or HTTPS services, an Application Load Balancer helps distribute requests across healthy ECS tasks.
* Scaling the application layer does not automatically scale dependent resources such as the database.

Auto Scaling should therefore be configured together with monitoring, Health Checks and appropriate capacity planning.

---

## What I Learned

After researching this feature, I realized that Auto Scaling is not an optional luxury reserved for large applications.

The main objective is to use the appropriate amount of resources at the appropriate time:

* When traffic is low, the service can operate with fewer tasks and reduce costs.
* When traffic increases, the service can add tasks to maintain performance.
* When traffic returns to normal, unnecessary tasks can be removed.

This capability makes cloud deployment more flexible than maintaining a fixed number of traditional servers.

For my **Cloud Finance Platform**, the current environment keeps `desiredCount = 1` for each ECS Service. ECS Service Auto Scaling is a future production proposal that could improve availability and resource efficiency when the number of users increases.

---

## Published Article

---

{{< figure src="/images/MinhchungBlog2.png" title="The Amazon ECS Service Auto Scaling article shared with the community" >}}

[View the post in the First Cloud Journey community](https://www.facebook.com/groups/660548818043427/?multi_permalinks=2238712130227080&hoisted_section_header_type=recently_seen)

---

## Reference Materials

* [Amazon ECS Service Auto Scaling – AWS Documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-auto-scaling.html)
* [Amazon CloudWatch Metrics for ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/available-metrics.html)
* [Application Auto Scaling User Guide](https://docs.aws.amazon.com/autoscaling/application/userguide/what-is-application-auto-scaling.html)
* [Amazon ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/)
