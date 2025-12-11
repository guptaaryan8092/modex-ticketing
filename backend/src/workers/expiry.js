const { Booking, sequelize } = require('../../models');
const { Op } = require('sequelize');

async function expireBookings() {
    const expiredCutoff = new Date(Date.now() - 2 * 60 * 1000); // 2 minutes ago

    console.log(`[ExpiryWorker] Checking for bookings created before ${expiredCutoff.toISOString()}...`);

    const result = await Booking.update(
        { status: 'FAILED' },
        {
            where: {
                status: 'PENDING',
                createdAt: {
                    [Op.lt]: expiredCutoff
                }
            }
        }
    );
    // sequelize update returns [affectedCount]
    const count = result[0];
    if (count > 0) {
        console.log(`[ExpiryWorker] Expired ${count} stale bookings.`);
    } else {
        console.log(`[ExpiryWorker] No stale bookings found.`);
    }
    return count;
}

module.exports = {
    expireBookings
};
