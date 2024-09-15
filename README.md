This repo is used in the [Change Management in Infrastructure as a Code (IaC) series](https://dev.to/kkazala/change-management-in-infrastructure-as-a-code-iac-32kn).

It is the final state of repo, providing the following functionality:

- Provisioning of Workspace-based Application Insights and Azure Function using isolated model
- Rush orchestration for version management and creation of change logs based on developers' inputs
- Custom Rush command to copy versiont to the parameters file used during deplymnet
- Deployment file to be used in Azure DevOps pipeline, which provisions Template Specs and services defined in Bicep templates, tags services with appropriate version  numbers, creates release annotation in Application Insights