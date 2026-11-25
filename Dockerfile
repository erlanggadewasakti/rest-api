# syntax=docker/dockerfile:1

FROM oven/bun:1-slim AS bun-bin

FROM node:22-bookworm-slim AS base
WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl \
  && rm -rf /var/lib/apt/lists/*

FROM base AS deps
COPY --from=bun-bin /usr/local/bin/bun /usr/local/bin/bun
RUN ln -s /usr/local/bin/bun /usr/local/bin/bunx
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS prod-deps
COPY --from=bun-bin /usr/local/bin/bun /usr/local/bin/bun
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

FROM deps AS builder
COPY prisma.config.ts tsconfig.json tsconfig.build.json nest-cli.json ./
COPY prisma ./prisma
COPY src ./src
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy?schema=public" bunx prisma generate \
  && bun run build

FROM builder AS migrator
ENV NODE_ENV=production \
    CHECKPOINT_DISABLE=1 \
    PRISMA_HIDE_UPDATE_MESSAGE=1
USER node
CMD ["bunx", "prisma", "migrate", "deploy"]

FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json ./
COPY --chown=node:node prisma/schema.prisma ./prisma/schema.prisma
COPY --chown=node:node .adminjs ./.adminjs
RUN mkdir -p /app/.adminjs && chown -R node:node /app/.adminjs

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:' + (process.env.PORT || 3000) + '/').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]

CMD ["node", "dist/main.js"]
