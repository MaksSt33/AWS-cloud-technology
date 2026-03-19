output "cloudfront_url" {
  description = "HTTPS URL of the CloudFront distribution (use this to access the app)"
  value       = "https://${aws_cloudfront_distribution.this.domain_name}"
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.this.id
}

output "s3_bucket_id" {
  description = "Name of the S3 bucket hosting the static files"
  value       = aws_s3_bucket.this.id
}