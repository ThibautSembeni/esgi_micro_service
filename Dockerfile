FROM node:18

RUN npm install -g npm @nestjs/cli prisma

RUN apt update && apt install curl -y
