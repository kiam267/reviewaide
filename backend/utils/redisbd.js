const { Queue } = require('bullmq');
const password =
  process.env.AIVEN_PASSWORD || 'dummy_password_for_github';

const connectionRedis = {
  host: process.env.AIVEN_PASSWORD,
  port: 26246, // IMPORTANT: should be number, not string
  username: AIVEN_PASSWORD,
  password: AIVEN_PASSWORD,
};

const queueINIT = name => {
  const queue = new Queue(name, {
    connection: connectionRedis,
  });

  return queue;
};

module.exports = {
  queueINIT,
};
