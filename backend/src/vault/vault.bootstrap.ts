// backend/src/vault/vault.bootstrap.ts
import * as fs from 'fs';
import { Agent, fetch as undiciFetch } from 'undici';

export class VaultBootstrap {
  static async loadSecrets() {
    const vaultAddr = process.env.VAULT_ADDR || 'https://vault:8200';

    // Charge le certificat de Vault pour valider la connexion proprement
    const ca = fs.existsSync('/vault/certs/vault.crt')
      ? fs.readFileSync('/vault/certs/vault.crt')
      : undefined;

    const dispatcher = new Agent({
      connect: {
        ca,
        rejectUnauthorized: !!ca, // si on a le CA, on valide ; sinon dev only
      },
    });

    const roleId = fs.readFileSync('/vault/approle/role-id', 'utf-8').trim();
    const secretId = fs.readFileSync('/vault/approle/secret-id', 'utf-8').trim();

    const authRes = await undiciFetch(`${vaultAddr}/v1/auth/approle/login`, {
      method: 'POST',
      body: JSON.stringify({ role_id: roleId, secret_id: secretId }),
      dispatcher,
    });
    const authData: any = await authRes.json();

    if (!authData.auth) {
      throw new Error(`Vault auth failed: ${JSON.stringify(authData)}`);
    }
    const token = authData.auth.client_token;

    const dbRes = await undiciFetch(`${vaultAddr}/v1/kehoros/data/backend/database`, {
      headers: { 'X-Vault-Token': token },
      dispatcher,
    });
    const dbData: any = await dbRes.json();
    process.env.DATABASE_URL = dbData.data.data.url;

    const jwtRes = await undiciFetch(`${vaultAddr}/v1/kehoros/data/backend/jwt`, {
      headers: { 'X-Vault-Token': token },
      dispatcher,
    });
    const jwtData: any = await jwtRes.json();
    process.env.JWT_SECRET = jwtData.data.data.secret;
    process.env.JWT_REFRESH_SECRET = jwtData.data.data.refresh_secret;
    process.env.JWT_EXPIRES = jwtData.data.data.expires;

    console.log('Secrets loaded from Vault.');
  }
}