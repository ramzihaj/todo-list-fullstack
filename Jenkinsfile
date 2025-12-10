pipeline {
    agent any
    tools {
        nodejs 'NodeJS'  // Votre outil Node configuré
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
                    sh 'npm test'
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
        stage('Docker Build') {
            when { branch 'main' }
            steps {
                script {
                    def app = docker.build("ramzihaj2001/todo-app:${env.BUILD_ID}")  // Remplacez par votre Docker Hub username
                    
                }
            }
        }
    }
    post {
    always {
        archiveArtifacts artifacts: 'frontend/build/**', allowEmptyArchive: true
        cleanWs()
       
        sh "docker rmi ramzihaj/todo-app:${env.BUILD_ID} || true"
    }
    success {
        echo 'Build réussi ! App prête pour déploiement.'
    }
    failure {
        echo 'Build échoué. Vérifiez les logs.'
    }
}
}