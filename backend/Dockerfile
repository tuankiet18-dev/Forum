# Backend/Dockerfile
FROM mcr.microsoft.com/dotnet/sdk:9.0

WORKDIR /app

# Copy file csproj và restore trước (tối ưu cache layer)
COPY *.csproj ./
RUN dotnet restore

# Copy toàn bộ source code vào
COPY . .

# Mở port 8080 (mặc định của .NET 8/9 container)
EXPOSE 8080

# Lệnh chạy server với chế độ Hot Reload
ENTRYPOINT ["dotnet", "watch", "run", "--urls", "http://+:8080"]