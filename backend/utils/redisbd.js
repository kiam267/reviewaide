const { Queue } = require('bullmq');
const password =
  process.env.AIVEN_PASSWORD || 'dummy_password_for_github';

const connectionRedis = {
  host: 'redis-3bd483dc-kiamhasan267-2de6.a.aivencloud.com',
  port: 26246, // IMPORTANT: should be number, not string
  username: 'default',
  password: 'AVNS_w_Y8mr85-XNX94mr9AL',
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
