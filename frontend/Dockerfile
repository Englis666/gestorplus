FROM oven/bun:1.1.13 as base

WORKDIR /app

COPY package.json ./
RUN bun install

COPY . .

EXPOSE 3000

CMD ["bun", "run", "start"]