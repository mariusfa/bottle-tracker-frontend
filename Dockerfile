# Stage 1: Build
FROM node:lts-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

RUN npm run build

# Stage 2: Serve
FROM node:lts-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

RUN npm config set strict-ssl false \
	&& npm install -g serve

EXPOSE 80

CMD ["serve", "-s", "dist", "-l", "80"]
