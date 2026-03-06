const questionService = require("@services/questionService");

exports.create = async (req, res) => {
    if (!req.body.title || typeof req.body.answer != 'boolean') {
        return res.status(400).json({ error: "Parameters 'title' and 'answer' required" });
    }

    req.body.id = req.params.id;

    try {
        const question = await questionService.create(req.body, req.user);
        res.status(201).json(question);
    } catch (error) {
        if (error.code === 'FORBIDDEN') {
            res.status(403).json({ error: error.message });
        } else if (error.code === 'NOT_FOUND') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

exports.delete = async (req, res) => {
    try {
        const question = await questionService.delete(req.params.id, req.user);
        res.status(200).json(question);
    } catch (error) {
        if (error.code === "FORBIDDEN") {
            res.status(403).json({ error: error.message });
        } else if (error.code === "NOT_FOUND") {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

exports.update = async (req, res) => {
    if (!req.body.title || typeof req.body.answer != 'boolean') {
        return res.status(400).json({ error: "Parameters 'title' and 'answer' required" });
    }

    req.body.id = req.params.id;

    try {
        const question = await questionService.update(req.body, req.user);
        res.status(200).json(question);
    } catch (error) {
        if (error.code === 'FORBIDDEN') {
            res.status(403).json({ error: error.message });
        } else if (error.code === 'NOT_FOUND') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

// exports.getUserById = async (req, res) => {
//   const user = await userService.findById(req.params.id);
//
//   if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//   }
//
//   res.json(user);
// };
