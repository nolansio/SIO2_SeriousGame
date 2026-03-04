const { User, Quizz } = require("@models");

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

exports.create = async (data) => {
  const user = await User.findByPk(data.userId);
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
