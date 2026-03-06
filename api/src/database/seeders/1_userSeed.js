module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('user', [
            {
                email: 'user@example.com',
                password: '$2b$10$VSwa07WA8TEqTLdblotJ2uPUw1ubCOeNmK0wCkokO8qSskiAQccvu', // TODO: Corriger hash
                role: 'USER'
            },
            {
                email: 'root@example.com',
                password: '$2b$10$l40PryMfw8Hq48vDZMKeU.yJvIY2LsDSbkyzmHu5ItwTpzQQOeJgK', // TODO: Corriger hash
                role: 'ADMIN'
            }
        ]);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('user', null, {});
    }
};
