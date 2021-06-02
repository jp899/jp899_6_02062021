const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
  try {
    //   on récupere le token dans le header (forme "Bearer <token>" à parser)
    const token = req.headers.authorization.split(' ')[1];
    // On décode le token pour récupérer le user encrypté dedans
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    // On controle le user décrypté par rapport au userID fourni dans la requette
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};