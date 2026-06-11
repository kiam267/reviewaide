const { authErrorMessage } = require('../utils/error.js');
const { verifyToken } = require('../utils/utils.js');

const isCheckUser = (req, res, next) => {
  const token = req.headers.token;
  const isVerified = verifyToken(token);

  console.log(isVerified, token);

  if (!isVerified.valid) {
    return res.json(
      authErrorMessage('auth', 'Unauthorized access'),
    );
  }

  next();
};

module.exports = {
  isCheckUser,
};
