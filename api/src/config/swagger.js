const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Serious Game API',
            version: '1.0.0',
            description: 'API du Serious Game',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            responses: {
                TokenMissing: {
                    description: 'Token invalide',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: {
                                        type: 'string',
                                    },
                                },
                            },
                            examples: {
                                missingToken: {
                                    summary: 'Token manquant',
                                    value: {
                                        error: 'Missing token',
                                    },
                                },
                                tokenDenied: {
                                    summary: 'Token invalide',
                                    value: {
                                        error: 'Invalid token',
                                    },
                                },
                            },
                        },
                    },
                },
                ErrorRole: {
                    description: "Route non autorisée pour l'Utilisateur actuel",
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: {
                                        type: 'string',
                                        example: 'Access denied',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        servers: [
            {
                url: '/api',
                description: 'API base path',
            },
        ],
    },
    apis: ['./src/routes/*.js', './src/models/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
