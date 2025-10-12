# MongoDB Restaurant Directory API
# Implements Technological Scalability principles
# Multi-stage build for optimized production deployment

# Stage 1: Build stage with development dependencies
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Production stage - implements Green IT practices
FROM node:18-alpine AS production

# Install security updates and minimal required packages
RUN apk update && apk upgrade && apk add --no-cache \
    tini \
    && rm -rf /var/cache/apk/*

# Create non-root user for security (sustainability principle)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy production dependencies from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy application code
COPY --chown=nodejs:nodejs . .

# Remove unnecessary files to reduce image size (Green IT)
RUN rm -rf tests/ docs/ screenshots/ *.md .git/

# Set environment variables for scalability
ENV NODE_ENV=production
ENV PORT=3000
ENV NODE_OPTIONS="--max-old-space-size=512"

# Health check endpoint for container orchestration
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Use tini for proper signal handling in containers
ENTRYPOINT ["tini", "--"]

# Start application with optimal settings for scalability
CMD ["node", "--max-old-space-size=512", "server.js"]

# Labels for container management and scalability
LABEL maintainer="MelsLores"
LABEL version="3.0.0"
LABEL description="MongoDB Restaurant Directory API - Sprint 3 with Scalability"
LABEL sustainability.practices="Multi-stage build, minimal dependencies, resource optimization"
LABEL scalability.features="Container-ready, health checks, resource limits"