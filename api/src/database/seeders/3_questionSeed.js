module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('question', [
            {
                enonce: 'La Guerre froide oppose les États-Unis et l’Union soviétique',
                reponse: true,
                quizzId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                enonce: 'La Guerre froide était une guerre avec beaucoup de combats directs entre les deux pays',
                reponse: false,
                quizzId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                enonce: 'La Guerre froide se termine en 1991',
                reponse: true,
                quizzId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('question', null, {});
    }

};
