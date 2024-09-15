param costCenter string
param environment string
param project string

param version_TemplateSpec string
param version_ApplicationInsights string
param version_FunctionApp string
param webAppName string

var tags = {
  Environment: environment
  CostCenter: costCenter
  Project: project
  TemplateSpec_Solution: version_TemplateSpec
}

module deployAppInsights 'ApplicationInsights/ApplicationInsights.bicep' = {
  name: 'ApplicationInsights'
  params: {
    applicationInsightsName: 'ApplicationInsightsRushIaC'
    tags: union(tags, {
      version: version_ApplicationInsights
    })
    appInsightsLocation: resourceGroup().location
  }
}

module deploy 'FunctionApp/FunctionApp.bicep' = {
  name: 'FunctionApp'
  dependsOn: [deployAppInsights]
  params: {
    appName: webAppName
    tags: union(tags, {
      version: version_FunctionApp
    })
    location: resourceGroup().location
    applicationInsightsName: 'ApplicationInsightsRushIaC'
  }
}

output applicationInsightsId string = deployAppInsights.outputs.applicationInsightsId
