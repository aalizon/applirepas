# Déploiement sur o2switch

AppliRepas est prévue pour tourner sur l'offre mutualisée o2switch, via **cPanel → Setup Node.js App**
(Phusion Passenger). Aucun module natif n'est à compiler : la base SQLite utilise le module intégré
à Node.js (`node:sqlite`), d'où l'exigence **Node.js ≥ 22.5**.

## 1. Obtenir le paquet

**Option A — GitHub Actions (recommandé)** : à chaque push, le workflow `CI` produit l'artefact
`applirepas-o2switch.zip` (onglet *Actions* → dernière exécution → *Artifacts*).

**Option B — en local** :

```bash
npm ci
npm run package        # crée le dossier deploy/
cd deploy && zip -r ../applirepas-o2switch.zip .
```

Contenu du paquet :

```
app.js          ← fichier de démarrage
package.json    ← minimal, sans dépendance (ne pas lancer « Run NPM Install »)
app/            ← application compilée (server.js, node_modules, .next, public, drizzle)
```

> Le build est rangé dans `app/` car le sélecteur Node.js de CloudLinux refuse un dossier
> `node_modules` à la racine de l'application.

## 2. Créer l'application dans cPanel

1. (Optionnel) Créez un sous-domaine, par ex. `repas.mondomaine.fr`.
2. cPanel → **Setup Node.js App** → **Create Application** :
   - **Node.js version** : la plus récente proposée, **22.5 minimum**
   - **Application mode** : Production
   - **Application root** : `applirepas`
   - **Application URL** : `repas.mondomaine.fr`
   - **Application startup file** : `app.js`
3. Ajoutez les **variables d'environnement** :

   | Variable | Valeur |
   |---|---|
   | `APP_PASSWORD` | le mot de passe familial |
   | `SESSION_SECRET` | une longue chaîne aléatoire |
   | `DATABASE_PATH` | `/home/VOTRE_LOGIN/applirepas-data/applirepas.db` (**hors** du dossier de l'application) |
   | `NODE_NO_WARNINGS` | `1` |
   | `APP_TIMEZONE` | `Europe/Paris` (valeur par défaut) |

4. Enregistrez (**Create**), puis arrêtez l'application (**Stop App**) le temps de l'envoi des fichiers.

## 3. Envoyer les fichiers

- **Gestionnaire de fichiers cPanel** : ouvrez `~/applirepas`, envoyez `applirepas-o2switch.zip`,
  faites un clic droit → *Extract*, puis supprimez le zip.
- ou **SSH/rsync** (autorisez d'abord votre IP dans cPanel → *Autorisation SSH*) :

  ```bash
  rsync -az --delete deploy/ VOTRE_LOGIN@VOTRE_SERVEUR:~/applirepas/
  ```

Puis **Start App** (ou **Restart**). Au premier lancement, la base est créée, les migrations
s'appliquent et la bibliothèque de recettes est chargée ; l'assistant « Qui mange quand ? » s'ouvre.

## 4. Mises à jour

Renvoyez le nouveau paquet (en écrasant `app.js`, `package.json` et `app/`), puis **Restart**.
La base, stockée dans `~/applirepas-data/`, n'est jamais touchée ; les migrations s'appliquent
automatiquement au démarrage.

## 5. Sauvegardes

La base tient dans un seul fichier. Ajoutez une tâche **cPanel → Tâches Cron** quotidienne :

```bash
mkdir -p ~/applirepas-backup && cp ~/applirepas-data/applirepas.db ~/applirepas-backup/applirepas-$(date +\%u).db
```

(7 copies tournantes, une par jour de la semaine.) o2switch réalise aussi ses propres sauvegardes JetBackup.

## Dépannage

- **« No such built-in module: node:sqlite »** → la version de Node est trop ancienne : choisissez ≥ 22.5.
- **Erreur 503 / l'application ne démarre pas** → consultez `~/applirepas/stderr.log` et vérifiez
  que le fichier de démarrage est bien `app.js`.
- **Page de connexion en boucle** → vérifiez que le site est servi en **HTTPS** (certificat
  AutoSSL/Let's Encrypt de cPanel) : le cookie de session est marqué `Secure` en production.
