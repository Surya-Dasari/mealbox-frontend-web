pipeline {
    agent any

    environment {
        IMAGE_NAME = "suryadasari31/mealbox-frontend-web"
        IMAGE_TAG  = "${BUILD_NUMBER}"

        OC_API     = "https://api.rm2.thpm.p1.openshiftapps.com:6443"
        OC_PROJECT = "suryadasari31-dev"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Build') {
            when { branch 'develop' }
            steps {
                sh '''
set -e
docker build --no-cache \
  -t ${IMAGE_NAME}:${IMAGE_TAG} .
'''
            }
        }

        stage('Trivy Image Scan') {
            when { branch 'develop' }
            steps {
                sh '''
trivy image \
  --severity HIGH,CRITICAL \
  --exit-code 0 \
  ${IMAGE_NAME}:${IMAGE_TAG}
'''
            }
        }

        stage('Push Image to Docker Hub') {
            when { branch 'develop' }
            steps {
                withVault([
                    vaultSecrets: [[
                        path: 'secret/mealbox/dockerhub',
                        secretValues: [
                            [envVar: 'DOCKER_USER', vaultKey: 'username'],
                            [envVar: 'DOCKER_PASS', vaultKey: 'password']
                        ]
                    ]]
                ]) {
                    sh '''
set -e
echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
docker push ${IMAGE_NAME}:${IMAGE_TAG}
'''
                }
            }
        }

        stage('Deploy Frontend to OpenShift (Helm)') {
            when { branch 'develop' }
            steps {
                withCredentials([
                    string(credentialsId: 'openshift-token', variable: 'OC_TOKEN')
                ]) {
                    sh '''
set -e

echo "Cloning MealBox platform repo (Helm charts)..."
rm -rf mealbox-platform || true
git clone https://github.com/Surya-Dasari/mealbox-platform.git

echo "Logging into OpenShift..."
/usr/bin/oc login ${OC_API} \
  --token=${OC_TOKEN} \
  --insecure-skip-tls-verify=true

/usr/bin/oc project ${OC_PROJECT}

echo "Deploying frontend-web using Helm..."
/usr/local/bin/helm upgrade --install frontend-web \
  mealbox-platform/helm/mealbox-backend-service \
  -f mealbox-platform/helm/mealbox-backend-service/values/values-frontend.yaml \
  --set image.repository=${IMAGE_NAME} \
  --set image.tag=${IMAGE_TAG}

echo "Frontend Helm deployment finished"
'''
                }
            }
        }
    }

    post {
        success {
            echo "MealBox Frontend: Pipeline SUCCESS"
        }
        failure {
            echo "MealBox Frontend: Pipeline FAILED"
        }
        always {
            cleanWs()
        }
    }
}
