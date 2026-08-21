FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:24-alpine AS production

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

RUN npm install -g serve

COPY --chown=appuser:appgroup --from=builder /app/build ./build

USER appuser

EXPOSE 3050

CMD ["serve", "-s", "build", "-l", "3050"]