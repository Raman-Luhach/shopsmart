terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Get current AWS account ID for unique naming
data "aws_caller_identity" "current" {}

# ============================================================
# S3 BUCKET (Rubric: unique name, versioning, encryption, no public access)
# ============================================================
resource "aws_s3_bucket" "app_bucket" {
  bucket = "shopsmart-artifacts-${data.aws_caller_identity.current.account_id}"

  tags = {
    Name    = "shopsmart-bucket"
    Project = "shopsmart"
  }
}

resource "aws_s3_bucket_versioning" "app_bucket_versioning" {
  bucket = aws_s3_bucket.app_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "app_bucket_encryption" {
  bucket = aws_s3_bucket.app_bucket.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "app_bucket_public_access" {
  bucket                  = aws_s3_bucket.app_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ============================================================
# ECR REPOSITORIES
# ============================================================
resource "aws_ecr_repository" "backend" {
  name                 = "shopsmart-backend"
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "frontend" {
  name                 = "shopsmart-frontend"
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = true
  }
}

# ============================================================
# NETWORKING (subnets passed via variable, no EC2 describe needed)
# ============================================================
resource "aws_security_group" "ecs_sg" {
  name_prefix = "shopsmart-ecs-"
  description = "Allow inbound traffic to ECS tasks"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5001
    to_port     = 5001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  lifecycle {
    create_before_destroy = true
  }
}

# ============================================================
# ECS CLUSTER
# ============================================================
resource "aws_ecs_cluster" "shopsmart" {
  name = "shopsmart-cluster"
}

# ============================================================
# IAM ROLE (use pre-existing LabRole from AWS Academy)
# ============================================================
locals {
  lab_role_arn = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
}

# ============================================================
# CLOUDWATCH LOG GROUP
# ============================================================
resource "aws_cloudwatch_log_group" "ecs_logs" {
  name              = "/ecs/shopsmart"
  retention_in_days = 7
}

# ============================================================
# ECS TASK DEFINITION (both frontend and backend containers)
# ============================================================
resource "aws_ecs_task_definition" "shopsmart" {
  family                   = "shopsmart"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = local.lab_role_arn
  task_role_arn            = local.lab_role_arn

  container_definitions = jsonencode([
    {
      name      = "shopsmart-backend"
      image     = "${aws_ecr_repository.backend.repository_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 5001
          hostPort      = 5001
          protocol      = "tcp"
        }
      ]
      environment = [
        {
          name  = "PORT"
          value = "5001"
        },
        {
          name  = "MONGO_URI"
          value = var.mongo_uri
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/shopsmart"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "backend"
        }
      }
      healthCheck = {
        command     = ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:5001/api/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 10
      }
    },
    {
      name      = "shopsmart-frontend"
      image     = "${aws_ecr_repository.frontend.repository_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
          protocol      = "tcp"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/shopsmart"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "frontend"
        }
      }
      healthCheck = {
        command     = ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 5
      }
    }
  ])
}

# ============================================================
# ECS SERVICE (Fargate)
# ============================================================
resource "aws_ecs_service" "shopsmart" {
  name            = "shopsmart-service"
  cluster         = aws_ecs_cluster.shopsmart.id
  task_definition = aws_ecs_task_definition.shopsmart.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }

  force_new_deployment = true
}
