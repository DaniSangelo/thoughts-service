const express = require('express')
const router = express.Router()
const ThoughtsController = require('../controllers/ThoughtsController')
const checkAuth = require('../helpers/auth').checkAuth

router.get('/', ThoughtsController.showAll)
router.get('/dashboard', checkAuth, ThoughtsController.dashboard)
router.get('/form-create', checkAuth, ThoughtsController.formCreate)
router.get('/edit/:id', checkAuth, ThoughtsController.getDataForEdit)
router.post('/create/save', checkAuth, ThoughtsController.save)
router.post('/remove', checkAuth, ThoughtsController.remove)

module.exports = router;