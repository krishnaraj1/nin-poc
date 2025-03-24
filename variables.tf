variable "project_id" {}
variable "region" {
  default = "us-central1"
}

# Enabled APIs
variable "enabled_apis" {
  description = "List of APIs to enable"
  type        = list(string)
  default     = [
    "container.googleapis.com"
  ]
}
