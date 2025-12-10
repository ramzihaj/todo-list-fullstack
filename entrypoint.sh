#!/bin/bash
# Démarre le backend Node en background
cd /app/backend
npm start &
# Démarre Nginx en foreground
nginx -g "daemon off;"