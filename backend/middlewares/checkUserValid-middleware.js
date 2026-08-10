const { responseMessage } = require('../utils/error.js');
const { verifyToken } = require('../utils/utils.js');

const isCheckUser = (req, res, next) => {
  const { authorization } = req.headers;

  const token = authorization.split(' ')[1];
  const isVerified = verifyToken(token);

  if (!isVerified.valid) {
    return res.json(
      responseMessage('auth', 'Unauthorized access'),
    );
  }
  req.user = { email: isVerified.decoded.email };
  next();
};

module.exports = {
  isCheckUser,
};
