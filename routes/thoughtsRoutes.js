const express = require('express')
const router = express.Router()
const ThoughtsController = require('../controllers/ThoughtsController')
const checkAuth = require('../helpers/auth').checkAuth

router.get('/', ThoughtsController.showAll)
router.get('/dashboard', checkAuth, ThoughtsController.dashboard)

module.exports = router;