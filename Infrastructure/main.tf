terraform {
  backend "gcs" {}
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Enable APIs
resource "google_project_service" "enabled_apis" {
  for_each = toset(var.enabled_apis)
  project  = var.project_id
  service  = each.value
}

resource "google_container_cluster" "nino-primary" {
  name               = "nino-cluster-1"
  location           = "${var.region}-a"
  initial_node_count = 1

  # Disable deletion protection
  deletion_protection = false

  node_config {
    machine_type = "e2-medium"
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  }

  remove_default_node_pool = true
}

resource "google_container_node_pool" "default-node-pool" {
  name               = "default-node-pool"
  location           = "${var.region}-a"
  cluster            = google_container_cluster.nino-primary.name
  initial_node_count = 3
  node_config {
    machine_type = "e2-medium"
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  }
}
