FROM oven/bun:1-slim
WORKDIR /app
ENV NODE_ENV=production

# Instala dependências do sistema necessárias (ex.: OpenSSL para Prisma)
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Copia somente package.json + bun.lock primeiro para aproveitar cache
COPY package.json bun.lock ./

# Instala todas as dependências (dev + prod) necessárias para o build
RUN bun install --frozen-lockfile

# Copia o restante do código
COPY . .

# Gera Prisma Client (se você usa Prisma)
RUN bun prisma generate

# Expõe porta e start
EXPOSE 3000
CMD ["bun", "start"]
