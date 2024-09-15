@description('The name of the function app that you wish to create.')
param applicationInsightsName string

@description('Location for Application Insights')
param appInsightsLocation string = resourceGroup().location

param tags object

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: applicationInsightsName
  location: appInsightsLocation
  tags: tags
  properties: {
    sku: {
      name: 'PerGB2018'
    }
  }
}

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: applicationInsightsName
  location: appInsightsLocation
  tags: tags
  kind: 'web'
  properties: {
    WorkspaceResourceId: logAnalyticsWorkspace.id
    Application_Type: 'web'
    Flow_Type: 'Bluefield'
    IngestionMode: 'LogAnalytics'
  }
}

output applicationInsightsId string = applicationInsights.id
