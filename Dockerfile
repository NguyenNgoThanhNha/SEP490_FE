## Sử dụng Node để build
#FROM node:20 AS build-stage
#
## Tạo thư mục làm việc trong container
#WORKDIR /app
#
## Copy chỉ các file package.json và package-lock.json trước để cài đặt dependencies
#COPY package*.json tsconfig.json ./
#
## Cài đặt các package
#RUN npm install
#
## Copy toàn bộ file của project vào container
#COPY . .
#
## Build project để tạo thư mục dist
#RUN npm run build

# Sử dụng Nginx để phục vụ nội dung
FROM nginx:latest

## Copy thư mục dist từ build-stage sang thư mục phục vụ của Nginx
#COPY --from=build-stage /app/dist /usr/share/nginx/html
#
## Expose cổng 80
#EXPOSE 80
#
## Chạy Nginx
#CMD ["nginx", "-g", "daemon off;"]
