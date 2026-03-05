module "label" {
    source = "cloudposse/label/null"
    version = "0.25.0"
    context = module.this.context
    name = var.table_name
}

resource "aws_dynamodb_table" "this" {
  name = module.label.id
  billing_mode = "PAY_PER_REQUEST"
  hash_key = var.hash_key

  attribute {
    name = var.hash_key
    type = "S"
  }
}