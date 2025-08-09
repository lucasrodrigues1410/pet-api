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

RUN bunx prisma generate

ENV NODE_ENV production
CMD ["bun", "run", "start"]

EXPOSE 3000