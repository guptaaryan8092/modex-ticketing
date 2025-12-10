const showService = require('../services/showService');
const { createShowSchema } = require('../utils/validation');

class ShowController {
    async createShow(req, res) {
        try {
            const { error, value } = createShowSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const show = await showService.createShow(value);
            return res.status(201).json(show);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getShows(req, res) {
        try {
            const shows = await showService.getShows();
            return res.json(shows);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new ShowController();
