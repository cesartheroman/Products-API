FROM node:18-alpine

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .
