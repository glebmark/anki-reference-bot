FROM node:18-alpine

RUN apk add --update curl coreutils  && rm -rf /var/cache/apk/*

RUN apk add --no-cache bash

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
