import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as https from 'https';

interface VaultSecrets {
  databaseUrl: string;
  jwtSecret: string;
  jwtRefreshSecret: string;
  jwtExpires: string;
  jwtRefreshExpiresIn: string;
}

@Injectable()
export class VaultService implements OnModuleInit {
  private readonly logger = new Logger(VaultService.name);
  private vaultAddr = process.env.VAULT_ADDR || 'https://vault:8200';
  private token: string | null = null;
  private secrets: VaultSecrets | null = null;

  // Agent HTTPS qui accepte le certificat auto-signé de Vault
  private agent = new https.Agent({
    ca: fs.existsSync('/vault/certs/vault.crt')
      ? fs.readFileSync('/vault/certs/vault.crt')
      : undefined,
    rejectUnauthorized: false, // dev only — en prod, fournir le CA correct
  });

  async onModuleInit() {
    await this.authenticate();
    await this.loadSecrets();
  }

  private async authenticate() {
    const roleId = fs.readFileSync('/vault/approle/role-id', 'utf-8').trim();
    const secretId = fs.readFileSync('/vault/approle/secret-id', 'utf-8').trim();

    const res = await fetch(`${this.vaultAddr}/v1/auth/approle/login`, {
      method: 'POST',
      body: JSON.stringify({ role_id: roleId, secret_id: secretId }),
      // @ts-expect-error - undici supporte 'dispatcher', pas 'agent' directement
      agent: this.agent,
    });

    if (!res.ok) {
      throw new Error(`Vault auth failed: ${res.status} ${await res.text()}`);
    }

    const data = await res.json();
    this.token = data.auth.client_token;
    this.logger.log('Authenticated with Vault via AppRole');
  }

  private async readKv(path: string): Promise<Record<string, string>> {
    const res = await fetch(`${this.vaultAddr}/v1/kehoros/data/${path}`, {
      headers: { 'X-Vault-Token': this.token! },
      // @ts-expect-error
      agent: this.agent,
    });

    if (!res.ok) {
      throw new Error(`Failed to read ${path} from Vault: ${res.status}`);
    }

    const json = await res.json();
    return json.data.data;
  }

  private async loadSecrets() {
    const db = await this.readKv('backend/database');
    const jwt = await this.readKv('backend/jwt');

    this.secrets = {
      databaseUrl: db.url,
      jwtSecret: jwt.secret,
      jwtRefreshSecret: jwt.refresh_secret,
      jwtExpires: jwt.expires,
      jwtRefreshExpiresIn: jwt.refresh_expires_in,
    };

    // Injecte DATABASE_URL dans process.env pour que Prisma le lise
    process.env.DATABASE_URL = this.secrets.databaseUrl;

    this.logger.log('Secrets loaded from Vault');
  }

  get(): VaultSecrets {
    if (!this.secrets) {
      throw new Error('Secrets not loaded yet');
    }
    return this.secrets;
  }
}