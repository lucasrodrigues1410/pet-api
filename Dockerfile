# Imagem com Bun + Node
FROM imbios/bun-node:23-slim AS base
WORKDIR /app
ENV NODE_ENV=production

# Instala dependências do sistema (OpenSSL para Prisma)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copia apenas arquivos de dependência primeiro para aproveitar cache
COPY package.json bun.lock ./

# Instala apenas dependências de produção
RUN bun install --frozen-lockfile --production

# Copia o resto do código
COPY . .

# Gera Prisma Client
RUN bun prisma generate

EXPOSE 3000
CMD ["bun", "run", "start"]
