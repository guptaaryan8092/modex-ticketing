const { Show, Booking, sequelize } = require('./models');
const showService = require('./src/services/showService');

async function reproduce() {
    try {
        // 1. Create a show
        const show = await Show.create({
            name: 'Bug Test Show',
            start_time: new Date(),
            total_seats: 50
        });
        console.log(`Created Show: ${show.id}, Seats: ${show.total_seats}`);

        // 2. Create a booking for 4 seats
        await Booking.create({
            show_id: show.id,
            seats_requested: 4,
            seats_assigned: [1, 2, 3, 4],
            status: 'CONFIRMED'
        });
        console.log('Created Booking for 4 seats.');

        // 3. Fetch shows and check available seats
        const shows = await showService.getShows();
        const foundShow = shows.find(s => s.id === show.id);

        console.log(`Available Seats: ${foundShow.available_seats}`);

        if (foundShow.available_seats === 49) {
            console.error('FAIL: Available seats is 49 (Should be 46). Bug reproduced.');
        } else if (foundShow.available_seats === 46) {
            console.log('PASS: Available seats is 46.');
        } else {
            console.log(`Unexpected result: ${foundShow.available_seats}`);
        }

        // Cleanup
        await Booking.destroy({ where: { show_id: show.id } });
        await Show.destroy({ where: { id: show.id } });

    } catch (err) {
        console.error(err);
    }
}

reproduce();
