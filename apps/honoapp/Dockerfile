# Use the official Bun image
FROM oven/bun:latest AS base

# Set working directory
WORKDIR /app

# Copy root package files (using wildcards for optional files)
COPY package.json ./
COPY bun.lockb* ./
COPY turbo.json* ./

# Copy workspace package.json files
COPY apps/honoapp/package.json ./apps/honoapp/
COPY packages/logger/package.json ./packages/logger/

# Install dependencies
RUN bun install

# Copy the logger package source
COPY packages/logger ./packages/logger

# Build the logger package
WORKDIR /app/packages/logger
RUN bun run build

# Copy honoapp source
WORKDIR /app
COPY apps/honoapp ./apps/honoapp

# Expose the port
EXPOSE 3000

# Set working directory to honoapp
WORKDIR /app/apps/honoapp

# Run the application
CMD ["bun", "run", "start"]
