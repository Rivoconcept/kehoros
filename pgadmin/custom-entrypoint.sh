#!/bin/sh

# Load secrets file if it exists
if [ -f /run/secrets/GameHub/pgadmin/pgadmin.env ]; then
  while IFS='=' read -r key value; do
    export "$key=$value"
  done < /run/secrets/GameHub/pgadmin/pgadmin.env
fi


cat > /tmp/servers.json <<EOF
{
  "Servers": {
    "1": {
      "Name": "${PGADMIN_SERVER_NAME}",
      "Group": "Servers",
      "Host": "${DB_HOST}",
      "Port": ${DB_PORT},
      "MaintenanceDB": "${POSTGRES_DB}",
      "Username": "${POSTGRES_USER}",
      "
      "SSLMode": "prefer"
    }
  }
}
EOF

exec /entrypoint.sh
