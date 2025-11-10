pipeline {
    agent any

    environment {
        IMAGE_BACKEND = 'myapp-backend'
        IMAGE_FRONTEND = 'myapp-frontend'
    }

    stages {

        stage('Checkout SCM') {
            steps {
                checkout scm
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
                sh 'docker-compose up -d --build'
            }
        }

    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Something went wrong in the pipeline!'
        }
    }
}
