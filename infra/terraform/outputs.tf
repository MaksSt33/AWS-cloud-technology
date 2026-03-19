output "api_invoke_url" {
  description = "Base invoke URL for the API Gateway stage"
  value       = module.api_gateway.invoke_url
}

output "cloudfront_url" {
  description = "CloudFront HTTPS URL for the React frontend"
  value       = module.s3_frontend.cloudfront_url
}