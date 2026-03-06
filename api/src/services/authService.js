const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Quizz, Question } = require("@models");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

exports.register = async (email, password, role = "USER") => {
    const existing = await User.findOne({
        where: { email },
    });

    if (existing) {
        const error = new Error("Email déjà utilisé");
        error.code = "EMAIL_ALREADY_USED";

        throw error;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, role });

    return { id: user.id, email: user.email, role: user.role };
};

exports.login = async (email, password) => {
    const user = await User.findOne({
        where: { email },
    });

    if (!user) {
        const error = new Error("Invalid credentials");
        error.code = "INVALID_CREDENTIALS";

        throw error;
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        const error = new Error("Invalid credentials");
        error.code = "INVALID_CREDENTIALS";

        throw error;
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN },
    );

    return {
        access_token: token,
        token_type: "Bearer",
        expires_in: JWT_EXPIRES_IN,
    };
};

exports.myself = async (email) => {
    const user = await User.findOne({
        where: { email },
        include: [
            {
                model: Quizz,
                as: "quizzes",
                include: [
                    {
                        model: Question,
                        as: "questions",
                    },
                ],
            },
        ],
    });

    if (!user) {
        const error = new Error("Identifiants invalides");
        error.code = "INVALID_CREDENTIALS";

        throw error;
    }

    return user;
};
