FROM node:16-alpine3.14 AS builder-base
RUN apk add python3 make g++


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


FROM node:16-alpine3.14 AS runner
WORKDIR /app
COPY --from=production /app ./
CMD ["node", "index.js"]
