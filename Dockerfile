# Compiler
FROM node:19.8.1-alpine3.16 as compiler
LABEL maintainer="Spencer-0003"

ENV CHECKPOINT_DISABLE=1

WORKDIR /app

COPY package.json ./
RUN yarn
COPY . ./
RUN yarn prisma generate && yarn build

# Cleaner
FROM node:19.8.1-alpine3.16 as cleaner
LABEL maintainer="Spencer-0003"

ENV CHECKPOINT_DISABLE=1

WORKDIR /app

COPY --from=compiler /app/package.json ./
COPY --from=compiler /app/dist ./dist
COPY --from=compiler /app/prisma ./prisma
RUN yarn --production=true

# Runner
FROM node:19.8.1-alpine3.16
LABEL maintainer="Spencer-0003"

ENV CHECKPOINT_DISABLE=1

RUN apk add --no-cache bash
WORKDIR /app

COPY --from=cleaner /app ./

CMD ["yarn", "start"]
