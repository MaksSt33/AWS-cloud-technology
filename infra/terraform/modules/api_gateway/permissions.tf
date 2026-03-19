# Give permissions to every lambda function to be invoked by API Gateway
resource "aws_lambda_permission" "apigw" {
  for_each = var.lambda_function_names

  statement_id  = "AllowAPIGatewayInvoke-${each.key}"
  action        = "lambda:InvokeFunction"
  function_name = each.value
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.this.execution_arn}/*/*"
}