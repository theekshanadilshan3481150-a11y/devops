pipeline {
    agent any

    environment {
        IMAGE_BACKEND = "myapp-backend"
        IMAGE_FRONTEND = "myapp-frontend"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/theekshanadilshan3481150-a11y/devops.git'
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'docker build -t $IMAGE_BACKEND .'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'docker build -t $IMAGE_FRONTEND .'
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh 'docker compose down || true'
                sh 'docker compose up -d'
            }
        }
    }

    post {
        success {
            echo '🎉 Deployment Successful!'
        }
        failure {
            echo '❌ Something went wrong!'
        }
    }
}
