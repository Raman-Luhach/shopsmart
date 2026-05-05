variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}


variable "mongo_uri" {
  description = "MongoDB connection URI"
  type        = string
  sensitive   = true
  default     = ""
}
