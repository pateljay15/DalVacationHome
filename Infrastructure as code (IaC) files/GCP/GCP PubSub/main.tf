resource "google_pubsub_topic" "manage_customer_support_request" {
  name = "ManageCustomerSupportRequest"
  labels = {
    environment = "production" # Adjust label as needed
  }

  message_retention_duration = "86400s" # 1 day retention; adjust as needed

  message_storage_policy {
    allowed_persistence_regions = [
      "us-central1",
      "us-east1"
    ]
  }
}


# Define the cloud function
resource "google_cloudfunctions2_function" "agent_assigner_function" {
  name        = "agent-assigner-function"
  location    = "us-central1"
  description = "A function to assign agents"

  build_config {
    runtime     = "python39"
    entry_point = "hello_pubsub"  # Set the entry point 
    source {
      storage_source {
        bucket = "cloud-function-bucket-team36"
        object = "agent-assigner-function.zip"
      }
    }
  }

  service_config {
    max_instance_count  = 1
    available_memory    = "256M"
    timeout_seconds     = 60
    ingress_settings = "ALLOW_INTERNAL_ONLY"
  }

  event_trigger {
    trigger_region = "us-central1"
    event_type = "google.cloud.pubsub.topic.v1.messagePublished"
    pubsub_topic = google_pubsub_topic.manage_customer_support_request.id
    retry_policy = "RETRY_POLICY_RETRY"
    service_account_email = "dalvacationhome@dalvacationhome-429314.iam.gserviceaccount.com"
  }
}

# Allow unauthenticated invocations for Cloud Function
resource "google_cloudfunctions2_function_iam_member" "agent_assigner_invoker" {
  project        = google_cloudfunctions2_function.agent_assigner_function.project
  location       = google_cloudfunctions2_function.agent_assigner_function.location
  cloud_function = google_cloudfunctions2_function.agent_assigner_function.name
  role           = "roles/cloudfunctions.invoker"
  member         = "allUsers"
}

# Allow unauthenticated invocations for Cloud Run
resource "google_cloud_run_service_iam_member" "agent_assigner_cloud_run_invoker" {
  project  = google_cloudfunctions2_function.agent_assigner_function.project
  location = google_cloudfunctions2_function.agent_assigner_function.location
  service  = google_cloudfunctions2_function.agent_assigner_function.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

