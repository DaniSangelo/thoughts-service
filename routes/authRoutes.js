const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')

router.get('/login', AuthController.loginForm)
router.post('/login', AuthController.login)
router.get('/register', AuthController.register)
router.post('/register', AuthController.create)
router.get('/logout', AuthController.logout)

module.exports = router;