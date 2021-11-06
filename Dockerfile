FROM node:16-bullseye-slim AS builder-base
RUN apt-get update &&\
    apt-get install --no-install-recommends -y \
    python3 \
    make \
    g++


FROM builder-base AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 100000 && yarn cache clean
COPY . .
RUN yarn build


FROM builder-base AS production
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production --network-timeout 100000 && yarn cache clean
COPY --from=builder /app/dist ./


FROM builder-base AS runner
WORKDIR /app
COPY --from=production /app ./
CMD ["node", "index.js"]
