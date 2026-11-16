pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Validation') {
            steps {
                dir('backend') {
                    bat 'npm ci'
                    bat 'node --check src/server.js'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    bat 'npm ci'
                    bat 'npm run build'
                }
            }
        }
    }

    post {
        success {
            echo 'MiniOps AI pipeline completed successfully!'
        }
        failure {
            echo 'MiniOps AI pipeline failed. Check the console output.'
        }
    }
}
