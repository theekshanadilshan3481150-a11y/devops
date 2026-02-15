pipeline {
  agent any

  environment {
    AWS_REGION   = "us-east-1"
    AWS_ACCOUNT  = "084576276696"
    ECR_REGISTRY = "${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com"

    FRONTEND_ECR = "${ECR_REGISTRY}/myapp-frontend"
    BACKEND_ECR  = "${ECR_REGISTRY}/myapp-backend"

    EC2_HOST     = "16.16.198.121"
    EC2_USER     = "ubuntu"
    DEPLOY_DIR   = "~/myapp"
  }

  options {
    timestamps()
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build frontend') {
      steps {
        dir('my-react-app') {
          sh 'bash -lc "npm ci"'
          sh 'bash -lc "npm run build"'
        }
      }
    }

    stage('Build Docker images') {
      steps {
        sh 'bash -lc "docker build -t myapp-frontend:latest ./my-react-app"'
        sh 'bash -lc "docker build -t myapp-backend:latest ./myApp/backend"'
      }
    }

    stage('Login to ECR + Push') {
      steps {
        withCredentials([[
          $class: 'AmazonWebServicesCredentialsBinding',
          credentialsId: 'aws-creds'
        ]]) {
          sh '''
            set -e

            aws --version
            aws ecr get-login-password --region ${AWS_REGION} | \
              docker login --username AWS --password-stdin ${ECR_REGISTRY}

            docker tag myapp-frontend:latest ${FRONTEND_ECR}:latest
            docker tag myapp-backend:latest  ${BACKEND_ECR}:latest

            docker push ${FRONTEND_ECR}:latest
            docker push ${BACKEND_ECR}:latest
          '''
        }
      }
    }

    stage('Deploy on EC2') {
      steps {
        // Requires "SSH Agent" plugin + credential id ec2-key
        sshagent(['ec2-key']) {
          sh '''
            set -e

            ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} "
              set -e
              cd ${DEPLOY_DIR}

              # Use docker compose if available, otherwise fallback to docker-compose
              if docker compose version >/dev/null 2>&1; then
                docker compose pull
                docker compose up -d
              else
                docker-compose pull
                docker-compose up -d
              fi

              docker ps
            "
          '''
        }
      }
    }
  }

  post {
    success {
      echo "✅ Deploy complete: frontend http://${EC2_HOST}:3000 | backend http://${EC2_HOST}:4000"
    }
    failure {
      echo "❌ Build failed. Check console output for the first ERROR line."
    }
  }
}
