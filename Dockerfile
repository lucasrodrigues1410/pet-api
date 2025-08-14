# ----- Stage: cache das deps de produção (rápido, reutilizável) -----
FROM imbios/bun-node:23-slim AS deps-prod
WORKDIR /app

# pacotes OS necessários em runtime (ex: OpenSSL p/ Prisma)
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# copiar apenas os arquivos de lock para aproveitar cache
COPY package.json bun.lock ./

# instalar **somente** dependências de produção (menor camada)
RUN bun install --frozen-lockfile --production

# ----- Stage: builder (instala tudo, gera Prisma e faz build) -----
FROM imbios/bun-node:23-slim AS builder
WORKDIR /app

# dependências de build (full) - usa cache se package.json/bun.lock não mudarem
COPY package.json bun.lock ./
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# instala todas as dependências (dev + prod) necessárias para build
RUN bun install --frozen-lockfile

# copia o resto do código
COPY . .

# gerar Prisma Client (se você usa Prisma)
RUN bun prisma generate

# roda o build do projeto (ajuste se seu script tiver outro nome)
# por exemplo: "build": "next build" ou "tsc --project tsconfig.build.json"
RUN bun run build

# ----- Stage: imagem final leve (apenas runtime + artefatos buildados) -----
FROM imbios/bun-node:23-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

# instalar runtime OS packages mínimos
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# criar usuário não-root (opcional, mas recomendado)
RUN useradd -m -u 1000 appuser || true
USER appuser

# copiar dependências de produção instaladas no stage deps-prod
COPY --from=deps-prod --chown=appuser:appuser /app/node_modules ./node_modules

# copiar package.json (útil para alguns runtimes/pm) e scripts
COPY --from=builder --chown=appuser:appuser /app/package.json ./package.json

EXPOSE 3000
# comando de start (ajuste se seu script for diferente)
CMD ["bun", "run", "start:prod"]
