const express = require('express');
const cors = require('cors');
const app = express();

require("module-alias/register");
const dbConnection = require("@config/dbConnection");

require("dotenv").config();
const port = process.env.PORT;
const host = process.env.DB_HOST;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send('Hello World !');
});

async function startServer() {
    try {
        await dbConnection.authenticate();
        let prefix = 'https://'

        if (host === 'localhost' || host === '127.0.0.1') {
            prefix = 'http://'
        }

        app.listen(port, host, () => console.log(`Serveur lancé sur ${prefix}${host}:${port}`));
    } catch (err) {
        console.error("Unable to connect:", err);
    }
}
startServer();

module.exports = app;
