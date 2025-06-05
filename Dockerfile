FROM oven/bun:1 as base
WORKDIR /app

# Install dependencies
COPY package*.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:1-slim as production
WORKDIR /app

# Copy built assets and package files
COPY --from=base /app/dist ./dist
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/bun.lock ./bun.lock

# Install production dependencies only
RUN bun install --frozen-lockfile --production

# Set environment variables
ENV NODE_ENV=production
ENV API_URL=http://localhost

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD bun run health

# Expose port
EXPOSE 3000

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 bunjs \
    && chown -R bunjs:nodejs /app

USER bunjs

# Start the application
CMD ["bun", "run", "start"] 