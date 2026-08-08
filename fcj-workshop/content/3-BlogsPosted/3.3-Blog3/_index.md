---

title: "Managing secrets on AWS: When .env is no longer the best choice"
date: 2026-08-06
weight: 3
chapter: false
pre: " <b> 3.3. </b> "
----------------------

{{% notice info %}}
🔐 **Security Note:** Sensitive information such as database credentials, API keys, and application secrets should be separated from source code and container images in production environments.
{{% /notice %}}

# MANAGING SECRETS ON AWS: WHEN `.ENV` IS NO LONGER THE BEST CHOICE

During local development, using a `.env` file to store configuration such as a Database URL, API Key, or JWT Secret is very common.

However, when an application moves to a production environment on AWS, copying the `.env` file to a server, embedding it in a Docker Image, or hardcoding credentials directly in source code can create significant security risks.

---

## Why Should `.env` Files Be Avoided in Production?

### Risk of Credential Exposure

If a `.env` file is accidentally committed to Git or included in a Docker Image, sensitive credentials may be exposed.

Examples include:

* Database passwords
* API keys
* JWT secrets
* Email credentials
* External service credentials

Once exposed, these credentials may allow unauthorized access to important resources.

### Difficult Secret Updates

When credentials are stored directly in files or container images, changing a database password or API key may require updating configuration, rebuilding the image, and redeploying the application.

This makes secret management harder to maintain as the system grows.

---

## AWS Solutions: Secrets Manager and Parameter Store

AWS provides services designed to separate sensitive configuration from application code.

### AWS Secrets Manager

AWS Secrets Manager is designed for storing and managing sensitive information such as:

* Database credentials
* API keys
* Application secrets
* Authentication credentials

### AWS Systems Manager Parameter Store

Parameter Store can be used for application configuration and can also store encrypted values using the `SecureString` parameter type.

Depending on the AWS service and deployment configuration, applications can retrieve these values at runtime or have them securely injected when a workload starts.

A simplified flow looks like this:

```text
Application / ECS Task
        ↓
       IAM Role
        ↓
AWS Secrets Manager / Parameter Store
        ↓
Retrieve authorized configuration
```

The application therefore does not need to store long-term secret values directly in the source code.

---

## Best Practices for Managing Secrets

### 1. Store References, Not Secret Values

Deployment configuration should reference the secret rather than contain the real credential.

For example, an ECS Task Definition can reference a secret stored in AWS Secrets Manager instead of containing the database password directly.

---

### 2. Apply Least Privilege

Each service should only have permission to access the secrets it actually requires.

For example:

```text
Auth Service
   ↓
JWT Secret

Finance Service
   ↓
Finance Database Secret
```

The Auth Service should not automatically receive permission to read the Finance Service database credentials.

---

### 3. Use a Clear Naming Structure

Organizing secrets by environment and service makes them easier to manage.

For example:

```text
/production/finance/db_password
/staging/ai/gemini_key
/production/auth/jwt_secret
```

This becomes especially useful when an application has development, staging, and production environments.

---

### 4. Never Print Secrets to Logs

Moving credentials to Secrets Manager does not help if the application later prints them into CloudWatch Logs.

Source code should therefore be reviewed to ensure sensitive values are never exposed through:

* Debug output
* Exception messages
* Application logs
* CI/CD logs

---

## What I Learned

For local development, `.env` files are convenient and easy to use.

For production workloads on AWS, however, separating secrets from source code and Docker Images provides much better security and maintainability.

Using **AWS Secrets Manager**, **Parameter Store**, and properly scoped **IAM Roles** helps applications access only the information they need without embedding sensitive values directly in the codebase.

For my Cloud Finance Platform, this approach also makes it easier to separate database, email, and external-service credentials between different backend services.

The main principle is simple:

> **Keep configuration and secrets outside the application code, and give each workload only the permissions it actually needs.**

---

## Article Link

---

{{< figure src="/images/MinhChungBlog3.png" title="AWS IAM Security Best Practices" >}}

https://www.facebook.com/groups/awsstudygroupfcj

---

## References

* AWS Secrets Manager Documentation
* AWS Systems Manager Parameter Store Documentation
* IAM Roles for Amazon ECS Tasks
* AWS Security Best Practices
