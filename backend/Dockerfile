FROM node:lts-alpine AS builder

WORKDIR /app

COPY . .
RUN yarn install && \
    yarn run build && \
    yarn cache clean

FROM node:lts-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder ./app/dist ./dist
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --production

EXPOSE 8000
CMD [ "yarn", "run", "start:prod" ]