FROM node:12
WORKDIR /app

COPY package*.json ./
ENV TZ America/Bahia
RUN npm install
COPY . .

EXPOSE 3333
ENTRYPOINT ["npm", "run", "dev"]