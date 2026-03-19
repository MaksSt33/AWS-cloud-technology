module "label" {
  source  = "cloudposse/label/null"
  version = "0.25.0"
  context = module.this.context
  name    = "frontend"
}

# S3 bucket for static website hosting
resource "aws_s3_bucket" "this" {
  bucket        = "${module.label.id}-app-bucket"
  force_destroy = true
  tags          = module.label.tags
}

resource "aws_s3_bucket_website_configuration" "this" {
  bucket = aws_s3_bucket.this.id

  index_document { suffix = "index.html" }
  error_document { key    = "index.html" }
}

# Make it publicly accessible
resource "aws_s3_bucket_public_access_block" "this" {
  bucket = aws_s3_bucket.this.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Allow everybody to read static files (index.html, js, css, etc.)
resource "aws_s3_bucket_policy" "this" {
  bucket = aws_s3_bucket.this.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "PublicReadGetObject"
      Effect    = "Allow"
      Principal = "*"
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.this.arn}/*"
    }]
  })

  depends_on = [aws_s3_bucket_public_access_block.this]
}