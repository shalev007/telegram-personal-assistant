FROM node:16-alpine as builder

ENV NODE_ENV build

# USER node
WORKDIR /home/node

COPY package*.json ./
RUN npm install typescript -g
RUN npm ci

COPY . .
RUN npm run compile \
    && npm prune --production

# ---

FROM node:16-alpine

ENV NODE_ENV production

# USER node
WORKDIR /home/node

COPY --from=builder /home/node/package*.json ./
COPY --from=builder /home/node/node_modules/ ./node_modules/
COPY --from=builder /home/node/build/ ./build/

CMD ["node", "build/src/index.js"]