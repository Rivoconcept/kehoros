FROM hashicorp/vault:1.19
USER root
RUN apk add --no-cache openssl jq curl
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]