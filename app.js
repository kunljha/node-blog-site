const express = require('express')
const mongoose = require('mongoose')
const Blog = require('./models/blog') // requiring Blog model
const { username, password, database } = require('./config')

// initialise express app
const app = express()

// connect to mongoDB
const dbURI = `mongodb+srv://${username}:${password}@cluster0.rlzx9.mongodb.net/${database}?retryWrites=true&w=majority`

mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => app.listen(3000))
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

app.get('/blogs', (req, res) => {
	Blog.find()
		.sort({ createdAt: -1 }) // sorting by latest blog
		.then((result) => {
			res.render('index', { title: 'All Blogs', blogs: result })
		})
		.catch((err) => {
			console.log(err)
		})
})

app.get('/blogs/create', (req, res) => {
	res.render('create', { title: 'Create a Blog' })
})

app.post('/blogs', (req, res) => {
	const blog = new Blog(req.body)

	blog
		.save()
		.then((result) => {
			res.redirect('/blogs')
		})
		.catch((err) => {
			console.log(err)
		})
})

app.get('/blogs/:id', (req, res) => {
	const id = req.params.id
	Blog.findById(id)
		.then((result) => {
			res.render('details', { title: 'Read Blog', blog: result })
		})
		.catch((err) => {
			console.log(err)
		})
})

app.delete('/blogs/:id', (req, res) => {
	const id = req.params.id

	Blog.findByIdAndDelete(id)
		.then((result) => {
			res.json({ redirect: '/blogs' })
		})
		.catch((err) => {
			console.log(err)
		})
})

// 404- page setup
app.use((req, res) => {
	res.status(404).render('404', { title: 'Not Found' })
})
