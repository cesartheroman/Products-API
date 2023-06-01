FROM node:18

WORKDIR /service

COPY package*.json ./

RUN npm install

COPY /server ./

COPY .env ./

COPY tsconfig.json ./