pipeline {
    agent {
        docker {
            image 'node:10.16.3'
            args '-p 3000:3000'
        }
    }
    stages {
        stage('Build') {
            steps {
                sh 'pwd'
                sh 'ls'
                sh 'npm install'
            }
        }
    }
}