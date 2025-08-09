FROM oven/bun

WORKDIR /app

# Instalar OpenSSL
RUN apt-get update -y && apt-get install -y openssl

COPY package.json .
COPY bun.lock .

RUN bun install

COPY src src
COPY tsconfig.json .
COPY prisma prisma

ENV NODE_ENV production
CMD ["bun", "run", "db:deploy"]

EXPOSE 3000