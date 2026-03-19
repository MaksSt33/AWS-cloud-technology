# Lambda error alarms — one metric filter + alarm per function.
resource "aws_cloudwatch_log_metric_filter" "lambda_errors" {
  for_each = var.lambda_function_names

  name           = "${module.label.id}-${each.key}-errors"
  pattern        = "ERROR"
  log_group_name = "/aws/lambda/${each.value}"

  metric_transformation {
    name      = "${each.key}-ErrorCount"
    namespace = "WebAppMetrics"
    value     = "1"
  }
}

resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  for_each = var.lambda_function_names

  alarm_name          = "${module.label.id}-${each.key}-error-alarm"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1
  metric_name         = aws_cloudwatch_log_metric_filter.lambda_errors[each.key].metric_transformation[0].name
  namespace           = aws_cloudwatch_log_metric_filter.lambda_errors[each.key].metric_transformation[0].namespace
  period              = 30 # evaluate every 30 seconds to catch errors quickly
  statistic           = "Sum"
  threshold           = 1
  alarm_description   = "Fires when function ${each.key} logs at least one ERROR per minute"
  alarm_actions       = [aws_sns_topic.this.arn]
}
