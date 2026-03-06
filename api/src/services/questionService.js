const { Question, Quiz } = require('@models');

exports.create = async (data, user) => {
    const quiz = await Quiz.findByPk(data.id, null);

    if (!quiz) {
        const error = new Error('Quiz not found');
        error.code = 'QUIZ_NOT_FOUND';

        throw error;
    }

    if (user.role === 'USER' && user.id !== quiz.userId) {
        const error = new Error('An user can only create a new question in his own quizzes');
        error.code = 'FORBIDDEN';

        throw error;
    }

    return await Question.create({
        quizId: data.id,
        title: data.title,
        answer: data.answer,
    });
};

exports.delete = async (id, currentUser) => {
    const question = await Question.findByPk(id, null);

    if (!question) {
        const error = new Error('Question not found');
        error.code = 'QUESTION_NOT_FOUND';

        throw error;
    }

    const quiz = await Quiz.findByPk(question.quizId, null);

    if (currentUser.role === 'USER' && currentUser.id !== quiz.userId) {
        const error = new Error('An user can only delete a question in his own quizzes',);
        error.code = 'FORBIDDEN';

        throw error;
    }

    await question.destroy();

    return question;
};

exports.update = async (data, user) => {
    const question = await Question.findByPk(data.id, null);

    if (!question) {
        const error = new Error('Question not found');
        error.code = 'QUESTION_NOT_FOUND';

        throw error;
    }

    const quiz = await Quiz.findByPk(question.quizId, null);

    if (user.role === 'USER' && user.id !== quiz.userId) {
        const error = new Error('An user can only update a question in his own quizzes',);
        error.code = 'FORBIDDEN';

        throw error;
    }

    await question.update(data);

    return question;
};
