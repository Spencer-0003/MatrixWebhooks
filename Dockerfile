# Compiler
FROM node:20.1.0-bullseye-slim as compiler
LABEL maintainer="Spencer-0003"

ENV CHECKPOINT_DISABLE=1

WORKDIR /app

COPY package.json ./
RUN yarn
COPY . ./
RUN yarn prisma generate && yarn build

# Cleaner
FROM node:20.1.0-bullseye-slim as cleaner
LABEL maintainer="Spencer-0003"

ENV CHECKPOINT_DISABLE=1

WORKDIR /app

COPY --from=compiler /app/package.json ./
COPY --from=compiler /app/dist ./dist
COPY --from=compiler /app/prisma ./prisma
RUN yarn --production=true

# Runner
FROM node:20.1.0-bullseye-slim
LABEL maintainer="Spencer-0003"

ENV CHECKPOINT_DISABLE=1

RUN apt-get update && apt-get install -y bash && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY --from=cleaner /app ./

CMD ["yarn", "start"]
