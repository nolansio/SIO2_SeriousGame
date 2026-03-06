# Serious Game

## Présentation

Un serious game est un jeu éducatif, dans le sens où il permet d'apprendre ou de réviser de façon ludique.
L'objectif de ce projet est de créer une application à destination des enseignants du lycée et de leurs élèves.
L'application devra permettre aux enseignants de préparer des quiz pour faire réviser leurs élèves en début ou fin de cours

- Ce projet est réalisé en équipe de trois dans notre cadre de l'apprentissage dans le BTS SIO.
Le projet est divisé en trois dossiers distincts, l'API, le jeu et l'interface de gestion des données.

---

## Technologies utilisées
- **API** : Node.js (Express)
- **Interface** : Angular
- **Jeu** : Phaser (Vite)
- **Base de données** : MySQL
- **Sécurité** : JWT Bearer (bcrypt)
- **Documentation** : Swagger
- **Environnement** : WSL2

---

## Cloner le dépôt
```bash
git clone https://github.com/nolansio/SIO2_SeriousGame.git serious_game
cd serious_game
```

---

## API

### Prérequis
- Node.js 24
- Express
- MySQL

### 1. Installer les dépendances
```bash
cd api
npm install
```

### 2. Générer la clé JWT
```bash
cd api
JWT_SECRET=$(openssl rand -base64 12)
touch .env.local
echo "JWT_SECRET=$JWT_SECRET" >> .env.local
```

### 3. Initialiser la base de données
```bash
npm run init_db
```

### 4. Lancer l'API
```bash
npm run dev
```

## Interface

### Prérequis
- Node.js 24
- Express

### 1. Installer les dépendances
```bash
cd admin
npm install
```

> À compléter

## Jeu

### Prérequis
- Phaser 3
- Vite

### 1. Installer les dépendances
```bash
cd game
# À compléter
```

> À compléter

## Accéder aux services
- **API** : http://localhost:3000
- **Jeu** : À compléter
- **Interface** : À compléter
- **Documentation API** : http://localhost:3000/api/doc
