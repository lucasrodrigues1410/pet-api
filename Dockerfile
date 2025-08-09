FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lock .

RUN bun install --production

COPY src src
COPY tsconfig.json .
COPY prisma prisma
RUN bun run prisma generate

ENV NODE_ENV production
CMD ["bun", "run", "start"]

EXPOSE 3000