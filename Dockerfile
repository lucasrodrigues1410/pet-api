# Etapa base com Bun
FROM oven/bun:latest AS base
WORKDIR /app

# Etapa de build
FROM base AS build
# Instala utilitários necessários (compilação e OpenSSL)
RUN apt-get update -qq && \
    apt-get install -y build-essential openssl pkg-config python-is-python3

# Copia dependências e instala
COPY package.json bun.lock ./
RUN bun install

# Gera o Prisma Client
COPY prisma .
RUN bunx prisma generate

# Copia código e builda aplicação
COPY . .

# Remove dev-deps e instala apenas produção
RUN rm -rf node_modules && bun install --ci

# Etapa final com Bun puro
FROM base
# Garantir existência do OpenSSL se necessário
RUN apt-get update -qq && apt-get install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

COPY --from=build /app /app

EXPOSE 3000
CMD ["bun", "run", "start"]
