pipeline {
    agent any
    tools {
        nodejs 'NodeJS'  // Référence l'outil configuré ; installe auto si besoin
    }
    environment {
        MONGODB_URI = credentials('mongodb-uri')
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'npm install'
                    sh 'npm test'  // Si tests ajoutés
                }
            }
        }
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
        stage('Docker Build (Optionnel)') {
            when { branch 'main' }
            steps {
                script {
                    docker.build("mon-todo-app:${env.BUILD_ID}")
                }
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'frontend/build/**', allowEmptyArchive: true
            cleanWs()
        }
        success {
            echo 'Build réussi ! App prête pour déploiement.'
        }
        failure {
            echo 'Build échoué. Vérifiez les logs.'
        }
    }
}