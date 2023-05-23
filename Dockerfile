FROM node:18-alpine

WORKDIR /service

COPY package*.json ./

RUN npm install

COPY . .