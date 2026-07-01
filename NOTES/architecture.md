                HTTPS
                  │
                  ▼
             Traefik/Nginx
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
     Angular             NestJS
                              │
                              │ AppRole
                              ▼
                         Hashicorp Vault
                              │
                ┌─────────────┴─────────────┐
                │                           │
          KV Secret Engine           Database Engine
                │                           │
                └─────────────┬─────────────┘
                              ▼
                         PostgreSQL