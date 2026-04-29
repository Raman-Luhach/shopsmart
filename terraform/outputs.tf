output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.app_bucket.id
}

output "ecr_repository_url" {
  description = "URL of the ECR repository"
  value       = aws_ecr_repository.shopsmart.repository_url
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.shopsmart.name
}

output "ecs_service_name" {
  description = "Name of the ECS service"
  value       = aws_ecs_service.shopsmart.name
}
