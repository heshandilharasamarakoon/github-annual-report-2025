FROM oven/bun:latest

COPY package.json ./
COPY bun.lock ./
COPY .env ./
COPY index.ts ./
COPY tsconfig.json ./
COPY middleware ./middleware
COPY routes ./routes
COPY services ./services
COPY types ./types
COPY utils ./utils
COPY public ./public

RUN bun install

EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "index.ts" ]