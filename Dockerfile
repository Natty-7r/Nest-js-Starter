# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies using npm
RUN npm ci

# Copy all source files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production image
FROM node:18-alpine

WORKDIR /usr/src/app

# Install production dependencies only
COPY --from=builder /usr/src/app/package*.json ./
RUN npm ci --only=production

# Create directory for uploaded files
RUN mkdir -p ./uploaded && chown node:node ./uploaded
VOLUME /usr/src/app/uploaded

# Copy built files from builder
COPY --from=builder /usr/src/app/dist ./dist

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Environment variables
ENV NODE_ENV production
ENV PORT 3000
ENV UPLOAD_DIR /usr/src/app/uploaded

# Switch to non-root user
USER node

# Expose the application port
EXPOSE ${PORT}

# Run the application
CMD ["node", "dist/main.js"]