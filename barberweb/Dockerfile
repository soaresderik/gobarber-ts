FROM node:12-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

ENV TZ America/Bahia

COPY . .
RUN npm run build
RUN npm i -g serve
EXPOSE 8001
CMD ["serve", "-s", "dist", "-l", "8001"]