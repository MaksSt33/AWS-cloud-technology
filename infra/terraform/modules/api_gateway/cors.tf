# Define CORS settings for API Gateway resources
locals {
  cors_headers = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  cors_response_params = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

# Create OPTIONS method for /authors resource
resource "aws_api_gateway_method" "options_authors" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.authors.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options_authors" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.authors.id
  http_method = aws_api_gateway_method.options_authors.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = jsonencode({ statusCode = 200 })
  }
}

resource "aws_api_gateway_method_response" "options_authors_200" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.authors.id
  http_method = aws_api_gateway_method.options_authors.http_method
  status_code = "200"

  response_parameters = local.cors_response_params
}

resource "aws_api_gateway_integration_response" "options_authors_200" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.authors.id
  http_method = aws_api_gateway_method.options_authors.http_method
  status_code = aws_api_gateway_method_response.options_authors_200.status_code

  response_parameters = merge(local.cors_headers, {
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS'"
  })

  depends_on = [aws_api_gateway_integration.options_authors]
}

# Create OPTIONS method for /courses resource
resource "aws_api_gateway_method" "options_courses" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.courses.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options_courses" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.courses.id
  http_method = aws_api_gateway_method.options_courses.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = jsonencode({ statusCode = 200 })
  }
}

resource "aws_api_gateway_method_response" "options_courses_200" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.courses.id
  http_method = aws_api_gateway_method.options_courses.http_method
  status_code = "200"

  response_parameters = local.cors_response_params
}

resource "aws_api_gateway_integration_response" "options_courses_200" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.courses.id
  http_method = aws_api_gateway_method.options_courses.http_method
  status_code = aws_api_gateway_method_response.options_courses_200.status_code

  response_parameters = merge(local.cors_headers, {
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,OPTIONS'"
  })

  depends_on = [aws_api_gateway_integration.options_courses]
}

# Create OPTIONS method for /courses/{id} resource
resource "aws_api_gateway_method" "options_course_id" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.course_id.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options_course_id" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.course_id.id
  http_method = aws_api_gateway_method.options_course_id.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = jsonencode({ statusCode = 200 })
  }
}

resource "aws_api_gateway_method_response" "options_course_id_200" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.course_id.id
  http_method = aws_api_gateway_method.options_course_id.http_method
  status_code = "200"

  response_parameters = local.cors_response_params
}

resource "aws_api_gateway_integration_response" "options_course_id_200" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.course_id.id
  http_method = aws_api_gateway_method.options_course_id.http_method
  status_code = aws_api_gateway_method_response.options_course_id_200.status_code

  response_parameters = merge(local.cors_headers, {
    "method.response.header.Access-Control-Allow-Methods" = "'GET,PUT,DELETE,OPTIONS'"
  })

  depends_on = [aws_api_gateway_integration.options_course_id]
}