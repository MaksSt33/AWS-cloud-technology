output "invoke_url" {
  description = "Base invoke URL for the deployed API Gateway stage"
  value       = aws_api_gateway_stage.this.invoke_url
}