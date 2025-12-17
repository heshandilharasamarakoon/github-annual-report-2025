FROM oven/bun:1 AS base
RUN apt-get update && apt-get install -y curl
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=bun,target=/root/.bun/install/cache bun install --production

FROM base AS build
RUN --mount=type=cache,id=bun,target=/root/.bun/install/cache bun install
RUN bun run build

FROM nginx:1-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]