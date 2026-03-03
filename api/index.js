const express = require('express');
const cors = require('cors');
const app = express();

require("module-alias/register");

require("dotenv").config();
const port = process.env.PORT;
const host = process.env.DB_HOST;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route simple
app.get('/', (req, res) => {
    res.send('Hello World !');
});

// Lancement du serveur
app.listen(port, host, () => {
    console.log('Serveur lancé sur http://localhost:3000');
});

module.exports = app;
