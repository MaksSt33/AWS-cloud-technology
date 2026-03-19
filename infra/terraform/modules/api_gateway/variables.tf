variable "lambda_invoke_arns" {
  description = "Map of Lambda function name to invoke ARN"
  type        = map(string)
}

variable "lambda_function_names" {
  description = "Map of Lambda function name to function name"
  type        = map(string)
}