# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Environment variable.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copy source code
COPY . .

# Install dependencies
RUN npm ci

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
