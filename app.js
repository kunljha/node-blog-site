const express = require('express')
const mongoose = require('mongoose')
const blogRoutes = require('./routes/blogRoutes')
const { username, password, database } = require('./config')

// initialise express app
const app = express()

// connect to mongoDB
const dbURI = `mongodb+srv://${username}:${password}@cluster0.rlzx9.mongodb.net/${database}?retryWrites=true&w=majority`

mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => {
		app.listen(3000)
	})
	.catch((err) => {
		console.log(err)
	})

// view engine setup
app.set('view engine', 'ejs')
// app.set('views', 'myviews') to specify to express to find view engine files in 'myviews' folder

app.use(express.static('public')) // middleware setup to serve static files
app.use(express.urlencoded({ extended: true })) // middleware to accept form data

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

// 404- page setup
app.use((req, res) => {
	res.status(404).render('404', { title: 'Not Found' })
})
