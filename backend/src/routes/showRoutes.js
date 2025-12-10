const express = require('express');
const router = express.Router();
const showController = require('../controllers/showController');

router.post('/admin/shows', showController.createShow);
router.get('/shows', showController.getShows);

module.exports = router;
