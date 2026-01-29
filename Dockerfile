FROM registry.access.redhat.com/ubi9/nginx-120

COPY index.html /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

