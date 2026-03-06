const {LogConnect} = require("@models");

exports.create = async (email) => {
    return await LogConnect.create({
        email
    });
};
