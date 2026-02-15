pipeline {
  agent any

  environment {
    AWS_REGION   = 'us-east-1'
    AWS_ACCOUNT  = '084576276696'
    ECR_REGISTRY = "${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com"

    FRONTEND_ECR = "${ECR_REGISTRY}/myapp-frontend"
    BACKEND_ECR  = "${ECR_REGISTRY}/myapp-backend"

    EC2_HOST = "16.16.198.121"
  }

  stages {

    stage('Build frontend') {
      steps {
        dir('my-react-app') {
          sh 'npm ci'
          sh 'npm run build'
        }
      }
    }

    stage('Build Docker images') {
      steps {
        sh 'docker build -t myapp-frontend:latest ./my-react-app'
        sh 'docker build -t myapp-backend:latest  ./myApp/backend'
      }
    }

    stage('Login to ECR + Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'aws-creds',
          usernameVariable: 'AKIARHMJDSDMELSZI5XQ',
          passwordVariable: 'w892XYwXsnCavc8g80YboQJZ6Ue6eJxGxaFqhel7'
        )]) {
          sh """
            set -e
            aws sts get-caller-identity
            aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

            docker tag myapp-frontend:latest ${FRONTEND_ECR}:latest
            docker tag myapp-backend:latest  ${BACKEND_ECR}:latest

            docker push ${FRONTEND_ECR}:latest
            docker push ${BACKEND_ECR}:latest
          """
        }
      }
    }

    stage('Deploy on EC2') {
      steps {
        // OPTION 1: no sshagent plugin needed (uses ssh key credential as a file)
        withCredentials([sshUserPrivateKey(credentialsId: 'ec2-key', keyFileVariable: 'KEYFILE', usernameVariable: 'SSHUSER')]) {
          sh """
            set -e
            chmod 600 "$KEYFILE"
            ssh -i "$KEYFILE" -o StrictHostKeyChecking=no ${SSHUSER}@${EC2_HOST} '
              cd ~/myapp &&
              docker compose pull &&
              docker compose up -d
            '
          """
        }
      }
    }
  }

  post {
    failure {
      echo "❌ Build failed. Check the first ERROR line in console output."
    }
    success {
      echo "✅ Pipeline success: images pushed + EC2 updated!"
    }
  }
}
