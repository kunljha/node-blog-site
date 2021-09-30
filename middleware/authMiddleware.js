require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const secret = process.env.SECRET

// for protecting routes
const requireAuth = (req, res, next) => {
	const token = req.cookies.jwt

	if (token) {
		jwt.verify(token, secret, (err, decodedToken) => {
			if (err) {
				console.log(err)
				res.redirect('/login')
			} else {
				console.log(decodedToken)
				next()
			}
		})
	} else {
		res.redirect('/login')
	}
}

// check current user
const checkUser = (req, res, next) => {
	const token = req.cookies.jwt

	if (token) {
		jwt.verify(token, secret, async (err, decodedToken) => {
			if (err) {
				console.log(err)
				res.locals.user = null
				next()
			} else {
				console.log(decodedToken)
				let user = await User.findById(decodedToken.id)
				res.locals.user = user // user can be accessed in every view
				next()
			}
		})
	} else {
		res.locals.user = null
		next()
	}
}

// verifying new users before signing-up
const confirmUser = async (req, res, next) => {
	const token = req.params.token
	try {
		jwt.verify(token, secret, async (err, decodedToken) => {
			if (err) {
				console.log(err)
				if (!user.verify) {
					await User.deleteOne({ verify: false })
				}
				res.redirect('/signup')
			} else {
				console.log(decodedToken)
				await User.findByIdAndUpdate(
					decodedToken.id,
					{
						verify: true,
					},
					{ useFindAndModify: false }
				)
				next()
			}
		})
	} catch (err) {
		console.log(err)
		if (!user.verify) {
			await User.deleteOne({ verify: false })
		}
		res.redirect('/signup')
	}
}

// get current user details
const getCurrentUser = async (req, res) => {
	const token = req.cookies.jwt
	if (token) {
		jwt.verify(token, secret, async (err, decodedToken) => {
			if (err) {
				console.log(err.message)
				return null
			} else {
				const user = await User.findById(decodedToken.id)
				return user
			}
		})
	} else {
		console.log('No token found')
		return null
	}
}

module.exports = { requireAuth, checkUser, confirmUser, getCurrentUser }
