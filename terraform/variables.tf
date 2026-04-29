variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "s3_bucket_name" {
  description = "Unique S3 bucket name"
  type        = string
  default     = "shopsmart-artifacts-rl-2026"
}

variable "mongo_uri" {
  description = "MongoDB connection URI"
  type        = string
  sensitive   = true
  default     = ""
}
