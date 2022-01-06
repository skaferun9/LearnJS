const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('authorization');
   
    if (!authHeader) {
        const err = new Error('Not Authenticated')
        err.statusCode = 422;
        throw err;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'SUPERSECRET!!')
    } catch (err) {
        err.statusCode = 500;
        throw err
    }
    if (!decodedToken) {
        const err = new Error('Not Authenticated');
        err.statusCode = 422;
        throw err;
    }
    req.userId = decodedToken.userId;

    next();
};