# Set Bun and Node version
FROM imbios/bun-node:23-slim

# Set production environment
ENV NODE_ENV="production"

# Bun app lives here
WORKDIR /app

# Copy app files to app directory
COPY . .

# Install node modules
RUN bun install

# Generate Prisma Client
RUN bun prisma generate

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "bun", "run", "start" ]