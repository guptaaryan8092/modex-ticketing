const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.get('/shows/:id/seats', bookingController.getSeatMap);
router.post('/shows/:id/book', bookingController.createBooking);
router.get('/bookings/:id', bookingController.getBooking);

module.exports = router;
