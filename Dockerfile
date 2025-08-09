# Stage 1: Base image com Bun
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Stage 2: Instalação de dependências de desenvolvimento (cache em /temp/dev)
FROM base AS deps-dev
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Stage 3: Instalação de dependências de produção (cache em /temp/prod)
FROM base AS deps-prod
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Stage 4: Build da aplicação
FROM base AS build
WORKDIR /usr/src/app
# Copia node_modules de dev para acelerar build
COPY --from=deps-dev /temp/dev/node_modules ./node_modules
# Copia esquema e configurações do Prisma
COPY prisma ./prisma
COPY tsconfig.json bunfig.toml nest-cli.json ./
COPY src ./src
# Gera o Prisma Client
RUN bunx prisma generate
RUN bunx prisma generate --sql

# Stage 5: Imagem de produção
FROM oven/bun:1 AS release
WORKDIR /usr/src/app
# Copia apenas node_modules de produção e artefatos buildados
COPY --from=deps-prod /temp/prod/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
ENV NODE_ENV=production
EXPOSE 3000
CMD ["bun", "run", "start:prod"]
