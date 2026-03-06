const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Missing token' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
        if (error) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        req.user = payload;

        next();
    });
}

module.exports = authMiddleware;
