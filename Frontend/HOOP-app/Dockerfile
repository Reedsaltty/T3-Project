# Frontend Dockerfile - Multi-stage build
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Stage 2: Production runtime
FROM node:22-alpine
WORKDIR /app

# FIX: Update npm globally to patch the bundled picomatch vulnerability
RUN npm install -g npm@latest

# Install a simple HTTP server to serve the built app
RUN npm install -g serve

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copy built app from builder
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

USER nodejs

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]

