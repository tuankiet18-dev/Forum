# Dùng bản slim thay vì alpine để tránh lỗi thư viện C++ trên Windows
FROM node:20-slim

WORKDIR /app

# Copy package.json và lock file
COPY package.json package-lock.json* ./

# Xóa node_modules cũ (nếu lỡ copy vào) và cài đặt mới
RUN rm -rf node_modules package-lock.json && npm install

# Copy source code
COPY . .

# Mở port Vite
EXPOSE 5173

# Chạy dev server với cờ --host để truy cập từ ngoài
CMD ["npm", "run", "dev", "--", "--host"]