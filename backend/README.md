<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Authentification en deux étapes

Par défaut, tous les comptes, y compris les administrateurs, doivent saisir
leur mot de passe puis un code à 6 chiffres envoyé par e-mail ou leur code de
secours. Un administrateur peut activer ou désactiver cette exigence par
utilisateur ou pour tous les comptes depuis l'écran **Utilisateurs**. Quand la
double authentification est désactivée pour un compte, le mot de passe seul
suffit à ouvrir une session. Le code e-mail expire après 10 minutes, est
invalidé après 5 tentatives et son renvoi est limité à une fois par minute.
Les anciennes routes de connexion par code seul ne sont plus disponibles.

Pour activer l'envoi, créer `secrets/backend/smtp.json` avec les paramètres du
serveur SMTP :

```json
{
  "host": "smtp.example.com",
  "port": 587,
  "secure": false,
  "username": "compte-smtp",
  "password": "mot-de-passe-smtp",
  "from": "Kehoros <no-reply@example.com>"
}
```

Ce fichier contient un secret : ne pas le versionner. Au démarrage, Vault
l'importe dans `kehoros/backend/smtp`. Comme le script d'import est copié dans
l'image Vault, reconstruire Vault puis redémarrer le backend après avoir ajouté
ou modifié le fichier :

```bash
docker compose up -d --build vault
docker compose restart backend
```

Le port 465 requiert `secure: true`; le port 587 utilise généralement
`secure: false` avec STARTTLS. Si la configuration manque, la connexion
classique continue de fonctionner et la demande OTP renvoie une erreur
explicite.

Les codes de validation sont stockés temporairement en mémoire du backend :
ils sont invalidés au redémarrage et cette version doit être utilisée avec une
seule instance du backend. Une mise à l'échelle horizontale nécessite un
stockage partagé pour les challenges et les limites de renvoi.

Sur l'écran de vérification, l'utilisateur choisit entre le code envoyé par
e-mail et **Saisir un code de secours**. Un administrateur peut générer ce code
depuis l'écran **Utilisateurs** (icône de clé). Il est affiché une seule fois,
doit être transmis à l'utilisateur de manière sécurisée et ne fonctionne qu'une
fois. Le code précédent est invalidé à chaque génération. Seul son hash est
conservé en base.

Depuis cette liste, l'administrateur peut aussi définir un nouveau mot de passe
pour un utilisateur avec le bouton de cadenas. L'API `PATCH /users/:id/password`
reçoit `{ "password": "..." }`. Le mot de passe doit contenir 6 à 128 caractères
et est enregistré sous forme de hash.

En production, ajouter la colonne avant de déployer le backend :

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS recovery_code_hash varchar;
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_enabled boolean NOT NULL DEFAULT true;
```

## Réinitialisation du mot de passe

Depuis `/forgot-password`, l'utilisateur demande un code envoyé par e-mail,
puis le saisit avec son nouveau mot de passe sur `/reset-password`. L'API
utilise `POST /auth/password-reset/request` avec `{ "email": "..." }`, puis
`POST /auth/password-reset/confirm` avec `{ "email": "...", "code": "123456",
"newPassword": "..." }`. Le code expire après 10 minutes, est limité à cinq
tentatives et ne peut être utilisé qu'une fois. Comme les codes OTP de
connexion, les codes de réinitialisation sont conservés en mémoire et
nécessitent une configuration SMTP valide.

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For Questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
