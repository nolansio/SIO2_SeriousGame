require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const authService = require('@services/authService');
const LogConnectService = require('@services/logConnectService');
const logAttempts = {};

exports.register = async (req, res) => {
    const {attempts, duration} = failedLogAttempt(req.ip);

    if (attempts >= 3) {
        return res.status(429).json({error: `Too many requests, try again in ${duration} seconds`});
    }

    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({error: "Parameters 'email' and 'password' required"});
        }

        const user = await authService.register(email, password);

        return res.status(201).json(user);
    } catch (error) {
        if (error.code === 'EMAIL_ALREADY_USED') {
            return res.status(409).json({error: error.message});
        } else {
            return res.status(500).json({error: error.message});
        }
    }
};

exports.login = async (req, res) => {
    const {attempts, duration} = failedLogAttempt(req.ip);

    if (attempts >= 3) {
        return res.status(429).json({error: `Too many requests, try again in ${duration} seconds`});
    }

    const {email, password} = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({error: "Parameters 'email' and 'password' required"})
        }

        const tokenData = await authService.login(email, password);

        return res.json(tokenData);
    } catch (error) {
        if (error.code === 'INVALID_CREDENTIALS') {
            if (email) {
                LogConnectService.create(email);
            }

            return res.status(401).json({error: error.message});
        } else {
            return res.status(500).json({error: error.message});
        }
    }
};

exports.myself = async (req, res, next) => {
    try {
        const userData = await authService.myself(req.user.email);

        return res.json(userData);
    } catch (error) {
        if (error.code === 'INVALID_CREDENTIALS') {
            return res.status(401).json({error: error.message});
        } else {
            return res.status(500).json({error: error.message});
        }
    }
};

function failedLogAttempt(ip) {
    const now = Date.now();

    const initial = process.env.INITIAL_ATTEMPS * 1000;
    const max = process.env.MAX_ATTEMPS * 1000;

    refreshLogAttempt();

    if (!logAttempts[ip]) {
        logAttempts[ip] = {
            count: 1,
            timestamp: now,
            duration: initial
        };
    } else if (now - logAttempts[ip].timestamp > logAttempts[ip].duration) {
        logAttempts[ip] = {
            count: 1,
            timestamp: now,
            duration: initial
        };
    } else {
        logAttempts[ip].count += 1;

        if (logAttempts[ip].count > 3) {
            logAttempts[ip].duration = Math.min(logAttempts[ip].duration * 2, max);
        }

        logAttempts[ip].timestamp = now;
    }

    return {
        attempts: logAttempts[ip].count,
        duration: Math.ceil(logAttempts[ip].duration / 1000)
    };
}

function refreshLogAttempt() {
    const now = Date.now();
    for (const ip in logAttempts) {
        if (now - logAttempts[ip].timestamp > logAttempts[ip].duration) {
            delete logAttempts[ip];
        }
    }
}
