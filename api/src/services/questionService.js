const { Question, Quizz } = require("@models");

exports.create = async (data, currentUser) => {
    const quizz = await Quizz.findByPk(data.id);
    if (!quizz) {
        const error = new Error("Quizz not found");
        error.code = "QUIZZ_NOT_FOUND";
        throw error;
    }
    if (currentUser.role === "USER" && currentUser.id !== quizz.userId) {
        const error = new Error(
            "An User can only create a new Question in his own Quizzes",
        );
        error.code = "FORBIDDEN";
        throw error;
    }
    const question = await Question.create({
        quizzId: data.id,
        enonce: data.enonce,
        reponse: data.reponse,
    });
    return question;
};

exports.delete = async (id, currentUser) => {
    const question = await Question.findByPk(id);
    if (!question) {
        const error = new Error("Question not found");
        error.code = "QUESTION_NOT_FOUND";
        throw error;
    }
    const quizz = await Quizz.findByPk(question.quizzId);
    if (currentUser.role === "USER" && currentUser.id !== quizz.userId) {
        const error = new Error(
            "An User can only delete a Question in his own Quizzes",
        );
        error.code = "FORBIDDEN";
        throw error;
    }
    await question.destroy();
    return question;
};

exports.update = async (data, currentUser) => {
    const question = await Question.findByPk(data.id);
    if (!question) {
        const error = new Error("Question not found");
        error.code = "QUESTION_NOT_FOUND";
        throw error;
    }
    const quizz = await Quizz.findByPk(question.quizzId);
    if (currentUser.role === "USER" && currentUser.id !== quizz.userId) {
        const error = new Error(
            "An User can only update a Question in his own Quizzes",
        );
        error.code = "FORBIDDEN";
        throw error;
    }
    await question.update(data);
    return question;
};
