const { Show, Booking, sequelize } = require('../../models');
const { Op } = require('sequelize');

class ShowService {
    async createShow(data) {
        return await Show.create(data);
    }

    async getShows() {
        // Basic implementation: fetch shows and count confirmed bookings
        // Ideally use a subquery or aggregation for performance
        const shows = await Show.findAll({
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
              SELECT COUNT(*)::int
              FROM "Bookings" AS "booking"
              WHERE
                "booking"."show_id" = "Show"."id"
                AND
                "booking"."status" = 'CONFIRMED'
            )`),
                        'confirmed_seats_count'
                    ]
                ]
            },
            order: [['start_time', 'ASC']]
        });

        return shows.map(show => {
            const showJson = show.toJSON();
            const confirmed = showJson.confirmed_seats_count || 0;
            return {
                ...showJson,
                available_seats: show.total_seats - confirmed
            };
        });
    }
}

module.exports = new ShowService();
