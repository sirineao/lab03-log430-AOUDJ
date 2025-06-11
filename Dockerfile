FROM node:20-alpine
RUN apk update && apk add --no-cache mariadb-client
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
CMD ["node", "app.js"]
