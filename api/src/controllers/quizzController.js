const quizzService = require("@services/quizzService");

exports.createQuizz = async (req, res) => {
  if (!req.user.id || !req.body.title || !req.body.description || !req.params.id) {
    return res
      .status(400)
      .json({ error: "Parameters 'title' and 'description' required" });
  }
  
  req.body.userId = req.params.id;
  try {
    const newQuizz = await quizzService.create(req.body, req.user);
    res.status(201).json(newQuizz);
  } catch (error) {
    if (error.code === "USER_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    } else if (error.code === "FORBIDDEN") {
      return res.status(403).json({ error: error.message });
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
    if (error.code === "QUIZZ_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    } else if (error.code === "FORBIDDEN") {
      return res.status(403).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

exports.getQuizz = async (req, res) => {
  try {
    const newQuizz = await quizzService.getQuizz(req.params.id);
    res.status(200).json(newQuizz);
  } catch (error) {
    if (error.code === "QUIZZ_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

exports.deleteQuizz = async (req, res) => {
  try {
    const newQuizz = await quizzService.deleteQuizz(req.params.id);
    res.status(200).json(newQuizz);
  } catch (error) {
    if (error.code === "QUIZZ_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    } else if (error.code === "FORBIDDEN") {
      return res.status(403).json({ error: error.message });
    } else {
    	res.status(500).json({ error: error.message });
	  }
  }
};