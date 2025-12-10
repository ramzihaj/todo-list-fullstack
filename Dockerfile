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
RUN npm run build  # Optionnel : Si vous avez un script build pour backend

# Stage 3: Runtime avec Nginx pour frontend + backend
FROM nginx:alpine
# Copie frontend build dans Nginx
COPY --from=frontend-build /app/frontend/build /usr/share/nginx/html
# Copie backend dans un dossier
COPY --from=backend-build /app/backend /app/backend
# Copie script d'entrée
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh && \
    apk add --no-cache nodejs npm  # Node pour runtime backend
# Expose ports
EXPOSE 80 5000
# Config Nginx pour proxy backend (ajustez si besoin)
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Démarre tout via script
CMD ["/usr/local/bin/entrypoint.sh"]