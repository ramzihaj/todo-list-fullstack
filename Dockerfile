# Stage 1: Build Frontend (React)
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend (Node)
FROM node:20-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ ./

# Stage 3: Runtime avec Nginx pour frontend + backend
FROM nginx:alpine
# Copie frontend build dans Nginx
COPY --from=frontend-build /app/frontend/build /usr/share/nginx/html
# Copie backend dans un dossier pour servir via Nginx proxy
COPY --from=backend-build /app/backend /app/backend
# Expose ports
EXPOSE 80 5000
# Démarre backend Node
RUN apk add --no-cache nodejs npm
WORKDIR /app/backend
RUN npm start &  # Backend sur 5000
# Config Nginx pour proxy backend
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]