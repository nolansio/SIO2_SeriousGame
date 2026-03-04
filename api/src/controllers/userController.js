const userService = require("@services/userService");

exports.deleteUser = async (req, res) => {
  try {
    const user = await userService.delete(req.params.id);
    user.password = undefined;
    res.status(200).json(user);
  } catch (error) {
    if (error.code === "USER_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

// exports.getUserById = async (req, res) => {
//   const user = await userService.findById(req.params.id);
//   if (!user) {
//     return res.status(404).json({ message: 'User not found' });
//   }
//   res.json(user);
// };
