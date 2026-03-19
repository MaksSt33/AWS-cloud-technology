# Billing alarm — fires when estimated AWS charges exceed the configured threshold.
resource "aws_cloudwatch_metric_alarm" "billing" {
  alarm_name          = "${module.label.id}-billing"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1
  metric_name         = "EstimatedCharges"
  namespace           = "AWS/Billing"
  period              = 21600 # every 6 hours
  statistic           = "Maximum"
  threshold           = var.billing_threshold
  alarm_description   = "Fires when estimated AWS charges reach $${var.billing_threshold}"
  alarm_actions       = [aws_sns_topic.this.arn]

  dimensions = {
    Currency = "USD"
  }
}
