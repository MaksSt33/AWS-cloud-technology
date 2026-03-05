variable "function_name" {
    description = "Name of the Lambda function"
     type = string 
}

variable "table_arn" { 
    description = "ARN of the DynamoDB table"
    type = string
}

variable "table_name" { 
    description = "Name of the DynamoDB table"
    type = string 
}

variable "dynamodb_action" { 
    description = "DynamoDB action(s) allowed for the Lambda function"
    type = string 
}

variable "source_file" { 
    description = "Path to the source code file for the Lambda function"
    type = string 
}