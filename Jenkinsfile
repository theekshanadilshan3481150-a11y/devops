pipeline {
    agent any

    environment {
        IMAGE_BACKEND = "myapp-backend"
        IMAGE_FRONTEND = "myapp-frontend"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/theekshanadilshan3481150-a11y/devops.git'
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
                sh 'docker build -t $IMAGE_FRONTEND -f frontend/Dockerfile frontend'
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully!"
        }
        failure {
            echo "❌ Something went wrong in the pipeline!"
        }
    }
}
