const quizService = require('@services/quizService');

exports.create = async (req, res) => {
    if (!req.user.id || !req.body.title || !req.body.description || !req.params.id) {
        return res.status(400).json({ error: "Parameters 'title' and 'description' required" });
    }

    req.body.userId = req.params.id;

    try {
        const quiz = await quizService.create(req.body, req.user);
        res.status(201).json(quiz);
    } catch (error) {
        if (error.code === 'USER_NOT_FOUND') {
            return res.status(404).json({ error: error.message });
        } else if (error.code === 'FORBIDDEN') {
            return res.status(403).json({ error: error.message });
        }

        res.status(500).json({ error: error.message });
    }
};

exports.update = async (req, res) => {
    if (!req.user.id || !req.body.title || !req.body.description || !req.params.id) {
        return res.status(400).json({ error: "Parameters 'id', 'title' and 'description' required" });
    }

    req.body.id = req.params.id;
    req.body.userId = req.user.id;
    req.body.roleUser = req.user.role;

    try {
        const quiz = await quizService.update(req.body);
        res.status(200).json(quiz);
    } catch (error) {
        if (error.code === 'QUIZ_NOT_FOUND') {
            return res.status(404).json({ error: error.message });
        } else if (error.code === 'FORBIDDEN') {
            return res.status(403).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

exports.get = async (req, res) => {
    try {
        const quiz = await quizService.get(req.params.id);
        res.status(200).json(quiz);
    } catch (error) {
        if (error.code === 'QUIZ_NOT_FOUND') {
            return res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

exports.delete = async (req, res) => {
    try {
        const quiz = await quizService.delete(req.params.id);
        res.status(200).json(quiz);
    } catch (error) {
        if (error.code === 'QUIZ_NOT_FOUND') {
            return res.status(404).json({ error: error.message });
        } else if (error.code === 'FORBIDDEN') {
            return res.status(403).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};
