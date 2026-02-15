pipeline {
  agent any

  environment {
    AWS_REGION     = "us-east-1"
    AWS_ACCOUNT_ID = "084576276696"
    ECR_REGISTRY   = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

    FRONTEND_REPO  = "${ECR_REGISTRY}/myapp-frontend"
    BACKEND_REPO   = "${ECR_REGISTRY}/myapp-backend"

    EC2_HOST       = "16.16.198.121"
    EC2_USER       = "ubuntu"
    DEPLOY_DIR     = "~/myapp"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    // ✅ Frontend is inside my-react-app/
    stage('Build frontend') {
      steps {
        dir('my-react-app') {
          sh 'bash -lc "npm ci"'
          sh 'bash -lc "npm run build"'
        }
      }
    }

    // ✅ Build Docker images from correct folders
stage('Build Docker images') {
  steps {
    sh 'bash -lc "docker build -t myapp-frontend ./my-react-app"'
   sh 'bash -lc "docker build -t myapp-backend ./myApp/backend"'
  }
}

    stage('Login to ECR + Push') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'aws-creds',
          usernameVariable: 'AWS_ACCESS_KEY_ID',
          passwordVariable: 'AWS_SECRET_ACCESS_KEY'
        )]) {
          sh '''
            aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

            docker tag myapp-frontend:latest ${FRONTEND_REPO}:latest
            docker tag myapp-backend:latest  ${BACKEND_REPO}:latest

            docker push ${FRONTEND_REPO}:latest
            docker push ${BACKEND_REPO}:latest
          '''
        }
      }
    }

    stage('Deploy on EC2') {
      steps {
        sshagent(credentials: ['ec2-ssh']) {
          sh '''
            ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
              cd ${DEPLOY_DIR}
              docker-compose pull
              docker-compose up -d
            '
          '''
        }
      }
    }
  }
}
