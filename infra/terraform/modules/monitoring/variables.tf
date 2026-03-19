variable "alert_email" {
  description = "Email address to receive CloudWatch alarm notifications via SNS"
  type        = string
}

variable "lambda_function_names" {
  description = "Map of Lambda function names (key = function slug) used to build log group paths for metric filters"
  type        = map(string)
}

variable "billing_threshold" {
  description = "USD amount at which the billing alarm fires"
  type        = number
  default     = 10
}

variable "slack_webhook_url" {
  description = "Slack Webhook URL for notifications"
  type        = string
  sensitive   = true
}
