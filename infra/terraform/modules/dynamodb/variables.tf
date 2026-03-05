variable "table_name" {
    description = "Name of the DynamoDB table"
    type = string
}

variable "hash_key" {
    description = "Primary key of the table"
    type = string
    default = "id"
}