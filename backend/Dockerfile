FROM node:alpine AS deps

WORKDIR /app

COPY . .
RUN yarn install --frozen-lockfile && \
    yarn run build

FROM node:alpine AS builder

ENV NODE_ENV=production 

ARG ARG_DB_CONNECTION=mysql
ARG ARG_DB_HOST=localhost
ARG ARG_DB_PORT=3306
ARG ARG_DB_DATABASE=yakhaijaai
ARG ARG_DB_USERNAME=yakhaijaai
ARG ARG_DB_PASSWORD=yakhaijaai

ENV DB_CONNECTION=${ARG_DB_CONNECTION}
ENV DB_HOST=${ARG_DB_HOST}
ENV DB_PORT=${ARG_DB_PORT}
ENV DB_DATABASE=${ARG_DB_DATABASE}
ENV DB_USERNAME=${ARG_DB_USERNAME}
ENV DB_PASSWORD=${ARG_DB_PASSWORD}

ARG ARG_PROJECT_ID=project_id
ARG ARG_PRIVATE_KEY=private_key
ARG ARG_CLIENT_EMAIL=client_email

ENV PROJECT_ID=${ARG_PROJECT_ID}
ENV PRIVATE_KEY=${ARG_PRIVATE_KEY}
ENV CLIENT_EMAIL=${ARG_CLIENT_EMAIL}
WORKDIR /app

COPY --from=deps ./app/dist ./dist
COPY package.json ./
COPY yarn.lock ./
COPY ormconfig.js ./
RUN apk add --no-cache make gcc g++ python3
RUN yarn install --production --prefer-offline
#    apk del make gcc g++ python
#RUN yarn cache clean

FROM node:alpine AS runner
ENV NODE_ENV=production
ARG ARG_DB_CONNECTION=mysql
ARG ARG_DB_HOST=localhost
ARG ARG_DB_PORT=3306
ARG ARG_DB_DATABASE=yakhaijaai
ARG ARG_DB_USERNAME=yakhaijaai
ARG ARG_DB_PASSWORD=yakhaijaai

ENV DB_CONNECTION=${ARG_DB_CONNECTION}
ENV DB_HOST=${ARG_DB_HOST}
ENV DB_PORT=${ARG_DB_PORT}
ENV DB_DATABASE=${ARG_DB_DATABASE}
ENV DB_USERNAME=${ARG_DB_USERNAME}
ENV DB_PASSWORD=${ARG_DB_PASSWORD}

ARG ARG_PROJECT_ID=project_id
ARG ARG_PRIVATE_KEY=private_key
ARG ARG_CLIENT_EMAIL=client_email

ENV PROJECT_ID=${ARG_PROJECT_ID}
ENV PRIVATE_KEY=${ARG_PRIVATE_KEY}
ENV CLIENT_EMAIL=${ARG_CLIENT_EMAIL}
WORKDIR /app

COPY --from=builder ./app/ ./

EXPOSE 8080
CMD [ "yarn", "run", "start:prod" ]