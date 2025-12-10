const bookingService = require('../services/bookingService');

class BookingController {

    async getSeatMap(req, res) {
        try {
            const { id } = req.params;
            const data = await bookingService.getSeatMap(id);
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async createBooking(req, res) {
        try {
            const { id } = req.params;
            const { seats, seats_count } = req.body;

            const booking = await bookingService.createBooking(id, seats, seats_count);
            res.status(201).json(booking);
        } catch (err) {
            // If error message is known business logic, return 400 or 409
            if (err.message.includes('not found') || err.message.includes('Invalid') || err.message.includes('already booked')) {
                return res.status(409).json({ error: err.message });
            }
            console.error(err);
            res.status(500).json({ error: 'Internal Booking Error' });
        }
    }

    async getBooking(req, res) {
        try {
            const { id } = req.params;
            const booking = await bookingService.getBooking(id);
            if (!booking) return res.status(404).json({ error: 'Booking not found' });
            res.json(booking);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new BookingController();
