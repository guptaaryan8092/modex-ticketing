const request = require('supertest');
const app = require('../src/app');
const { Show, Booking, sequelize } = require('../models');

describe('Booking Expiry Logic', () => {
    let showId;

    beforeAll(async () => {
        await sequelize.authenticate();
    });

    beforeEach(async () => {
        await Booking.destroy({ where: {} });
        await Show.destroy({ where: {} });

        const show = await Show.create({
            name: 'Expiry Test Show',
            start_time: new Date(),
            total_seats: 10,
            booked_seats: []
        });
        showId = show.id;
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test('should expire PENDING bookings older than 2 minutes', async () => {
        const pastDate = new Date(Date.now() - 3 * 60 * 1000); // 3 minutes ago

        // 1. Create a "stale" PENDING booking manually
        const booking = await Booking.create({
            show_id: showId,
            seats_requested: 1,
            seats_assigned: null,
            status: 'PENDING',
            createdAt: pastDate, // Force old date
            updatedAt: pastDate
        });

        // 2. Trigger expiry manually via API
        const res = await request(app)
            .post('/admin/run-expiry')
            .send();

        expect(res.status).toBe(200);
        expect(res.body.expired_count).toBeGreaterThanOrEqual(1);

        // 3. Verify status changed to FAILED
        const updatedBooking = await Booking.findByPk(booking.id);
        expect(updatedBooking.status).toBe('FAILED');
    });

    test('should NOT expire fresh PENDING bookings', async () => {
        const freshDate = new Date();

        const booking = await Booking.create({
            show_id: showId,
            seats_requested: 1,
            seats_assigned: null,
            status: 'PENDING',
            createdAt: freshDate,
        });

        const res = await request(app)
            .post('/admin/run-expiry')
            .send();

        expect(res.status).toBe(200);

        const updatedBooking = await Booking.findByPk(booking.id);
        expect(updatedBooking.status).toBe('PENDING');
    });
});
