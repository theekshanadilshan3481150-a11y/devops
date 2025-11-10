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

stage('Build Frontend Docker') {
    steps {
        dir('frontend') {
            sh 'docker build -t myapp-frontend -f Dockerfile .'
        }
    }
}

stage('Build Frontend App') {
    steps {
        dir('frontend') {
            sh 'docker build -t myapp-frontend -f Dockerfile .'
        }
    }
}

        stage('Deploy with Docker Compose') {
            steps {
                sh 'docker compose up -d --build'
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
