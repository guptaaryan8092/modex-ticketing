const { Booking, Show, sequelize } = require('../../models');

class BookingService {

    async getSeatMap(showId) {
        const show = await Show.findByPk(showId);
        if (!show) {
            throw new Error('Show not found');
        }

        const totalSeats = show.total_seats;
        const bookedSeats = show.booked_seats || [];

        // Simple 1-based index seat generation
        const allSeats = Array.from({ length: totalSeats }, (_, i) => i + 1);
        const availableSeats = allSeats.filter(seat => !bookedSeats.includes(seat));

        return {
            total: totalSeats,
            booked: bookedSeats,
            available: availableSeats
        };
    }

    async createBooking(showId, seatsByUser, seatsCount) {
        // 1. Create a Booking record with status PENDING
        // This is useful for tracking attempts and failures
        const booking = await Booking.create({
            show_id: showId,
            seats_requested: seatsCount || seatsByUser.length,
            seats_assigned: null,
            status: 'PENDING'
        });

        const t = await sequelize.transaction();

        try {
            // 2. Lock the show row for update
            const show = await Show.findByPk(showId, {
                transaction: t,
                lock: t.LOCK.UPDATE
            });

            if (!show) {
                throw new Error('Show not found');
            }

            let seatsToBook = [];

            // Determine which seats to try to book
            if (seatsByUser && seatsByUser.length > 0) {
                seatsToBook = seatsByUser.map(Number); // Ensure numbers
            } else if (seatsCount) {
                // Auto-assign logic: pick first available
                const currentBooked = show.booked_seats || [];
                for (let i = 1; i <= show.total_seats; i++) {
                    if (!currentBooked.includes(i)) {
                        seatsToBook.push(i);
                        if (seatsToBook.length === seatsCount) break;
                    }
                }

                if (seatsToBook.length < seatsCount) {
                    throw new Error(`Not enough seats available. Requested: ${seatsCount}, Available: ${seatsToBook.length}`);
                }
            } else {
                throw new Error('Invalid request: must provide seats or seats_count');
            }

            // Check availability intersection
            const currentBookedSet = new Set(show.booked_seats || []);
            const conflict = seatsToBook.some(seat => currentBookedSet.has(seat));

            // Also validate seat numbers range
            const invalidSeat = seatsToBook.some(seat => seat < 1 || seat > show.total_seats);

            if (conflict || invalidSeat) {
                throw new Error('One or more seats are invalid or already booked');
            }

            // 3. Update Show's booked_seats
            const newBookedSeats = [...(show.booked_seats || []), ...seatsToBook];

            // Postgres ARRAY column update
            await show.update({ booked_seats: newBookedSeats }, { transaction: t });

            // 4. Update Booking to CONFIRMED
            await booking.update({
                status: 'CONFIRMED',
                seats_assigned: seatsToBook
            }, { transaction: t });

            await t.commit();
            return booking;

        } catch (error) {
            await t.rollback();
            // Mark booking as FAILED
            await booking.update({ status: 'FAILED' });
            throw error;
        }
    }

    async getBooking(bookingId) {
        return Booking.findByPk(bookingId);
    }
}

module.exports = new BookingService();
