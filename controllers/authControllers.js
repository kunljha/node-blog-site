require('dotenv').config()
const User = require('../models/User')
const jwt = require('jsonwebtoken')

// handle errors
const handleErrors = (err) => {
	// console.log(err.errors)
	// console.log(Object.values(err.errors)) --> array
	// Object.values(err.errors).forEach((error) => {
	// 	console.log(error.properties)
	// 	console.log(error.properties.message)
	// 	console.log(error.properties.path)
	// })

	let errors = { email: '', password: '' }

	// handling login errors
	if (err.message === 'Incorrect email') {
		errors.email = 'This email is not registered'
	}

	if (err.message === 'Incorrect password') {
		errors.password = 'Password is wrong'
	}

	// user email not verified
	if (err.message === 'Email is not verified') {
		errors.email = 'Please verify you email'
	}

	// duplicate error code
	if (err.code === 11000) {
		errors.email = 'User already exists with this email!'
		return errors
	}

	// validation error
	if (err.message.includes('user validation failed')) {
		Object.values(err.errors).forEach(({ properties }) => {
			errors[properties.path] = properties.message
		})
	}

	return errors
}

// generating jwt token
const secret = process.env.SECRET
const createToken = (id) => {
	return jwt.sign({ id }, secret, { expiresIn: 1 * 24 * 60 * 60 })
}

const signup_get = (req, res) => {
	res.render('signup', { title: 'Sign up' })
}

const signup_post = async (req, res) => {
	const { email, password } = req.body

	try {
		const user = await User.create({ email, password, verify: false })
		const token = createToken(user._id)
		const info = await User.verifyEmail(token, email)

		if (info) {
			res.status(201).json({ userId: user._id })
		} else {
			throw new Error('Email not sent')
		}
	} catch (err) {
		console.log(err.message)
		const errors = handleErrors(err)
		res.status(400).json({ errors })
	}
}

const login_get = (req, res) => {
	res.render('login', { title: 'Log in' })
}

const login_post = async (req, res) => {
	const { email, password } = req.body

	try {
		const user = await User.login(email, password)
		const token = createToken(user._id)
		if (user.verify) {
			res.cookie('jwt', token, {
				httpOnly: true,
				maxAge: 1 * 24 * 60 * 60 * 1000,
			})
			res.status(200).json({ userId: user._id })
		} else {
			throw new Error('Email is not verified')
		}
	} catch (err) {
		console.log(err.message)
		const errors = handleErrors(err)
		res.status(400).json({ errors })
	}
}

const logout_get = (req, res) => {
	res.cookie('jwt', '', { maxAge: 1 })
	res.redirect('/')
}

const confirmation_get = (req, res) => {
	res.render('confirmation', { title: 'Verification' })
}

module.exports = {
	signup_get,
	signup_post,
	login_get,
	login_post,
	logout_get,
	confirmation_get,
}
