FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite sustituye import.meta.env.* en tiempo de compilación, así que la URL de
# la API queda horneada en el bundle. Vacío = rutas relativas (/api/v1/...),
# que es lo que queremos detrás del reverse proxy: el navegador las resuelve
# contra el mismo origen y no hay CORS. Se puede sobrescribir con
# --build-arg VITE_API_BASE_URL=https://api.ejemplo.com si algún día el
# frontend se sirve desde un dominio distinto al de la API.
ARG VITE_API_BASE_URL=""
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

FROM nginx:1.29-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
