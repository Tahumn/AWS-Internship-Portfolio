---

title: "7 IAM Best Practices for Better AWS Account Security"
date: 2026-08-06
weight: 1
chapter: false
pre: " <b> 3.1. </b> "
----------------------

{{% notice info %}}
🔐 **Security Note:** AWS Identity and Access Management is one of the most important foundations for protecting identities, workloads and cloud resources.
{{% /notice %}}

# 7 IAM BEST PRACTICES FOR BETTER AWS ACCOUNT SECURITY

When people first start using AWS, they often focus on launching EC2 instances, storing data in Amazon S3 or deploying databases with Amazon RDS.

However, before considering system performance, an important security question must be answered:

> Who is allowed to access the resources, and what actions are they allowed to perform?

This is the role of **AWS Identity and Access Management – IAM**.

IAM helps manage identities, authenticate users and control access to resources within an AWS Account. When a user or application sends a request, AWS evaluates the identity, policies, requested action and target resource before allowing or denying access.

Below are seven important practices that can make an AWS Account more secure and easier to manage.

---

{{< figure src="/images/IAMbaomat.png" title="AWS IAM Security Best Practices" >}}

---

## 1. Do Not Use the Root User for Daily Tasks

The Root User is created together with the AWS Account and has extensive access to resources, account settings and billing information.

AWS recommends avoiding the Root User for routine activities such as:

* Launching EC2 instances.
* Modifying Security Groups.
* Managing S3 Buckets.
* Deploying application resources.

After creating an AWS Account, you should:

* Set a strong and unique password.
* Enable MFA for the Root User.
* Avoid creating Root User Access Keys.
* Use the Root User only for tasks that specifically require it.

For regular administration, use AWS IAM Identity Center, federated identities or IAM Roles with an appropriate permission scope.

---

## 2. Enable Multi-Factor Authentication

Even a strong password can be exposed through phishing, data leaks or password reuse.

Multi-Factor Authentication adds another verification step beyond the password, reducing the risk of unauthorized access.

MFA should be enabled for:

* The AWS Account Root User.
* Accounts with administrative permissions.
* Identities that can modify IAM resources.
* IAM Users that are still actively used.

AWS supports MFA methods such as passkeys, security keys and authenticator applications. Passkeys or hardware security keys should be prioritized when possible.

---

## 3. Apply the Principle of Least Privilege

Least Privilege means granting a user or application only the permissions required to complete its task.

For example, if an application only needs to read images from one S3 Bucket, it may only require:

```text
s3:ListBucket
s3:GetObject
```

It should not receive `AdministratorAccess` or full access to all Amazon S3 resources.

A restricted policy may look like this:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::example-image-bucket"
    },
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::example-image-bucket/*"
    }
  ]
}
```

When creating IAM Policies:

* Avoid overly broad actions and resources.
* Limit permissions to the required services and resources.
* Review permissions when system requirements change.
* Remove permissions that are no longer required.

---

## 4. Prefer Temporary Credentials

IAM Users can use long-term Access Keys. These credentials remain valid until they are disabled or deleted.

If a long-term Access Key is exposed, another person may use it to send requests to AWS.

For organizational users, AWS recommends IAM Identity Center or identity federation to provide temporary credentials.

A simplified flow is:

```text
User signs in
      ↓
Assumes permissions through an IAM Role
      ↓
AWS provides temporary credentials
      ↓
The user accesses authorized resources
```

Temporary credentials expire after a limited period, reducing the risk associated with leaked credentials.

---

## 5. Use IAM Roles for Applications

A common security mistake is storing Access Keys directly in source code or environment files:

```text
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

If the source code is shared or the repository becomes public, the credentials may be exposed.

AWS workloads should use IAM Roles instead:

* Amazon EC2 uses an IAM Role through an Instance Profile.
* Amazon ECS uses an ECS Task Role.
* AWS Lambda uses a Lambda Execution Role.

The workload then receives temporary credentials automatically without storing long-term Access Keys in the application.

For example, an ECS Task that only uploads receipts to S3 can receive a Task Role containing only `s3:PutObject` permission for the required receipts path.

---

## 6. Manage Access Keys Carefully

Some external systems may still require Access Keys. In that case, Access Keys should be treated as an exception rather than the default authentication method.

Important practices include:

* Do not place Access Keys in source code.
* Do not commit `.env` files or credential files to GitHub.
* Do not share one key between multiple applications.
* Grant only the minimum permissions required.
* Disable and delete unused keys.
* Rotate or replace keys immediately if exposure is suspected.
* Never create Access Keys for the Root User.

Access Keys should also be stored using an appropriate secret-management solution rather than plain-text application files.

---

## 7. Review Permissions and Monitor Activity

IAM configuration should not end after a policy is created. Permissions and account activity should be reviewed regularly.

### IAM Access Analyzer

IAM Access Analyzer can help identify resources that may be accessible from outside the AWS Account or organization.

It can also support Least Privilege by helping teams analyze and refine access permissions.

### AWS CloudTrail

AWS CloudTrail records activities performed through:

* AWS Management Console.
* AWS CLI.
* AWS SDKs.
* AWS service APIs.

CloudTrail events can help answer:

* Who performed the action?
* What action was performed?
* When did it occur?
* Which resource was involved?

CloudTrail Event History allows users to review recent management events. For longer retention and centralized analysis, a CloudTrail Trail or CloudTrail Lake can be configured.

---

## Quick AWS Account Security Checklist

Before completing your security review, check the following:

* Is MFA enabled for the Root User?
* Does the Root User have an Access Key?
* Do workloads on EC2, ECS or Lambda use IAM Roles?
* Are any identities unnecessarily assigned `AdministratorAccess`?
* Are there unused Access Keys?
* Are sensitive credentials stored outside the source code?
* Have IAM Access Analyzer and AWS CloudTrail been reviewed?

---

## Conclusion

IAM is one of the most important foundations of AWS security.

Even a well-designed system may remain vulnerable if the Root User is used regularly, Access Keys are stored in source code or permissions are granted too broadly.

The seven key practices are:

1. Limit the use of the Root User.
2. Enable MFA for important identities.
3. Apply the principle of Least Privilege.
4. Prefer temporary credentials.
5. Use IAM Roles for workloads.
6. Manage Access Keys carefully.
7. Combine IAM Access Analyzer and CloudTrail for continuous review.

Basic improvements such as enabling MFA, removing unused Access Keys, narrowing IAM Policies and using IAM Roles can significantly improve the security of an AWS Account.

---

## Article Link

---

{{< figure src="/images/Blog1IAM.png" title="AWS IAM Security Best Practices" >}}

https://www.facebook.com/groups/awsstudygroupfcj?locale=vi_VN

---

## Reference Materials

* [Security best practices in IAM](PASTE_AWS_IAM_SECURITY_BEST_PRACTICES_LINK_HERE)
* [Root user best practices for your AWS account](PASTE_ROOT_USER_BEST_PRACTICES_LINK_HERE)
* [AWS Multi-factor authentication in IAM](PASTE_AWS_MFA_DOCUMENTATION_LINK_HERE)
* [Manage access keys for IAM users](PASTE_ACCESS_KEY_DOCUMENTATION_LINK_HERE)
* [What is AWS CloudTrail?](PASTE_CLOUDTRAIL_DOCUMENTATION_LINK_HERE)
