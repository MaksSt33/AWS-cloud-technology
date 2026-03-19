module "label" {
  source  = "cloudposse/label/null"
  version = "0.25.0"
  context = module.this.context
  name    = "alerts"
}

# SNS topic — single notification channel shared by all alarms in this module
resource "aws_sns_topic" "this" {
  name = module.label.id
  tags = module.label.tags
}

# Email subscription — one subscriber, one responsibility
resource "aws_sns_topic_subscription" "email" {
  topic_arn = aws_sns_topic.this.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

# Lambda Function for Slack Notifications

resource "aws_sns_topic_subscription" "slack_lambda" {
  topic_arn = aws_sns_topic.this.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.slack_notifier.arn
}

resource "aws_lambda_permission" "sns" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.slack_notifier.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.this.arn
}

resource "aws_lambda_function" "slack_notifier" {
  function_name = "${module.label.id}-slack-notifier"
  handler       = "slack-notifier.handler"
  runtime       = "nodejs20.x"
  role          = aws_iam_role.lambda_exec.arn
  filename      = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  environment {
    variables = {
      SLACK_WEBHOOK_URL = var.slack_webhook_url
    }
  }
}

data "archive_file" "lambda_zip" {
  type        = "zip"
  output_path = "${path.module}/slack_notifier.zip"
  source_file = "${path.module}/../lambda/functions/slack-notifier.js"
}

resource "aws_iam_role" "lambda_exec" {
  name = "${module.label.id}-slack-lambda-exec"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
