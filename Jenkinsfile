pipeline {
    agent any
    environment {
        // Vars pour MongoDB (utilisez des creds Jenkins pour prod)
        MONGODB_URI = credentials('mongodb-uri')  // Ajoutez ça dans Jenkins Credentials
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
                    sh 'npm test'  // Ajoutez des tests si pas déjà (voir Étape 3)
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
            when { branch 'main' }  // Seulement sur main pour éviter spams
            steps {
                script {
                    // Multi-stage Docker : backend + frontend statique servi par Nginx
                    docker.build("mon-todo-app:${env.BUILD_ID}")
                }
                // Push vers Docker Hub si creds configurés
                // withDockerRegistry([credentialsId: 'docker-hub', url: '']) {
                //     sh "docker push mon-todo-app:${env.BUILD_ID}"
                // }
            }
        }
    }
    post {
        always {
            // Archive artifacts (build frontend)
            archiveArtifacts artifacts: 'frontend/build/**', allowEmptyArchive: true
            // Notifications ou cleanup
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