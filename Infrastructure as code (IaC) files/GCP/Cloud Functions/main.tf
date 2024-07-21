# Define the cloud function
resource "google_cloudfunctions2_function" "extract-sentiment-function" {
  name        = "extract-sentiment-function"
  location    = "us-central1"
  description = "a new function"

  build_config {
    runtime     = "nodejs20"
    entry_point = "helloHttp"  # Set the entry point 
    source {
      storage_source {
        bucket = "cloud-function-bucket-team36"
        object = "extract-sentiment-function-source.zip"
      }
    }
  }

  service_config {
    max_instance_count  = 1
    available_memory    = "256M"
    timeout_seconds     = 60
    ingress_settings    = "ALLOW_ALL"  # Allow all traffic
  }
}

resource "google_cloudfunctions2_function_iam_member" "invoker" {
  project        = google_cloudfunctions2_function.extract-sentiment-function.project
  location       = google_cloudfunctions2_function.extract-sentiment-function.location
  cloud_function = google_cloudfunctions2_function.extract-sentiment-function.name
  role           = "roles/cloudfunctions.invoker"
  member         = "allUsers"
}

resource "google_cloud_run_service_iam_member" "cloud_run_invoker" {
  project  = google_cloudfunctions2_function.extract-sentiment-function.project
  location = google_cloudfunctions2_function.extract-sentiment-function.location
  service  = google_cloudfunctions2_function.extract-sentiment-function.name
  role     = "roles/run.invoker"
  member   = "allUsers"
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
    ingress_settings    = "ALLOW_ALL"  # Allow all traffic
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


# Define the cloud function for chat-logger-function
resource "google_cloudfunctions2_function" "chat_logger_function" {
  name        = "chat-logger-function"
  location    = "us-central1"
  description = "A function to log chat messages"

  build_config {
    runtime     = "python39"
    entry_point = "hello_http"  # Set the entry point 
    source {
      storage_source {
        bucket = "cloud-function-bucket-team36"
        object = "chat-logger-function.zip"
      }
    }
  }

  service_config {
    max_instance_count  = 1
    available_memory    = "256M"
    timeout_seconds     = 60
    ingress_settings    = "ALLOW_ALL"  # Allow all traffic
  }
}

# Allow unauthenticated invocations for chat-logger-function
resource "google_cloudfunctions2_function_iam_member" "chat_logger_invoker" {
  project        = google_cloudfunctions2_function.chat_logger_function.project
  location       = google_cloudfunctions2_function.chat_logger_function.location
  cloud_function = google_cloudfunctions2_function.chat_logger_function.name
  role           = "roles/cloudfunctions.invoker"
  member         = "allUsers"
}

# Allow unauthenticated invocations for Cloud Run for chat-logger-function
resource "google_cloud_run_service_iam_member" "chat_logger_cloud_run_invoker" {
  project  = google_cloudfunctions2_function.chat_logger_function.project
  location = google_cloudfunctions2_function.chat_logger_function.location
  service  = google_cloudfunctions2_function.chat_logger_function.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}


# Define the cloud function for chat-retriever-function
resource "google_cloudfunctions2_function" "chat_retriever_function" {
  name        = "chat-retriever-function"
  location    = "us-central1"
  description = "A function to retrieve chat messages"

  build_config {
    runtime     = "python39"
    entry_point = "ChatRetriever"  # Set the entry point 
    source {
      storage_source {
        bucket = "cloud-function-bucket-team36"
        object = "chat-retriever-function.zip"
      }
    }
  }

  service_config {
    max_instance_count  = 1
    available_memory    = "256M"
    timeout_seconds     = 60
    ingress_settings    = "ALLOW_ALL"  # Allow all traffic
  }
}

# Allow unauthenticated invocations for chat-retriever-function
resource "google_cloudfunctions2_function_iam_member" "chat_retriever_invoker" {
  project        = google_cloudfunctions2_function.chat_retriever_function.project
  location       = google_cloudfunctions2_function.chat_retriever_function.location
  cloud_function = google_cloudfunctions2_function.chat_retriever_function.name
  role           = "roles/cloudfunctions.invoker"
  member         = "allUsers"
}

# Allow unauthenticated invocations for Cloud Run for chat-retriever-function
resource "google_cloud_run_service_iam_member" "chat_retriever_cloud_run_invoker" {
  project  = google_cloudfunctions2_function.chat_retriever_function.project
  location = google_cloudfunctions2_function.chat_retriever_function.location
  service  = google_cloudfunctions2_function.chat_retriever_function.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
