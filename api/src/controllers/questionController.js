const questionService = require("@services/questionService");

exports.createQuestion = async (req, res) => {
    if (!req.body.enonce || typeof req.body.reponse != "boolean") {
        return res
            .status(400)
            .json({ error: "Parameters 'enonce' and 'reponse' required" });
    }
    req.body.id = req.params.id;
    try {
        const newQuestion = await questionService.create(req.body, req.user);
        res.status(201).json(newQuestion);
    } catch (error) {
        if (error.code === "FORBIDDEN") {
            res.status(403).json({ error: error.message });
        } else if (error.code === "QUIZZ_NOT_FOUND") {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        const question = await questionService.delete(req.params.id, req.user);
        res.status(200).json(question);
    } catch (error) {
        if (error.code === "FORBIDDEN") {
            res.status(403).json({ error: error.message });
        } else if (error.code === "QUESTION_NOT_FOUND") {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

exports.updateQuestion = async (req, res) => {
    if (!req.body.enonce || typeof req.body.reponse != "boolean") {
        return res
            .status(400)
            .json({ error: "Parameters 'enonce' and 'reponse' required" });
    }
    req.body.id = req.params.id;
    try {
        const question = await questionService.update(req.body, req.user);
        res.status(200).json(question);
    } catch (error) {
        if (error.code === "FORBIDDEN") {
            res.status(403).json({ error: error.message });
        } else if (error.code === "QUESTION_NOT_FOUND") {
            res.status(404).json({ error: error.message });
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
