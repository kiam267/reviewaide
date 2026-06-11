require('dotenv').config();
const { Queue } = require('bullmq');

const connectionRedis = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT), // important: convert to number
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD,
};

type QueueINIT = (name: string) => void;

export function queueINIT(name: string) {
  const queue = new Queue(name, {
    connection: connectionRedis,
  });
  return queue;
}
