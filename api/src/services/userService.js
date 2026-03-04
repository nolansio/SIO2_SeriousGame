const { User, Quizz } = require("@models");

exports.delete = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    const error = new Error("User not found");
    error.code = "USER_NOT_FOUND";
    throw error;
  }
  await user.destroy();
  return user;
};
