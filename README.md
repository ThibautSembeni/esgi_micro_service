# Projet de Micro-service

Ce projet contient deux applications Nest.js : `auth-api`, `user-api`, `account-api` et `transaction-api`. Avant de les démarrer, assurez-vous d'exécuter le fichier `export.sh` situé dans le dossier `proto` à la racine du projet.

## Configuration préalable

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- [Node.js](https://nodejs.org) (version recommandée : >= 18.x.x)
- [npm](https://www.npmjs.com) (version recommandée : >= 9.x.x)

## Instructions de démarrage

### Étape 1: Démarrer Docker

```bash
docker network create grpc-bank_default
```

Exécutez la commande suivante pour démarrer les conteneurs Docker :

```shell
docker compose up -d mariadb mongo tracing
```

Cela lancera les services du projet sous docker.

### Étape 2: Exécution du fichier `export.sh`

Avant de lancer les applications Nest.js, vous devez exécuter le fichier `export.sh` situé dans le dossier `proto`. Assurez-vous d'être à la racine du projet et exécutez la commande suivante :

```shell
./proto/export.sh
```

Cela configurera l'environnement nécessaire pour les API.

### Étape 3: Lancement de `auth-api`

Pour lancer l'application `auth-api`, suivez ces étapes :

1. Accédez au dossier auth-api :

```shell
cd auth-api
```

2. Installez les dépendances :

```shell
npm install
```

3. Démarrez l'application en mode développement :

```shell
npm run start:dev
```

L'application `auth-api` sera alors accessible à l'adresse `http://localhost:4003`.

### Étape 4: Lancement de user-api

Pour lancer l'application user-api, suivez ces étapes :

1. Accédez au dossier user-api :

```shell
cd user-api
```

2. Installez les dépendances :

```shell
npm install
```

3. Démarrez l'application en mode développement :

```shell
npm run start:dev
```

L'application `user-api` sera alors accessible à l'adresse `http://localhost:4002`.

### Étape 5: Lancement de account-api

Pour lancer l'application account-api, suivez ces étapes :

1. Accédez au dossier account-api :

```shell
cd account-api
```

2. Installez les dépendances :

```shell
npm install
```

3. Démarrez l'application en mode développement :

```shell
npm run start:dev
```

L'application `account-api` sera alors accessible à l'adresse `http://localhost:4004`.

### Étape 6: Lancement de transaction-api

Pour lancer l'application transaction-api, suivez ces étapes :

1. Accédez au dossier transaction-api :

```shell
cd transaction-api
```

2. Installez les dépendances :

```shell
npm install
```

3. Démarrez l'application en mode développement :

```shell
npm run start:dev
```

L'application `transaction-api` sera alors accessible à l'adresse `http://localhost:4005`.

### Étape 7: Jouer les migrations avec Prisma

Avant de commencer à utiliser les API, vous devez jouer les migrations de base de données en utilisant Prisma. Assurez-vous d'être dans chaque dossier respectif (`auth-api`, `user-api`, `account-api` et `transaction-api`) et exécutez la commande suivante :

```shell
npx prisma migrate dev
```

Cela exécutera les migrations nécessaires pour configurer la base de données.

### Modification des Stubs et des Proto

Si vous souhaitez apporter des modifications aux stubs ou aux fichiers proto, il est essentiel de les effectuer dans le dossier `proto` à la racine du projet. Suivez les étapes ci-dessous pour vous assurer que les modifications sont prises en compte correctement :

1. Accédez au dossier `proto` à la racine du projet.

2. Effectuez les modifications nécessaires aux fichiers stubs ou proto en fonction de vos besoins.

3. Une fois les modifications terminées, exécutez le script `export.sh` en suivant les instructions ci-dessous :

   - Assurez-vous d'être dans le dossier `proto`.
   - Exécutez la commande suivante :

     ```shell
     bash export.sh
     ```

     Cette commande mettra à jour les fichiers et configurations nécessaires pour prendre en compte les modifications apportées aux stubs et aux fichiers proto.

Il est crucial d'exécuter le script `export.sh` après chaque modification des stubs ou des proto afin que les changements soient correctement intégrés dans le projet.

Veillez à respecter cette procédure pour éviter tout problème de compatibilité ou de fonctionnement incorrect des services.

## Automatisation avec Docker et GitHub Actions

Ce projet est entièrement automatisé avec Docker et GitHub Actions pour simplifier le processus de déploiement et de gestion des micro-services.

### Docker et Images personnalisées

Nous utilisons Docker pour la conteneurisation de nos micro-services. Chaque micro-service est encapsulé dans un conteneur Docker, ce qui facilite le déploiement et la gestion de l'infrastructure.

De plus, nous avons créé des images Docker personnalisées pour nos micro-services. Ces images sont générées à l'aide de GitHub Actions pour garantir la cohérence et la reproductibilité du processus de construction.

### GitHub Actions

GitHub Actions est utilisé pour automatiser le processus de génération des images Docker personnalisées et pour le déploiement des micro-services. Les workflows GitHub Actions sont configurés pour surveiller les modifications du code source et déclencher automatiquement la construction et le déploiement des images Docker à chaque push sur la branche principale.

### Déploiement avec Docker Compose

Pour démarrer l'ensemble du projet avec toutes les images Docker, il vous suffit d'utiliser la commande suivante :

```shell
docker-compose up -d
```

## Modification des Protobufs via Buf Schema Registry

Nous utilisons Buf Schema Registry pour gérer les fichiers Protobuf de ce projet. Buf est un gestionnaire de fichiers protobuf qui facilite la gestion des versions, la validation et la manipulation des fichiers .proto.

### Accès à Buf Schema Registry

Vous pouvez accéder au registre des fichiers Protobuf via le lien suivant : [https://buf.build/thibaut/bankapi](https://buf.build/thibaut/bankapi).

## Observabilité avec OpenTelemetry et Jaeger

Ce projet utilise OpenTelemetry pour l'observabilité des micro-services. Jaeger est utilisé comme backend de trace pour la collecte et la visualisation des données de traces.

### Observabilité

Pour utiliser Jaeger avec OpenTelemetry, suivez les étapes ci-dessous :

1. Assurez-vous que Jaeger est installé et configuré localement ou à l'adresse spécifiée.

2. Vérifiez que les micro-services ont été configurés pour exporter les données de traces vers Jaeger en utilisant les paramètres appropriés dans les configurations OpenTelemetry.

### Accès à Jaeger

Une fois les micro-services en cours d'exécution, vous pouvez accéder à l'interface Jaeger à l'adresse suivante : [http://localhost:16686/](http://localhost:16686/).

Cette interface vous permet de visualiser les traces générées par les micro-services et d'effectuer des analyses et des investigations plus approfondies.

### Conclusion

Assure-toi de bien exécuter le fichier `export.sh` avant de lancer les applications Nest.js. Et n'oublie pas de jouer les migrations avec Prisma avant de commencer à utiliser les API.
