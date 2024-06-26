# Используем официальный образ Node.js
FROM node:latest

# Создаем директорию приложения внутри контейнера
WORKDIR /usr/src/app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы приложения
COPY . .

# Указываем порт, который будет использоваться в приложении
EXPOSE 8080

# Команда для запуска приложения внутри контейнера
CMD ["node", "s3.js"]