FROM node:alpine AS deps

WORKDIR /app

COPY . .
RUN yarn install --frozen-lockfile && \
    yarn run build

FROM node:alpine AS builder

ENV NODE_ENV=production 
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
WORKDIR /app

COPY --from=builder ./app/ ./

EXPOSE 8000
CMD [ "yarn", "run", "start:prod" ]