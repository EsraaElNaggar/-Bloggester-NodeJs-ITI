const jwt = require('jsonwebtoken');

module.exports = async function auth(req, res, next) {
    const token = await req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = await jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = await verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
}