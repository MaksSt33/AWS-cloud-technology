module "label" {
  source  = "cloudposse/label/null"
  version = "0.25.0"
  context = module.this.context
  name    = "api"
}

# REST API Gateway resource — entry point for all course management endpoints.
resource "aws_api_gateway_rest_api" "this" {
  name        = module.label.id
  description = "API for courses management"
  tags        = module.label.tags
}

resource "aws_api_gateway_resource" "authors" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "authors"
}

resource "aws_api_gateway_resource" "courses" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "courses"
}

resource "aws_api_gateway_resource" "course_id" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.courses.id
  path_part   = "{id}"
}

# Deployment snapshot of all API Gateway methods and integrations; must be recreated on any route change.
resource "aws_api_gateway_deployment" "this" {
  rest_api_id = aws_api_gateway_rest_api.this.id

  # Forces a new deployment whenever any resource, method, or integration changes,
  # ensuring the stage always reflects the latest configuration.
  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.authors.id,
      aws_api_gateway_resource.courses.id,
      aws_api_gateway_resource.course_id.id,
      aws_api_gateway_method.get_authors.id,
      aws_api_gateway_method.get_courses.id,
      aws_api_gateway_method.post_courses.id,
      aws_api_gateway_method.get_course_id.id,
      aws_api_gateway_method.put_course_id.id,
      aws_api_gateway_method.delete_course_id.id,
      aws_api_gateway_method.options_authors.id,
      aws_api_gateway_method.options_courses.id,
      aws_api_gateway_method.options_course_id.id,
      aws_api_gateway_integration.get_authors,
      aws_api_gateway_integration.get_courses,
      aws_api_gateway_integration.post_courses,
      aws_api_gateway_integration.get_course_id,
      aws_api_gateway_integration.put_course_id,
      aws_api_gateway_integration.delete_course_id,
    ]))
  }
  # Ensures zero-downtime replacement: new deployment is created before the old one is destroyed.
  lifecycle {
    create_before_destroy = true
  }
  # Explicit dependencies ensure all integrations are ready before deployment is created.
  depends_on = [
    aws_api_gateway_integration.get_authors,
    aws_api_gateway_integration.get_courses,
    aws_api_gateway_integration.post_courses,
    aws_api_gateway_integration.get_course_id,
    aws_api_gateway_integration.put_course_id,
    aws_api_gateway_integration.delete_course_id,
    aws_api_gateway_integration.options_authors,
    aws_api_gateway_integration.options_courses,
    aws_api_gateway_integration.options_course_id,
  ]
}

# Creating stage to deploy the API and make it accessible.

resource "aws_api_gateway_stage" "this" {
  deployment_id = aws_api_gateway_deployment.this.id
  rest_api_id   = aws_api_gateway_rest_api.this.id
  stage_name    = "v1"
  tags          = module.label.tags
}