FROM oven/bun:1

WORKDIR /usr/src/app

# Copia manifests e instala dependências (com dev deps para gerar Prisma Client)
COPY package.json bun.lock ./
# Evita gerar Prisma Client no postinstall (schema ainda não copiado)
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true
RUN bun install --frozen-lockfile

# Copia apenas Prisma e gera o client (melhor cache)
COPY prisma ./prisma

# Copia restante do código e configurações e compila a aplicação
COPY tsconfig.json nest-cli.json ./
COPY src ./src
RUN bun run prisma:migrate && bun run prisma:generate

ENV NODE_ENV=production
EXPOSE 3000
# Executa migrate em runtime (depende de DATABASE_URL) e sobe a app
CMD ["bun", "run", "start"]
