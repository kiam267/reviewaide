require('dotenv').config();
const { Queue } = require('bullmq');


const connectionRedis = {
  host: process.env.VALKEY_HOST,
  port: Number(process.env.VALKEY_PORT), // important: convert to number
  username: process.env.VALKEY_USER,
  password: process.env.VALKEY_PASSWORD,
  tls: {},
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
