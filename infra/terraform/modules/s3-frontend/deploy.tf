# Look up the region that Terraform is already authenticated to. This is used to pass AWS_DEFAULT_REGION to 
# local-exec so that the aws CLI calls work regardless of the users shell profile setup (e.g. with aws-vault, 
# only the credential env-vars are injected; the region may not be set at all in the child process).
data "aws_region" "current" {}

resource "null_resource" "build_and_deploy" {
  triggers = {
    api_url     = var.api_url
    # Rebuild and redeploy the React app whenever any source file changes. This is a bit stupid, but it works.
    source_hash = sha256(join("", [
      for f in sort(fileset(var.react_app_dir, "{src,public}/**/*")) :
      filesha256("${var.react_app_dir}/${f}")
    ]))
  }

  provisioner "local-exec" {
    working_dir = var.react_app_dir

    # aws-vault injects AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_SESSION_TOKEN into the environment before 
    # Terraform runs. local-exec inherits that environment, so no extra aws-vault wrapping is needed. We only need 
    # to make sure the region is also available, which Terraform knows but aws-vault does not always forward.
    environment = {
      AWS_DEFAULT_REGION = data.aws_region.current.region
      REACT_APP_API_URL  = var.api_url
    }

    command = <<-EOT
      set -e
      npm ci --legacy-peer-deps=true
      npm run build
      aws s3 sync build/ s3://${aws_s3_bucket.this.id} \
        --region ${data.aws_region.current.region} \
        --delete
      aws cloudfront create-invalidation \
        --region ${data.aws_region.current.region} \
        --distribution-id ${aws_cloudfront_distribution.this.id} \
        --paths "/*"
    EOT
  }

  depends_on = [
    aws_s3_bucket_policy.this,
    aws_cloudfront_distribution.this,
  ]
}