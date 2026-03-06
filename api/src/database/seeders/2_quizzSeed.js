module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("quizz", [
            {
                title: "La guerre froide",
                description: "Quizz sur la guerre froide",
                userId: 1,
                code: "COLD-WAR-2026",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("quizz", null, {});
    }
};
