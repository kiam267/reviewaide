const authErrorMessage = (
  status = 'error',
  message = '',
  data = null,
) => {
  return {
    response: {
      status,
      message,
      data,
    },
  };
};

module.exports = {
  authErrorMessage,
};
