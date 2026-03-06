const { User, Quizz, Question } = require("@models");

async function generateUniqueCode() {
  const datePart = Date.now().toString(36).slice(-4);
  const randomPart = Math.random().toString(36).substring(2, 4);
  const code = (datePart + randomPart).toUpperCase();

  const alreadyExists = await Quizz.findOne({ where: { code: code } });

  if (alreadyExists) {
    return generateUniqueCode(date);
  }
  return code;
}

exports.create = async (data, currentUser) => {
  const user = await User.findByPk(data.userId);
  if (currentUser.role === "USER" && currentUser.id != data.userId) {
    const error = new Error("An User can't create a Quizz for another User");
    error.code = "FORBIDDEN";
    throw error;
  }
  if (!user) {
    const error = new Error("User not found");
    error.code = "USER_NOT_FOUND";
    throw error;
  }
  data.code = await generateUniqueCode();
  const quizz = await Quizz.create(data);
  return quizz;
};

exports.update = async (data) => {
  const quizz = await Quizz.findByPk(data.id);
  if (!quizz) {
    const error = new Error("Quizz not found");
    error.code = "QUIZZ_NOT_FOUND";
    throw error;
  }
  if (data.roleUser === "USER" && data.userId !== quizz.userId) {
    const error = new Error("An User can only update his own quizzes");
    error.code = "FORBIDDEN";
    throw error;
  }
  await quizz.update(data);
  return quizz;
};

exports.getQuizz = async (id) => {
  const quizz = await Quizz.findByPk(id, {
    include: [
      {
        model: Question,
        as: "questions",
      },
    ],
  });
  if (!quizz) {
    const error = new Error("Quizz not found");
    error.code = "QUIZZ_NOT_FOUND";
    throw error;
  }
  return quizz;
};
