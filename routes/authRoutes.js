const express = require('express')
const { confirmUser } = require('../middleware/authMiddleware')
const {
	signup_get,
	signup_post,
	login_get,
	login_post,
	logout_get,
	confirmation_get,
} = require('../controllers/authControllers')

const router = express.Router()

router.get('/signup', signup_get)

router.post('/signup', signup_post)

router.get('/login', login_get)

router.post('/login', login_post)

router.get('/logout', logout_get)

router.get('/confirmation/:token', confirmUser, confirmation_get)

module.exports = router
