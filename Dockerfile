# Compiler
FROM oven/bun:latest AS compiler
LABEL maintainer="Spencer-0003"

ENV CHECKPOINT_DISABLE=1

WORKDIR /app

COPY package.json ./
RUN bun upgrade --canary
RUN bun install
COPY . ./
RUN bun prisma generate && bun run build

# Cleaner
FROM oven/bun:latest AS cleaner
LABEL maintainer="Spencer-0003"

ENV CHECKPOINT_DISABLE=1

WORKDIR /app

COPY --from=compiler /app/package.json ./
COPY --from=compiler /app/dist ./dist
COPY --from=compiler /app/prisma ./prisma
RUN bun upgrade --canary
RUN bun install --production

# Runner
FROM oven/bun:latest
LABEL maintainer="Spencer-0003"

ENV CHECKPOINT_DISABLE=1

RUN apt-get update && apt-get install -y bash && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY --from=cleaner /app ./
RUN bun upgrade --canary

CMD ["bun", "start"]
