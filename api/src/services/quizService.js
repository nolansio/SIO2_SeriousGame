const { User, Quiz, Question } = require('@models');

async function generateUniqueCode() {
    const datePart = Date.now().toString(36).slice(-4);
    const randomPart = Math.random().toString(36).substring(2, 4);
    const code = (datePart + randomPart).toUpperCase();

    const alreadyExists = await Quiz.findOne({
        where: { code }
    });

    if (alreadyExists) {
        return generateUniqueCode(date);
    }

    return code;
}

exports.create = async (data, user) => {
    const code = await generateUniqueCode();

    return await Quiz.create({
        title: data.title,
        answer: data.answer,
        code: code,
        userId: user.id
    });
};

exports.update = async (data) => {
    const quiz = await Quiz.findByPk(data.id, null);

    if (!quiz) {
        const error = new Error('Quiz not found');
        error.code = 'QUIZ_NOT_FOUND';

        throw error;
    }

    if (data.roleUser === 'USER' && data.userId !== quiz.userId) {
        const error = new Error('An user can only update his own quizzes');
        error.code = 'FORBIDDEN';

        throw error;
    }

    await quiz.update(data);

    return quiz;
};

exports.get = async (id) => {
    const quiz = await Quiz.findByPk(id, {
        include: [{
            model: Question,
            as: 'questions'
        }]
    });

    if (!quiz) {
        const error = new Error('Quiz not found');
        error.code = 'QUIZ_NOT_FOUND';

        throw error;
    }

    return quiz;
};

exports.delete = async (data) => {
    const quiz = await Quiz.findByPk(data.id, null);

    if (!quiz) {
        const error = new Error('Quiz not found');
        error.code = 'QUIZ_NOT_FOUND';

        throw error;
    }

    if (data.roleUser === 'USER' && data.userId !== quiz.userId) {
        const error = new Error('An User can only delete his own quizzes');
        error.code = 'FORBIDDEN';

        throw error;
    }

    await quiz.destroy();

    return quiz;
};
