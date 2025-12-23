# Sử dụng .NET 9 SDK
FROM mcr.microsoft.com/dotnet/sdk:9.0

WORKDIR /app

# Copy file csproj và restore trước (tối ưu cache layer)
COPY *.csproj ./
RUN dotnet restore

# Copy toàn bộ source code
COPY . .

# Mở port 8080 (Port mặc định của container .NET 8+)
EXPOSE 8080

# Chạy lệnh watch để tự động reload khi sửa code
ENTRYPOINT ["dotnet", "watch", "run", "--non-interactive", "--urls", "http://+:8080"]