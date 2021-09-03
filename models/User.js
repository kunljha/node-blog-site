const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

// defining schema for user
const userSchema = new mongoose.Schema({
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
})

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

		throw Error('Incorrect password')
	}
	throw Error('Incorrect email')
}

const User = mongoose.model('user', userSchema)

module.exports = User
