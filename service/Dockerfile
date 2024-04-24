# Base image for building
FROM node:18-alpine AS builder

# Configure pnpm
WORKDIR /app
RUN npm i -g pnpm

# Copy package configs and install dependencies
COPY package*.json ./
RUN pnpm install

# Copy source code and build
COPY . .
RUN pnpm run build

# Final image for production
FROM node:18-alpine

# Working directory
WORKDIR /app
RUN npm i -g pnpm

# Copy package configs (needed for environment variables)
COPY package*.json ./

# Install production dependencies only
RUN pnpm install

# Copy built code
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Set environment variables (replace with actual values)
ARG PORT
ENV PORT=${PORT}

ARG JWT_SECRET
ENV JWT_SECRET=${JWT_SECRET}

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=${OPENAI_API_KEY}

ARG ENCODER_SERVICE_URL
ENV ENCODER_SERVICE_URL=${ENCODER_SERVICE_URL}

# Start the application
CMD ["pnpm", "start"]
