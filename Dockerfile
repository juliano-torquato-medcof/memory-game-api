FROM oven/bun:1 as base
WORKDIR /app

COPY package*.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

FROM oven/bun:1-slim as production
WORKDIR /app

COPY --from=base /app/dist ./dist
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/bun.lock ./bun.lock
COPY --from=base /app/src ./src

RUN bun install --frozen-lockfile --production

ENV NODE_ENV=production
ENV API_URL=http://localhost

HEALTHCHECK --interval=5s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-3000}/health || exit 1

EXPOSE 3000

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 bunjs \
    && chown -R bunjs:nodejs /app

USER bunjs

CMD ["bun", "run", "start"] 