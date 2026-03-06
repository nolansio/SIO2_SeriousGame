const { User } = require('@models');

exports.delete = async (id, currentUser) => {
    const user = await User.findByPk(id, null);

    if (currentUser.role === 'USER' && currentUser.id !== id) {
        const error = new Error('You can only delete your own account');
        error.code = 'FORBIDDEN_DELETE_USER';

        throw error;
    }

    if (user.role === 'ADMIN') {
        const error = new Error("This user is an admin, you're not allowed to delete this account",);
        error.code = 'FORBIDDEN_DELETE_USER';

        throw error;
    }

    if (!user) {
        const error = new Error('User not found');
        error.code = 'USER_NOT_FOUND';

        throw error;
    }

    await user.destroy();

    return user;
};
