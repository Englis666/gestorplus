FROM php:8.4.2-fpm

# Instalar librerías necesarias
RUN apt-get update && apt-get install -y \
    netcat-openbsd \
    libonig-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install mysqli pdo pdo_mysql mbstring zip gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar dependencias para Xdebug
RUN apt-get update && apt-get install -y \
    autoconf \
    bison \
    re2c \
    pkg-config \
    libpcre3-dev \
    libz-dev \
    gcc \
    make \
    && pecl install xdebug \
    && docker-php-ext-enable xdebug

# Configuración de Xdebug
RUN echo "xdebug.mode=coverage" > /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
    echo "xdebug.start_with_request=yes" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
    echo "zend_extension=xdebug.so" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

# Instalar Composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
    && php -r "unlink('composer-setup.php');"

# Verificar si PHP y Xdebug están habilitados
RUN php -m | grep xdebug

# Limpiar apt-get
RUN apt-get clean && rm -rf /var/lib/apt/lists/*
