#!/bin/sh
set -e
mkdir -p /vault/certs
mkdir -p /vault/config
mkdir -p /vault/file

##################################
# certificat auto-signé
##################################
if [ ! -f /vault/certs/vault.crt ]; then
echo "Generating TLS certificate..."
openssl req -x509 -nodes -days 365 \
-newkey rsa:4096 \
-keyout /vault/certs/vault.key \
-out /vault/certs/vault.crt \
-subj "/C=MG/ST=Analamanga/L=Antananarivo/O=Kehoros/CN=vault"
fi

##################################
# vault.hcl
##################################
cat > /vault/config/vault.hcl <<EOF
ui = true
listener "tcp" {
 address = "0.0.0.0:8200"
 tls_cert_file = "/vault/certs/vault.crt"
 tls_key_file = "/vault/certs/vault.key"
}
storage "file" {
 path = "/vault/file"
}
disable_mlock = true
EOF

##################################
# démarrer Vault en arrière-plan
##################################
vault server -config=/vault/config/vault.hcl &
VAULT_PID=$!

export VAULT_ADDR="https://127.0.0.1:8200"
export VAULT_SKIP_VERIFY="true"

echo "Waiting for Vault to start..."
until curl -sk https://127.0.0.1:8200/v1/sys/health >/dev/null 2>&1; do
  sleep 1
done
echo "Vault is up."

INIT_FILE="/vault/file/init.json"

if [ ! -f "$INIT_FILE" ]; then
  echo "Initializing Vault..."
  if ! vault operator init -key-shares=1 -key-threshold=1 -format=json > "$INIT_FILE" 2>/tmp/init_err; then
    echo "Init failed:"
    cat /tmp/init_err
    exit 1
  fi
  chmod 600 "$INIT_FILE"
else
  echo "Vault already initialized, skipping init."
fi

UNSEAL_KEY=$(jq -r '.unseal_keys_b64[0]' "$INIT_FILE")
ROOT_TOKEN=$(jq -r '.root_token' "$INIT_FILE")

##################################
# unseal
##################################
SEALED=$(vault status -format=json | jq -r '.sealed')
if [ "$SEALED" = "true" ]; then
  echo "Unsealing Vault..."
  vault operator unseal "$UNSEAL_KEY"
fi

export VAULT_TOKEN="$ROOT_TOKEN"

##################################
# secrets engine KV v2
##################################
vault secrets enable -path=kehoros kv-v2 2>/dev/null || echo "kv already enabled"

##################################
# écrire les secrets depuis les fichiers JSON
##################################
if [ -f /secrets/backend/database.json ]; then
  DB_HOST=$(jq -r '.host' /secrets/backend/database.json)
  DB_PORT=$(jq -r '.port' /secrets/backend/database.json)
  DB_NAME=$(jq -r '.database' /secrets/backend/database.json)
  DB_USER=$(jq -r '.username' /secrets/backend/database.json)
  DB_PASS=$(jq -r '.password' /secrets/backend/database.json)

  vault kv put kehoros/backend/database \
    url="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"
fi

if [ -f /secrets/backend/jwt.json ]; then
  vault kv put kehoros/backend/jwt \
    secret="$(jq -r '.secret' /secrets/backend/jwt.json)" \
    refresh_secret="$(jq -r '.refresh_secret' /secrets/backend/jwt.json)" \
    expires="$(jq -r '.expires' /secrets/backend/jwt.json)" \
    refresh_expires_in="$(jq -r '.refresh_expires_in' /secrets/backend/jwt.json)"
fi

##################################
# AppRole pour le backend (auth sans root token)
##################################
vault auth enable approle 2>/dev/null || echo "approle already enabled"

vault policy write backend-policy - <<EOF
path "kehoros/data/backend/*" {
  capabilities = ["read"]
}
EOF

vault write auth/approle/role/backend \
  token_policies="backend-policy" \
  token_ttl=1h \
  token_max_ttl=4h

ROLE_ID=$(vault read -format=json auth/approle/role/backend/role-id | jq -r '.data.role_id')
SECRET_ID=$(vault write -f -format=json auth/approle/role/backend/secret-id | jq -r '.data.secret_id')

mkdir -p /vault/file/approle
echo "$ROLE_ID" > /vault/file/approle/role-id
echo "$SECRET_ID" > /vault/file/approle/secret-id
chmod 600 /vault/file/approle/role-id /vault/file/approle/secret-id

echo "Vault ready."
wait $VAULT_PID