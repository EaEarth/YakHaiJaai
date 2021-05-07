# Install dependencies only when needed
FROM node:alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:alpine AS builder
ARG API_ENDPOINT=http://localhost:8080
ARG API_KEY
ARG AUTH_DOMAIN
ARG PROJECT_ID
ARG STORAGE_BUCKET
ARG MESSAGING_SENDER_ID
ARG APP_ID
ARG VAPID_KEY

ENV NEXT_PUBLIC_URL=${API_ENDPOINT}
ENV NEXT_PUBLIC_API_KEY=${API_KEY}
ENV NEXT_PUBLIC_AUTH_DOMAIN=${AUTH_DOMAIN}
ENV NEXT_PUBLIC_PROJECT_ID=${PROJECT_ID}
ENV NEXT_PUBLIC_STORAGE_BUCKET=${STORAGE_BUCKET}
ENV NEXT_PUBLIC_MESSAGING_SENDER_ID=${MESSAGING_SENDER_ID}
ENV NEXT_PUBLIC_APP_ID=${APP_ID}
ENV NEXT_PUBLIC_VAPID_KEY=${VAPID_KEY}
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM node:alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ARG API_ENDPOINT=http://localhost:8080
ARG API_KEY
ARG AUTH_DOMAIN
ARG PROJECT_ID
ARG STORAGE_BUCKET
ARG MESSAGING_SENDER_ID
ARG APP_ID
ARG VAPID_KEY

ENV NEXT_PUBLIC_URL=${API_ENDPOINT}
ENV NEXT_PUBLIC_API_KEY=${API_KEY}
ENV NEXT_PUBLIC_AUTH_DOMAIN=${AUTH_DOMAIN}
ENV NEXT_PUBLIC_PROJECT_ID=${PROJECT_ID}
ENV NEXT_PUBLIC_STORAGE_BUCKET=${STORAGE_BUCKET}
ENV NEXT_PUBLIC_MESSAGING_SENDER_ID=${MESSAGING_SENDER_ID}
ENV NEXT_PUBLIC_APP_ID=${APP_ID}
ENV NEXT_PUBLIC_VAPID_KEY=${VAPID_KEY}

# You only need to copy next.config.js if you are NOT using the default configuration
#COPY --from=builder /app/next.config.js ./
#COPY --from=builder /app/.env ./.env
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
RUN apk update && apk add socat

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

CMD yarn start