module "label" {
  source  = "cloudposse/label/null"
  version = "0.25.0"
  context = module.this.context
  name    = var.function_name
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "this" {
  name               = "${module.label.id}-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
  tags               = module.label.tags
}

data "aws_iam_policy_document" "lambda_policy" {
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["arn:aws:logs:*:*:*"]
  }

  statement {
    effect = "Allow"
    actions = [var.dynamodb_action]
    resources = [var.table_arn]
  }
}

resource "aws_iam_policy" "this" {
  name   = "${module.label.id}-policy"
  policy = data.aws_iam_policy_document.lambda_policy.json
  tags   = module.label.tags
}

resource "aws_iam_role_policy_attachment" "this" {
  role       = aws_iam_role.this.name
  policy_arn = aws_iam_policy.this.arn
}

data "archive_file" "this" {
  type        = "zip"
  source_file = var.source_file
  output_path = "${path.root}/.terraform/archives/${var.function_name}.zip"
}

resource "aws_lambda_function" "this" {
  function_name    = module.label.id
  role             = aws_iam_role.this.arn
  handler          = "${replace(basename(var.source_file), "/\\.(js|mjs)$/", "")}.handler"
  
  runtime          = "nodejs22.x" 
  
  filename         = data.archive_file.this.output_path
  source_code_hash = data.archive_file.this.output_base64sha256

  environment {
    variables = {
      TABLE_NAME = var.table_name
    }
  }

  tags = module.label.tags
}