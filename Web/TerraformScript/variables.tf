provider "azurerm" {
   subscription_id = "${var.subscription_id}"
   client_id       = "${var.client_id}"
   client_secret   = "${var.client_secret}"
   tenant_id       = "${var.tenant_id}"
}


variable "subscription_id" {
    description = "Enter Subscription ID for provisioning resources inAzure"
    }

variable "client_id" {
  description = "Enter client ID for Application created in Azure AD"
}

variable "client_secret" {
    description = "Enter client Secret for Application in Azure AD"  
}


variable "tenant_id" {
  description = "Enter tenant ID / Directory ID for your Azure AD"
}
 # variable "rg_name" {
 #    description = "resource group name"
 #}


