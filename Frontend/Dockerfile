# Frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package.json để cài node_modules
COPY package.json package-lock.json* ./

RUN npm install

# Copy source code
COPY . .

# Mở port mặc định của Vite
EXPOSE 5173

# Chạy dev server với cờ --host để truy cập được từ bên ngoài container
CMD ["npm", "run", "dev", "--", "--host"]