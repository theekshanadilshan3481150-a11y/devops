pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        ECR_REGISTRY = '084576276696.dkr.ecr.us-east-1.amazonaws.com'
        FRONTEND_IMAGE = 'myapp-frontend'
        BACKEND_IMAGE = 'myapp-backend'
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
                sh 'docker build -t myapp-backend:latest ./myApp/backend'
            }
        }

        stage('Login to ECR + Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'aws-creds',
                    usernameVariable: 'AKIARHMJDSDMELSZI5XQ',
                    passwordVariable: 'w892XYwXsnCavc8g80YboQJZ6Ue6eJxGxaFqhel7'
                )]) {

                    sh '''
                        set -e
                        export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
                        export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY

                        aws sts get-caller-identity

                        aws ecr get-login-password --region $AWS_REGION \
                        | docker login --username AWS --password-stdin $ECR_REGISTRY

                        docker tag myapp-frontend:latest $ECR_REGISTRY/$FRONTEND_IMAGE:latest
                        docker tag myapp-backend:latest $ECR_REGISTRY/$BACKEND_IMAGE:latest

                        docker push $ECR_REGISTRY/$FRONTEND_IMAGE:latest
                        docker push $ECR_REGISTRY/$BACKEND_IMAGE:latest
                    '''
                }
            }
        }

        stage('Deploy on EC2') {
            steps {
                sshagent(['ec2-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@16.16.198.121 '
                            cd ~/myapp &&
                            docker compose pull &&
                            docker compose up -d
                        '
                    '''
                }
            }
        }
    }

    post {
        failure {
            echo "❌ Build failed."
        }
    }
}
