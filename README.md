# Installation
npm install

# Récupération du JWT SECRET dans le .env.local
JWT_SECRET=xxxxxxxx

# Initialisation de la base de données, création et remplissage des tables
npm run init_db

# Lancement
npm run dev

# Suppression de la base
npx sequelize db:drop

# Création de la base
npx sequelize db:create

# Création des tables
npx sequelize-cli db:migrate

# Remplir les tables avec des données
npx sequelize db:seed:all

# Vider les tables
npx sequelize-cli db:seed:undo:all
