FROM node:alpine AS builder

ENV DB_CONNECTION=mysql
ENV DB_HOST=localhost
ENV DB_PORT=3306
ENV DB_DATABASE=userdb
ENV DB_USERNAME=app_user
ENV DB_PASSWORD=userpass

WORKDIR /app

COPY . .
RUN yarn install
RUN yarn start

EXPOSE 8080
CMD [ "yarn", "start" ]