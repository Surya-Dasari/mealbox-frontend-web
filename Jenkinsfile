pipeline {
  agent any

  environment {
    IMAGE_NAME = "suryadasari31/mealbox-frontend"
    IMAGE_TAG  = "${BUILD_NUMBER}"
    OC_PROJECT = "suryadasari31-dev"
  }

  stages {

    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Docker Build') {
      steps {
        sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
      }
    }

    stage('Push Image') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub',
          usernameVariable: 'USER',
          passwordVariable: 'PASS'
        )]) {
          sh '''
echo "$PASS" | docker login -u "$USER" --password-stdin
docker push ${IMAGE_NAME}:${IMAGE_TAG}
'''
        }
      }
    }

    stage('Deploy Frontend') {
      steps {
        sh '''
git clone https://github.com/Surya-Dasari/mealbox-platform.git

helm upgrade --install frontend-web \
  mealbox-platform/helm/mealbox-backend-service \
  -f mealbox-platform/helm/mealbox-backend-service/values/values-frontend.yaml \
  --set image.repository=${IMAGE_NAME} \
  --set image.tag=${IMAGE_TAG}
'''
      }
    }
  }
}

