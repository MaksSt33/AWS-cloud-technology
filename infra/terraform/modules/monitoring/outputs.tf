output "sns_topic_arn" {
  description = "ARN of the SNS topic used for all monitoring alerts"
  value       = aws_sns_topic.this.arn
}
