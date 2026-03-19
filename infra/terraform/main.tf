provider "aws" {}

module "base_label" {
  source    = "cloudposse/label/null"
  version   = "0.25.0"
  namespace = "uni"
}

# Creating table for courses
module "dynamodb_courses" {
  source     = "./modules/dynamodb"
  table_name = "courses"
  hash_key   = "id"
  context    = module.base_label.context
}

# Creating table for authors
module "dynamodb_authors" {
  source     = "./modules/dynamodb"
  table_name = "authors"
  hash_key   = "id"
  context    = module.base_label.context
}

# List of Lambda functions with their respective DynamoDB permissions
locals {
  lambdas = {
    "get-all-authors" = {
      table_arn  = module.dynamodb_authors.table_arn
      table_name = module.dynamodb_authors.table_name
      action     = "dynamodb:Scan"
    }
    "get-all-courses" = {
      table_arn  = module.dynamodb_courses.table_arn
      table_name = module.dynamodb_courses.table_name
      action     = "dynamodb:Scan"
    }
    "get-course" = {
      table_arn  = module.dynamodb_courses.table_arn
      table_name = module.dynamodb_courses.table_name
      action     = "dynamodb:GetItem"
    }
    "save-course" = {
      table_arn  = module.dynamodb_courses.table_arn
      table_name = module.dynamodb_courses.table_name
      action     = "dynamodb:PutItem"
    }
    "update-course" = {
      table_arn  = module.dynamodb_courses.table_arn
      table_name = module.dynamodb_courses.table_name
      action     = "dynamodb:PutItem"
    }
    "delete-course" = {
      table_arn  = module.dynamodb_courses.table_arn
      table_name = module.dynamodb_courses.table_name
      action     = "dynamodb:DeleteItem"
    }
  }
}

# Creating Lambda functions with appropriate permissions
module "lambda_functions" {
  source   = "./modules/lambda"
  for_each = local.lambdas

  function_name   = each.key
  table_arn       = each.value.table_arn
  table_name      = each.value.table_name
  dynamodb_action = each.value.action
  source_file     = "${path.root}/modules/lambda/functions/${each.key}.mjs"
  context         = module.base_label.context
}

module "api_gateway" {
  source = "./modules/api_gateway"

  context = module.base_label.context

  lambda_invoke_arns = {
    for k, v in module.lambda_functions : k => v.invoke_arn
  }

  lambda_function_names = {
    for k, v in module.lambda_functions : k => v.function_name
  }
}

# Setting up S3 bucket for React frontend
module "s3_frontend" {
  source = "./modules/s3-frontend"

  context       = module.base_label.context
  api_url       = module.api_gateway.invoke_url
  react_app_dir = "${path.root}/../../react-app-frontend"
}

module "monitoring" {
  source = "./modules/monitoring"

  context     = module.base_label.context
  alert_email = "maksym.stetsiv.ri.2024@lpnu.ua" 
  
  slack_webhook_url = var.slack_webhook_url
  lambda_function_names = {
    for k, v in module.lambda_functions : k => v.function_name
  }
}
