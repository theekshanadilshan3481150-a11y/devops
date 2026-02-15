pipeline {
  agent any

  environment {
    AWS_REGION = 'us-east-1'
    ECR_REGISTRY = '084576276696.dkr.ecr.us-east-1.amazonaws.com'
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Frontend') {
      steps {
        dir('my-react-app') {
          sh 'npm ci'
          sh 'npm run build'
        }
      }
    }

    stage('Build Docker Images') {
      steps {
        sh 'docker build -t myapp-frontend:latest ./my-react-app'
        sh 'docker build -t myapp-backend:latest ./myApp/backend'
      }
    }

    stage('Login to ECR + Push') {
      steps {
        withCredentials([
          string(credentialsId: 'aws-access-key-id', variable: 'AWS_ACCESS_KEY_ID'),
          string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY')
        ]) {
          sh '''
            set -e

            aws sts get-caller-identity

            aws ecr get-login-password --region $AWS_REGION | \
            docker login --username AWS --password-stdin $ECR_REGISTRY

            docker tag myapp-frontend:latest $ECR_REGISTRY/myapp-frontend:latest
            docker tag myapp-backend:latest $ECR_REGISTRY/myapp-backend:latest

            docker push $ECR_REGISTRY/myapp-frontend:latest
            docker push $ECR_REGISTRY/myapp-backend:latest
          '''
        }
      }
    }

  }

  post {
    success {
      echo '✅ Build and Push Successful!'
    }
    failure {
      echo '❌ Build failed. Check console output.'
    }
  }
}
