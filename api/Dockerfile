# 1단계: 빌드 단계
FROM node:20 AS build

# 작업 디렉토리를 설정합니다.
WORKDIR /usr/src/app

# package 파일을 복사하고 프로덕션 종속성만 설치합니다.
COPY package*.json ./
COPY .env.production ./
RUN npm install --production

# 나머지 애플리케이션 코드를 복사합니다.
COPY ./dist ./dist

# 2단계: 프로덕션 단계
FROM node:20-slim AS production

# 작업 디렉토리를 설정합니다.
WORKDIR /usr/src/app

# 빌드 단계에서 필요한 파일만 복사합니다.
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/.env.production ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

# PORT 8000번 개방
EXPOSE 8000

# 애플리케이션을 프로덕션 모드로 실행합니다.
CMD ["npm", "run", "start:prod"]
