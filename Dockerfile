# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copy package files first for better caching
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies (using pnpm - adjust if using npm/yarn)
RUN corepack enable && pnpm install --frozen-lockfile

# Copy all source files
COPY . .

# Build the application
RUN pnpm run build

# Stage 2: Production image
FROM node:18-alpine

WORKDIR /usr/src/app

# Install production dependencies only
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./
RUN corepack enable && pnpm install --prod --frozen-lockfile

# Copy built files from builder
COPY --from=builder /usr/src/app/dist ./dist

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Environment variables
ENV NODE_ENV production
ENV PORT 3000

# Expose the application port
EXPOSE ${PORT}

# Run the application
CMD ["node", "dist/main.js"]