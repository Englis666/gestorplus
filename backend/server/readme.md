# Ejecucion del server de socket para tener el chat en tiempo real
-- Cuando se utilice el chat y ademas siempre es necesario encender el servidor socket con 
php server/websocket-server.php start
# Dependencia
composer require workerman/workerman
# Si se ejecuta en segundo plano
php websocket.php start -d
