pipeline {
    agent any

    environment {
        IMAGE_BACKEND = "myapp-backend"
        IMAGE_FRONTEND = "myapp-frontend"
    }

    stages {

        stage('Checkout Code') {
            steps {
                // Checkout the repo
                git branch: 'main',
                    url: 'https://github.com/theekshanadilshan3481150-a11y/devops.git'
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    // Build backend Docker image
                    sh 'docker build -t $IMAGE_BACKEND .'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                // Explicit absolute path to frontend Dockerfile
                sh '''
                cd $WORKSPACE/frontend
                docker build -t $IMAGE_FRONTEND .
                '''
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                // Make sure docker-compose.yaml is at repo root
                sh '''
                cd $WORKSPACE
                docker-compose up -d
                '''
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
