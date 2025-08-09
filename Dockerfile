FROM node:20-slim

WORKDIR /app


# Instalar unzip, OpenSSL e Bun
RUN apt-get update -y && apt-get install -y unzip openssl curl \
  && curl -fsSL https://bun.sh/install | bash \
  && mv /root/.bun/bin/bun /usr/local/bin/


COPY package.json bun.lock ./
RUN bun install

COPY src src
COPY tsconfig.json .
COPY prisma prisma

RUN bunx prisma generate

ENV NODE_ENV=production

CMD ["bun", "run", "db:deploy"]

EXPOSE 3000