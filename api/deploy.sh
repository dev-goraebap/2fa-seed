# STEP: 프로젝트 빌드
npm run build

# STEP: 도커 이미지 빌드
docker build -f ./docker/Dockerfile -t 2fa-seed-api .

# STEP: 도커 컴포즈로 컨테이너 실행(테스트)
docker-compose -f ./docker/docker-compose.yml up
