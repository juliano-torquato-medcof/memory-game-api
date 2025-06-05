FROM node:20-slim as base
WORKDIR /app

# Install package managers (with force flag to handle pre-installed yarn)
RUN npm install -g npm@latest && \
    npm install -g pnpm@latest --force && \
    npm install -g yarn@latest --force && \
    npm install -g bun@latest

# Copy package files
COPY package*.json pnpm-lock.yaml* yarn.lock* bun.lock* ./

# Install dependencies based on available lockfile
RUN if [ -f bun.lock ]; then \
        bun install --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then \
        pnpm install --frozen-lockfile; \
    elif [ -f yarn.lock ]; then \
        yarn install --frozen-lockfile; \
    else \
        npm ci; \
    fi

COPY . .

# Build using the detected package manager
RUN if [ -f bun.lock ]; then \
        bun run build; \
    elif [ -f pnpm-lock.yaml ]; then \
        pnpm run build; \
    elif [ -f yarn.lock ]; then \
        yarn build; \
    else \
        npm run build; \
    fi

FROM node:20-slim as production
WORKDIR /app

# Copy built files and package files
COPY --from=base /app/dist ./dist
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/pnpm-lock.yaml* /app/yarn.lock* /app/bun.lock* ./
COPY --from=base /app/src ./src

# Install package managers in production (with force flag)
RUN npm install -g npm@latest && \
    npm install -g pnpm@latest --force && \
    npm install -g yarn@latest --force && \
    npm install -g bun@latest

# Install production dependencies based on lockfile
RUN if [ -f bun.lock ]; then \
        bun install --frozen-lockfile --production; \
    elif [ -f pnpm-lock.yaml ]; then \
        pnpm install --frozen-lockfile --prod; \
    elif [ -f yarn.lock ]; then \
        yarn install --frozen-lockfile --production; \
    else \
        npm ci --only=production; \
    fi

ENV NODE_ENV=production
ENV API_URL=http://localhost

HEALTHCHECK --interval=5s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-3000}/health || exit 1

EXPOSE 3000

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nodejs \
    && chown -R nodejs:nodejs /app

USER nodejs

# Start using the detected package manager
CMD if [ -f bun.lock ]; then \
        bun run start; \
    elif [ -f pnpm-lock.yaml ]; then \
        pnpm run start; \
    elif [ -f yarn.lock ]; then \
        yarn start; \
    else \
        npm run start; \
    fi 