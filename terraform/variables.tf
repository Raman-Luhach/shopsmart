variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}


variable "subnet_ids" {
  description = "List of subnet IDs for ECS tasks"
  type        = list(string)
}

variable "mongo_uri" {
  description = "MongoDB connection URI"
  type        = string
  sensitive   = true
  default     = ""
}
