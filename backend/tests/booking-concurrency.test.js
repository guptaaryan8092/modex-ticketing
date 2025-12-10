const request = require('supertest');
const app = require('../src/app');
const { Show, Booking, sequelize } = require('../models');

describe('Booking Concurrency', () => {
    let showId;

    beforeAll(async () => {
        // Ensure DB connection
        await sequelize.authenticate();
    });

    beforeEach(async () => {
        // Setup: Create a show with 5 seats
        await Booking.destroy({ where: {} });
        await Show.destroy({ where: {} });

        const show = await Show.create({
            name: 'Concurrency Test Show',
            start_time: new Date(),
            total_seats: 5,
            booked_seats: []
        });
        showId = show.id;
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test('should prevent double booking of the same seat', async () => {
        // Two requests trying to book seat #1 at the same time
        const req1 = request(app)
            .post(`/shows/${showId}/book`)
            .send({ seats: [1] });

        const req2 = request(app)
            .post(`/shows/${showId}/book`)
            .send({ seats: [1] });

        const [res1, res2] = await Promise.all([req1, req2]);

        // One should succeed (201), one should fail (409)
        const statusCodes = [res1.status, res2.status].sort();

        expect(statusCodes).toEqual([201, 409]);

        // Verify DB state
        const show = await Show.findByPk(showId);
        expect(show.booked_seats).toEqual([1]);

        const bookings = await Booking.findAll({ where: { show_id: showId } });
        expect(bookings.length).toBe(2);

        const confirmed = bookings.filter(b => b.status === 'CONFIRMED');
        const failed = bookings.filter(b => b.status === 'FAILED');
        const pending = bookings.filter(b => b.status === 'PENDING');

        expect(confirmed.length).toBe(1);
        // Note: The failed one might be marked FAILED in catch block, or just left PENDING if process crashed, 
        // but our service explicitly updates to FAILED on rollback.
        expect(failed.length).toBe(1);
    });

    test('should prevent overbooking with count', async () => {
        // total seats 5.
        // Request A wants 3 seats.
        // Request B wants 3 seats.
        // Only one should succeed.

        const req1 = request(app)
            .post(`/shows/${showId}/book`)
            .send({ seats_count: 3 });

        const req2 = request(app)
            .post(`/shows/${showId}/book`)
            .send({ seats_count: 3 });

        const [res1, res2] = await Promise.all([req1, req2]);

        const statusCodes = [res1.status, res2.status].sort();
        expect(statusCodes).toEqual([201, 409]);

        const show = await Show.findByPk(showId);
        expect(show.booked_seats.length).toBe(3);
    });
});
