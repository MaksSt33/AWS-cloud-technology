variable "api_url" {
  description = "API Gateway invoke URL injected into the React build as REACT_APP_API_URL"
  type        = string
}

variable "react_app_dir" {
  description = "Absolute path to the React application directory (where package.json lives)"
  type        = string
}