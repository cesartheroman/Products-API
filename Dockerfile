FROM node:18-alpine

WORKDIR /server

COPY package.json package-lock.json ./

RUN npm install

COPY . .
