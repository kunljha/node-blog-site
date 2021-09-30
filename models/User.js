require('dotenv').config()
const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')

// defining schema for user
const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, 'Please enter a username'],
	},
	email: {
		type: String,
		required: [true, 'Please enter an email'],
		unique: true,
		lowercase: true,
		validate: [isEmail, 'Please enter a valid email'],
	},
	password: {
		type: String,
		required: [true, 'Please enter an password'],
		minlength: [6, 'Password length should be atleast 6 characters'],
	},
	verify: {
		type: Boolean,
		required: false,
	},
})

userSchema.index({ username: 1 }, { unique: true })
userSchema.index({ email: 1, username: 1 }, { unique: true })

// mongoose hooks
userSchema.pre('save', async function (next) {
	const salt = await bcrypt.genSalt()
	this.password = await bcrypt.hash(this.password, salt)
	next()
})

// defining static method on userSchema to login users
userSchema.statics.login = async function (email, password) {
	const user = await this.findOne({ email })
	if (user) {
		const auth = await bcrypt.compare(password, user.password)
		if (auth) {
			return user
		}

		throw new Error('Incorrect password')
	}
	throw new Error('Incorrect email')
}

// confirmation of email for signing-up new users
userSchema.statics.verifyEmail = async (token, email) => {
	const url = `http://localhost:5000/confirmation/${token}`
	const transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: process.env.MY_EMAIL,
			pass: process.env.MY_PASSWORD,
		},
	})
	try {
		const info = await transporter.sendMail({
			from: process.env.MY_EMAIL,
			to: `${email}`,
			subject: 'Verify your email for signing up at NodeBlogs',
			html: `
		<h2>Confirmation Email from NodeBlogs</h2>
		<p>You are receiving this email because your email address is used to sign-up at <strong>NodeBlogs</strong></p>
		<p>Please confirm verification by clicking on the link: <a href="${url}">Verify</a></p>
		<p>If you didn't tried to signup then simply ignore this mail.</p>
		`,
		})
		return info.messageId
	} catch (err) {
		console.log('cannot send email')
		console.log(err)
	}
}

const User = mongoose.model('user', userSchema)

module.exports = User
