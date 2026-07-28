# ---------- Stage 1 : Build React ----------
FROM node:22-alpine AS builder

WORKDIR /app

COPY medicare-website/package*.json ./

RUN npm ci

COPY medicare-website .

RUN npm run build

# ---------- Stage 2 : Nginx ----------
FROM nginx:1.29-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx","-g","daemon off;"]