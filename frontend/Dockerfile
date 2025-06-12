FROM node:18-alpine

# Instala Bun
RUN apk add --no-cache curl && \
    curl -fsSL https://bun.sh/install | bash && \
    ln -s /root/.bun/bin/bun /usr/local/bin/bun

WORKDIR /app

COPY package.json package-lock.json ./
RUN bun install

COPY . .

EXPOSE 3000

CMD ["bun", "run", "start"]