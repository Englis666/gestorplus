FROM php:8.4.2-fpm

# Instala netcat-openbsd para nc
RUN apt-get update && apt-get install -y netcat-openbsd

# Instala la extensión PDO MySQL
# Instalar dependencias necesarias, incluyendo libonig-dev
RUN apt-get update && apt-get install -y \
    libonig-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install mysqli pdo pdo_mysql mbstring zip gd