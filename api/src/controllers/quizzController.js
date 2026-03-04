const quizzService = require("@services/quizzService");

exports.createQuizz = async (req, res) => {
  if (!req.user.id || !req.body.title || !req.body.description) {
    return res
      .status(400)
      .json({ error: "Parameters 'title' and 'description' required" });
  }
  req.body.userId = req.user.id;
  try {
    const newQuizz = await quizzService.create(req.body);
    res.status(201).json(newQuizz);
  } catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.updateQuizz = async (req, res) => {
  if (
    !req.user.id ||
    !req.body.title ||
    !req.body.description ||
    !req.params.id
  ) {
    return res
      .status(400)
      .json({ error: "Parameters 'id', 'title' and 'description' required" });
  }
  req.body.id = req.params.id;
  req.body.userId = req.user.id;
  req.body.roleUser = req.user.role;
  try {
    const newQuizz = await quizzService.update(req.body);
    res.status(200).json(newQuizz);
  } catch (error) {
    if (error.message === "QUIZZ_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    } else if (error.message === "FORBIDDEN") {
      return res.status(403).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// exports.getUserById = async (req, res) => {
//   const user = await userService.findById(req.params.id);
//   if (!user) {
//     return res.status(404).json({ message: 'User not found' });
//   }
//   res.json(user);
// };
