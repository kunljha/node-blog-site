const express = require('express')
const mongoose = require('mongoose')
const Blog = require('./models/blog')
const { username, password } = require('./config')

// initialise express app
const app = express()

// connet to mongoDB
const dbURI = `mongodb+srv://${username}:${password}@cluster0.rlzx9.mongodb.net/node-blog?retryWrites=true&w=majority`

mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => app.listen(3000))
	.catch((err) => console.log(err))

// view engine setup
app.set('view engine', 'ejs')
// app.set('views', 'myviews') to specify to express to find view engine files in 'myviews' folder

// middleware setup to serve static files
app.use(express.static('public'))

app.get('/', (req, res) => {
	// res.sendFile('./views/index.html', { root: __dirname })
	const blogs = [
		{
			title: 'Blog-1',
			snippet:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu luctus ipsum',
		},
		{
			title: 'Blog-2',
			snippet:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu luctus ipsum',
		},
		{
			title: 'Blog-3',
			snippet:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu luctus ipsum',
		},
	]
	res.render('index', { title: 'Home', blogs: blogs })
})

app.get('/about', (req, res) => {
	// res.sendFile('./views/about.html', { root: __dirname })
	res.render('about', { title: 'About' })
})

app.get('/blogs/create', (req, res) => {
	res.render('create', { title: 'Create a Blog' })
})

app.get('/add-blog', (req, res) => {
	const blog = new Blog({
		title: 'Blog-1',
		snippet: 'Blog-1 snippet',
		body: 'Blog-1 body',
	})

	blog
		.send()
		.then((result) => {
			res.send(result)
		})
		.catch((err) => {
			console.log(err)
		})
})

// setup redirect
// app.get('/about-us', (req, res) => {
// 	res.redirect('/about')
// })

// 404- page setup
app.use((req, res) => {
	res.status(404).render('404', { title: 'Not Found' })
})
