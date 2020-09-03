resource "azurerm_resource_group" "resource_gp" {
  name     = "<project_name>-RG"
  location = "Central India"
}

resource "azurerm_storage_account" "resource_gp" {
  name                     = "st<project_name><env_name><app_name>"
  resource_group_name      = "${azurerm_resource_group.resource_gp.name}"
  location                 = "${azurerm_resource_group.resource_gp.location}"
  account_kind             = "StorageV2"
  account_tier             = "Standard"
  account_replication_type = "LRS"
  enable_https_traffic_only = true
}
  
resource "azurerm_storage_container" "resource_gp" {
  name                  = "$web"
  resource_group_name   = "${azurerm_resource_group.resource_gp.name}"
  storage_account_name  = "${azurerm_storage_account.resource_gp.name}"
  container_access_type = "container"
}

output "storage_account_access_key" {
  value = "${azurerm_storage_account.resource_gp.primary_access_key}"
}

resource "local_file" "access_key"{
	content = "${azurerm_storage_account.resource_gp.primary_access_key}"
	filename = "output.txt"

}