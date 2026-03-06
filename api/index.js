const express = require('express');
const cors = require('cors');
const app = express();

require('module-alias/register');

const dbConnection = require('@config/dbConnection');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('@config/swagger');

const swaggerOptions = {
    swaggerOptions: {
        persistAuthorization: true
    }
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', true);

app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

app.use('/api', require('@routes/authRoutes'));
app.use('/api', require('@routes/userRoutes'));
app.use('/api', require('@routes/authRoutes'));
app.use('/api', require('@routes/quizRoutes'));
app.use('/api', require('@routes/questionRoutes'));

app.get('/', (req, res) => {
    res.send('Hello World !');
});

async function startServer() {
    try {
        await dbConnection.authenticate();

        let protocol = 'https';

        const host = process.env.DB_HOST;
        const port = process.env.PORT;

        if (host === 'localhost' || host === '127.0.0.1') {
            protocol = 'http';
        }

        app.listen(port, host, () => console.log(`Serveur lancé sur ${protocol}://${host}:${port}`));
    } catch (error) {
        console.error('Connexion impossible: ', error);
    }
}

startServer();

module.exports = app;
