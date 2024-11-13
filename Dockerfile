# syntax = docker/dockerfile:1
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine3.18 AS base
LABEL fly_launch_runtime="NestJS"
RUN apk add --no-cache curl
WORKDIR /app

# Production only deps stage
FROM base AS production-deps
# Install pnpm
ARG PNPM_VERSION=latest
RUN npm install -g pnpm@$PNPM_VERSION
WORKDIR /app
ADD package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Throw-away build stage to reduce size of final image
FROM base AS build

ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN

# Install pnpm
ARG PNPM_VERSION=latest
RUN npm install -g pnpm@$PNPM_VERSION

# Install node modules
COPY --link package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false
# Copy application code
COPY --link . .
# Build application
RUN pnpm run build

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app/dist /app/dist
COPY --link package.json pnpm-lock.yaml ./
COPY --from=production-deps /app/node_modules /app/node_modules

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "node", "./dist/main.js" ]
