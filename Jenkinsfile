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
        stage('Docker Build') { 
    when { branch 'main' }
    steps {
        script {
            def app = docker.build("ramzihaj/todo-app:${env.BUILD_ID}")  // Tag avec votre username
            // Push vers Docker Hub (optionnel)
            docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-creds') {
                app.push("${env.BUILD_ID}")
                app.push('latest')
            }
        }
    }
}
post {
    always {
        // Cleanup image locale
        sh 'docker rmi ramzihaj/todo-app:${env.BUILD_ID} || true'
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