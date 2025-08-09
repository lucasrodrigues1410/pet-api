FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lock .

RUN bun install --production
RUN bun install prisma

COPY src src
COPY tsconfig.json .
COPY prisma prisma

ENV NODE_ENV production
CMD ["bun", "run", "db:deploy"]

EXPOSE 3000