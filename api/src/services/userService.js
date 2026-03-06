const { User } = require('@models');

exports.delete = async (id, user) => {
    const target = await User.findByPk(id, null);

    if (!target) {
        const error = new Error('User not found');
        error.code = 'USER_NOT_FOUND';

        throw error;
    }

    if ((user.role !== 'ADMIN' && user.id !== id) || target.role === 'ADMIN') {
        const error = new Error('You are not allowed to delete this user');
        error.code = 'FORBIDDEN';

        throw error;
    }

    await target.destroy();

    return target;
};
