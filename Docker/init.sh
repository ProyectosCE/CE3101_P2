#!/bin/bash

# 1. Arrancar los servicios de Nginx con la configuración inicial A
echo "Iniciando Nginx con la configuración A..."
cp /etc/nginx/nginx_A.conf /etc/nginx/nginx.conf
nginx -g 'daemon off;' &

# 2. Esperar a que Nginx esté completamente levantado
echo "Esperando a que Nginx esté completamente levantado..."
sleep 15  # Tiempo de espera para asegurar que nginx esté listo, ajusta si es necesario

# 3. Ejecutar Certbot para generar los certificados
echo "Ejecutando Certbot para obtener los certificados..."
certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email ale_montero@estudiantec.cr \
  --agree-tos \
  --no-eff-email \
  -d apigymtec.itcrdev.xyz \
  -d gymtecpg.itcrdev.xyz \
  -d nginxtest.itcrdev.xyz

# 4. Reiniciar Nginx con la nueva configuración B
echo "Reiniciando Nginx con la configuración B..."
cp /etc/nginx/nginx_B.conf /etc/nginx/nginx.conf
kill -HUP $(cat /var/run/nginx.pid)

echo "Proceso completado con éxito."
