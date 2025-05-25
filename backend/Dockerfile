FROM php:8.4.2-fpm

ENV TZ=America/Bogota
RUN apt-get update && apt-get install -y tzdata \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone

RUN echo "date.timezone=America/Bogota" > /usr/local/etc/php/conf.d/timezone.ini

RUN apt-get update && apt-get install -y \
    telnet \
    netcat-openbsd \
    libonig-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install mysqli pdo pdo_mysql mbstring zip gd iconv \
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

# Librería para que reconozca iconv
RUN docker-php-ext-install iconv

# Cambiar a la carpeta de trabajo donde está tu código PHP (ajusta según corresponda)
WORKDIR /var/www/html

COPY composer.json composer.lock /var/www/html/

RUN composer install --no-dev --optimize-autoloader

COPY . /var/www/html/

# Crear la carpeta uploads y dar permisos (esto solo aplica si NO usas volumen para uploads)
RUN mkdir -p /var/www/html/uploads && chmod 777 /var/www/html/uploads

# Limpiar apt-get
RUN apt-get clean && rm -rf /var/lib/apt/lists/*
