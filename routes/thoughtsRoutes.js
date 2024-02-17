const express = require('express')
const router = express.Router()
const ThoughtsController = require('../controllers/ThoughtsController')

router.get('/', ThoughtsController.showAll)

module.exports = router;