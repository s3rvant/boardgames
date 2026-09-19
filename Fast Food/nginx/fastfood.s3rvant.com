server {
	server_name fastfood.s3rvant.com;
	root /var/nginx/fastfood/public;
	index index.html;

        location / {
                try_files $uri $uri/ =404;
        }
        location = /ws {
                proxy_pass http://127.0.0.1:53198/;
                proxy_http_version 1.1;

                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";

                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;

                proxy_read_timeout 3600s;
                proxy_send_timeout 3600s;

		proxy_buffering off;
        }
        location = /ws/ {
                proxy_pass http://127.0.0.1:53198/;
                proxy_http_version 1.1;

                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";

                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;

                proxy_read_timeout 3600s;
                proxy_send_timeout 3600s;

                proxy_buffering off;
        }
        location ~ \.php$ {
                include snippets/fastcgi-php.conf;
                fastcgi_pass unix:/var/run/php/php8.4-fpm.sock;
        }
        location ~ /\.ht {
                deny all;
        }

	listen 443 ssl;
	ssl_certificate /etc/letsencrypt/live/fastfood.s3rvant.com/fullchain.pem;
	ssl_certificate_key /etc/letsencrypt/live/fastfood.s3rvant.com/privkey.pem;
	include /etc/letsencrypt/options-ssl-nginx.conf;
	ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

}

server {
	listen 80;
	server_name fastfood.s3rvant.com;
	return 301 https://fastfood.s3rvant.com$request_uri;
}
