const responseMessage = (
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
  responseMessage,
};
