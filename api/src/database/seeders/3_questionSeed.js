module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('question', [
            {
                title: 'La Guerre froide oppose les États-Unis et l’Union soviétique',
                answer: true,
                quizId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'La Guerre froide était une guerre avec beaucoup de combats directs entre les deux pays',
                answer: false,
                quizId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'La Guerre froide se termine en 1991',
                answer: true,
                quizId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('question', null, {});
    }

};
