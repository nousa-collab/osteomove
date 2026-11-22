# OsteoMove

Application éducative de mouvement et de suivi pour les personnes concernées par l’ostéoporose. Le dépôt contient le frontend React/Vite et une API Express/MongoDB.

## Architecture

- `src/` : React, TypeScript, Tailwind CSS, graphiques Recharts.
- `server/src/` : API REST Express, MongoDB/Mongoose, authentification et envoi d’e-mails.
- Authentification : mots de passe hachés avec bcrypt (12 rounds), JWT conservé dans un cookie `HttpOnly`, `SameSite=Lax`, limitation des tentatives et validation serveur.
- Suivi : historique des séances et objectifs enregistrables dans le compte via `/api/progress`. Le stockage local reste disponible en mode hors connexion.
- Contact : envoi SMTP via `/api/contact` (configuration requise).
- Vidéos : la page présente des ressources réelles de NHS, Royal Osteoporosis Society et Bone Health & Osteoporosis Foundation. Les aperçus de vidéos individuelles restent volontairement en attente tant que leurs droits d’intégration et leur validation clinique spécifique ne sont pas établis.

## Prérequis

- Node.js 18+
- MongoDB local ou MongoDB Atlas
- Un serveur SMTP pour activer le formulaire de contact

## Installation

### 1. Frontend

À la racine du projet :

```bash
npm install
cp .env.example .env
npm run dev
```

Le frontend démarre sur `http://localhost:5173`.

### 2. Backend

Dans un deuxième terminal :

```bash
cd server
npm install
cp .env.example .env
```

Renseignez dans `server/.env` :

- `MONGODB_URI` : URL de votre base MongoDB.
- `JWT_SECRET` : secret aléatoire d’au moins 32 caractères.
- `CLIENT_ORIGIN=http://localhost:5173`.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` : paramètres SMTP.
- `CONTACT_TO` : adresse qui recevra les messages du formulaire.

Puis démarrez l’API :

```bash
npm run dev
```

L’API est disponible sur `http://localhost:4000/api`. Vérifiez son état avec `GET /api/health`.

## Fonctionnalités réalisées

### Authentification

- Création de compte et connexion réellement vérifiées par le serveur.
- Hachage bcrypt, cookie de session HttpOnly et déconnexion serveur.
- Le mot de passe n’est jamais stocké dans `localStorage`.
- Minimum 10 caractères pour les nouveaux mots de passe.

### Vidéos

Les pages des organismes de santé sont ouvertes sur leurs sites d’origine :

- NHS – Pilates pour les personnes ayant une ostéoporose : https://www.nhs.uk/live-well/exercise/pilates-and-yoga/osteoporosis-pilates-exercise-video/
- Royal Osteoporosis Society – exercices d’équilibre : https://theros.org.uk/information-and-support/exercise/exercise-to-help-your-balance/
- Bone Health & Osteoporosis Foundation – mouvements sûrs : https://www.bonehealthandosteoporosis.org/patients/fracturesfall-prevention/safe-movement-exercise-videos/

Ces ressources ne constituent pas une validation médicale personnalisée. Avant de mettre en ligne une vidéo intégrée dans le lecteur de chaque exercice, il faut obtenir les droits nécessaires et la validation d’un professionnel compétent.

### Suivi

- Statistiques hebdomadaires et tendance sur quatre semaines.
- Objectifs personnalisables.
- Historique des séances.
- Synchronisation des objectifs et séances avec MongoDB lorsqu’une session valide est active ; stockage local de secours.

### Contact

Le formulaire transmet le message via SMTP. Il ne confirme l’envoi que lorsque le serveur SMTP a accepté le message. Sans paramètres SMTP valides, l’API renvoie une erreur de configuration.

## Sécurité et déploiement

Avant toute mise en production :

1. Utilisez HTTPS et définissez `NODE_ENV=production`.
2. Remplacez `JWT_SECRET` par un secret fort unique.
3. Configurez les domaines autorisés dans `CLIENT_ORIGIN` et les paramètres de cookie selon le domaine de déploiement.
4. Ajoutez une politique de confidentialité, une procédure de suppression de compte et, si nécessaire, une vérification d’adresse e-mail et une réinitialisation de mot de passe.
5. Configurez un fournisseur SMTP fiable et surveillez les erreurs d’envoi.
6. Faites valider les contenus et exercices par un professionnel de santé. OsteoMove ne remplace pas un avis médical.

## Scripts

À la racine : `npm run dev`, `npm run build`, `npm run dev:api`, `npm run build:api`.
Dans `server/` : `npm run dev`, `npm run build`, `npm start`.
