# This is for my reference for creating subcrition to any particular topic.

resource "google_pubsub_subscription" "customer_support_subscription" {
  name  = "customer-support-subscription"
  topic = google_pubsub_topic.manage_customer_support_request.id

  ack_deadline_seconds = 20

  push_config {
    push_endpoint = "https://agent-assigner-function-g3ffjvedxq-uc.a.run.app"

    oidc_token {
      service_account_email = "dalvacationhome@dalvacationhome-429314.iam.gserviceaccount.com"
      audience              = "https://agent-assigner-function-g3ffjvedxq-uc.a.run.app"
    }
  }
}