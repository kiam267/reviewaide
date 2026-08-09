const cron = require('node-cron');
const {
  activateQrCodes,
} = require('./callfordatabaseactive.js');

const startCronJobs = () => {
  console.log('🚀 Cron Jobs Initialized');

  // Run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('⏰ Running daily job...');
    try {
      await activateQrCodes();
    } catch (err) {
      console.error('❌ Cron error:', err);
    }
  });
};

module.exports = {
  startCronJobs,
};
