module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('quiz', [
            {
                title: 'La guerre froide',
                description: 'Quiz sur la guerre froide',
                userId: 1,
                code: 'COLD-WAR-2026',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('quiz', null, {});
    }
};
