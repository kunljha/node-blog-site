require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const blogRoutes = require('./routes/blogRoutes')
const authRoutes = require('./routes/authRoutes')
const { checkUser } = require('./middleware/authMiddleware')

// initialise express app
const app = express()

// connect to database
const dbURI = process.env.MONGODB_URI

const port = process.env.PORT || 5000
mongoose
	.connect(dbURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then((result) => {
		console.log('Connected to DB')
		app.listen(port)
	})
	.catch((err) => {
		console.log(err)
	})

// view engine setup
app.set('view engine', 'ejs')

// middleware
app.use(express.static('public')) // to serve static files
app.use(express.urlencoded({ extended: true })) // to accept form data
app.use(express.json()) // to parse json data of request into javascript data
app.use(cookieParser()) // handling cookies

app.get('*', checkUser)

// routes
app.get('/', (req, res) => {
	// res.sendFile('./views/index.html', { root: __dirname })
	res.redirect('/blogs')
})

app.get('/about', (req, res) => {
	// res.sendFile('./views/about.html', { root: __dirname })
	res.render('about', { title: 'About' })
})

// blog routes
app.use('/blogs', blogRoutes)

// auth routes
app.use(authRoutes)

// 404- page setup
app.use((req, res) => {
	res.status(404).render('404', { title: 'Not Found' })
})
