# Build React frontend
FROM node:22-alpine AS frontend-build

WORKDIR /app/frontend

COPY chat-frontend/package*.json ./
RUN npm ci

COPY chat-frontend/ ./
RUN npm run build


# Build Express backend
FROM node:22-alpine AS backend-build

WORKDIR /app/backend

COPY chat-backend/package*.json ./
RUN npm ci

COPY chat-backend/ ./
RUN npm run build


# Production image
FROM node:22-alpine

WORKDIR /app

# Install nginx
RUN apk add --no-cache nginx

# Backend
COPY --from=backend-build /app/backend/package*.json ./backend/
COPY --from=backend-build /app/backend/node_modules ./backend/node_modules
COPY --from=backend-build /app/backend/dist ./backend/dist

# Frontend
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# Nginx config
COPY nginx.conf /etc/nginx/http.d/default.conf

EXPOSE 80

CMD ["sh", "-c", "node /app/backend/dist/server.js & nginx -g 'daemon off;'"]
