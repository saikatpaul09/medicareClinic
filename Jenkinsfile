pipeline {
    agent any

    options {
        timestamps()
    }

    stages {

        stage('Update Code') {
            steps {
                dir('/workspace') {
                    sh '''
                        git pull origin main
                    '''
                }
            }
        }

        stage('Validate Docker Compose') {
            steps {
                dir('/workspace') {
                    sh 'docker compose config'
                }
            }
        }

        stage('Build & Deploy') {
            steps {
                dir('/workspace') {
                    sh '''
                        docker compose up -d --build
                    '''
                }
            }
        }

        stage('Cleanup') {
            steps {
                sh 'docker image prune -f'
            }
        }
    }

    post {
        success {
            echo '✅ Deployment Successful'
        }

        failure {
            echo '❌ Deployment Failed'
        }
    }
}
