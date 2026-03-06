const userService = require('@services/userService');

exports.delete = async (req, res) => {
    try {
        const user = await userService.delete(req.params.id, req.user);
        user.password = undefined;

        res.status(200).json(user);
    } catch (error) {
        if (error.code === 'FORBIDDEN') {
            return res.status(403).json({ error: error.message });
        }

        if (error.code === 'USER_NOT_FOUND') {
            return res.status(404).json({ error: error.message });
        }

        return res.status(error.status || 500).json({ error: error.message });
    }
};

// exports.getUserById = async (req, res) => {
//   const user = await userService.findById(req.params.id);
//   if (!user) {
//     return res.status(404).json({ error: 'User not found' });
//   }
//   res.json(user);
// };
