const cron = require('node-cron');
const { expireBookings } = require('./workers/expiry');

function initCron() {
    // Run every 30 seconds
    const task = cron.schedule('*/30 * * * * *', async () => {
        try {
            await expireBookings();
        } catch (err) {
            console.error('[ExpiryWorker] Error running expiry job:', err);
        }
    });

    console.log('[Cron] Expiry worker job scheduled (every 30s).');
    return task;
}

module.exports = initCron;
