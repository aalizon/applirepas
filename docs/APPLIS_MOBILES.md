# Applications mobiles (Android et iOS)

AppliRepas a besoin de son serveur : la base SQLite et les traitements se trouvent sur votre
instance (o2switch, Docker…). Les applications mobiles sont donc des **coquilles natives**
([Capacitor](https://capacitorjs.com/)) qui ouvrent votre instance en plein écran, avec une
vraie icône, un écran de démarrage et une page « Pas de connexion » quand le serveur est injoignable.
Toute la famille partage les mêmes menus et la même liste de courses, que ce soit depuis
l'appli, le téléphone ou l'ordinateur.

Il faut donc que l'appli soit d'abord **déployée** (voir [DEPLOIEMENT_O2SWITCH.md](DEPLOIEMENT_O2SWITCH.md))
et accessible en **https**.

| | Android | iPhone / iPad |
|---|---|---|
| **Le plus simple** | Chrome → menu ⋮ → *Installer l'application* (PWA) | Safari → Partager → *Sur l'écran d'accueil* (PWA) |
| **Application native** | APK produit par GitHub Actions, à installer directement | Projet Xcode à compiler sur un Mac (compte Apple requis) |

## Android : l'APK

### 1. Indiquer l'adresse de votre instance

Sur GitHub : **Settings → Secrets and variables → Actions → onglet Variables → New repository
variable** :

- Nom : `APP_URL`
- Valeur : l'adresse de votre instance, par ex. `https://repas.mondomaine.fr`

### 2. Lancer la compilation

Onglet **Actions → Applis mobiles → Run workflow** (le workflow se relance aussi seul quand le
dossier `mobile/` change). Au bout de 5 minutes environ, téléchargez l'artefact
**applirepas-android** : il contient `applirepas.apk`.

### 3. Installer sur le téléphone

Envoyez l'APK sur le téléphone (Drive, mail, câble), ouvrez-le et autorisez l'installation
depuis cette source quand Android le demande (*Installer des applis inconnues*). Au premier
lancement, connectez-vous avec le mot de passe familial : la session est conservée un an.

### APK signé (recommandé si vous gardez l'appli)

Sans clé de signature, le workflow produit un APK *debug* : à chaque nouvelle version, il faut
désinstaller l'ancienne avant d'installer la nouvelle. Les données ne sont pas perdues, puisqu'elles
sont sur le serveur, mais il faut se reconnecter. Avec votre propre clé, les mises à jour
s'installent par-dessus :

```bash
keytool -genkeypair -keystore applirepas.jks -alias applirepas -keyalg RSA -keysize 2048 -validity 10000
base64 -w0 applirepas.jks > applirepas.jks.b64    # sur macOS : base64 -i applirepas.jks
```

Puis ajoutez les **secrets** du dépôt (*Settings → Secrets and variables → Actions → Secrets*) :

| Secret | Valeur |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | contenu du fichier `applirepas.jks.b64` |
| `ANDROID_KEYSTORE_PASSWORD` | mot de passe du keystore |
| `ANDROID_KEY_ALIAS` | `applirepas` |
| `ANDROID_KEY_PASSWORD` | mot de passe de la clé |

> Gardez `applirepas.jks` en lieu sûr et ne le versionnez jamais : sans lui, impossible de
> publier une mise à jour par-dessus l'appli installée.

### Compiler en local (facultatif)

Avec Node.js ≥ 22, un JDK 21 et le SDK Android (Android Studio) :

```bash
cd mobile
npm ci
npm run android:init                                   # une seule fois : crée mobile/android/
APP_URL=https://repas.mondomaine.fr npm run android:apk
# → mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

## iPhone / iPad

### Solution simple : l'appli web installée (PWA)

Ouvrez votre instance dans **Safari**, touchez **Partager → Sur l'écran d'accueil**. AppliRepas
s'ouvre alors en plein écran avec son icône, comme une appli, et la liste de courses reste
consultable hors ligne. C'est la solution conseillée pour un usage familial.

### Application native (Xcode)

Apple n'autorise l'installation d'applications que via l'App Store, TestFlight ou Xcode. Il faut :

- un **Mac** avec Xcode ;
- un **identifiant Apple**. Avec un compte gratuit, l'appli installée depuis Xcode expire au bout
  de 7 jours. Avec l'Apple Developer Program (99 €/an), elle dure un an et la distribution par
  TestFlight devient possible.

```bash
cd mobile
npm ci
npm run ios:init                                        # une seule fois : crée mobile/ios/
APP_URL=https://repas.mondomaine.fr npm run ios:open    # ouvre le projet dans Xcode
```

Dans Xcode : cible **App → Signing & Capabilities**, choisissez votre équipe (*Team*), branchez
l'iPhone, puis **Run** ▶. Sur l'iPhone, autorisez le développeur dans *Réglages → Général → VPN et
gestion de l'appareil*.

> Une publication sur l'App Store serait probablement refusée : Apple rejette les applications
> qui ne font qu'afficher un site web (règle 4.2). Pour un usage familial, la PWA ou TestFlight
> suffisent.

## Bon à savoir

- **Identifiant de l'appli** : `fr.applirepas.app`. Il se change avec la variable `APP_ID` au
  moment de `npm run android:init` / `ios:init`.
- **Serveur local** (NAS, Raspberry Pi) en `http://` : accepté, mais la connexion n'est pas
  chiffrée. Préférez le https.
- **Icônes et écran de démarrage** : générés depuis le logo par `npm run assets`
  (`mobile/scripts/render-icons.mjs`).
- Les liens externes (sources des recettes, crédits photo) s'ouvrent dans le navigateur du téléphone.
- Les dossiers `mobile/android/` et `mobile/ios/` sont générés et ne sont pas versionnés. Si vous
  les personnalisez à la main, retirez-les de `mobile/.gitignore` pour les versionner.
