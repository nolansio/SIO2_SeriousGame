const { Log } = require('@models');

exports.create = async (email) => {
    return await Log.create({
        email
    });
};
