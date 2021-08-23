const express = require('express')

// initialise express app
const app = express()

app.set('view engine', 'ejs')
// app.set('views', 'myviews') to specify to express to find view engine files in 'myviews' folder

// listen for requests
app.listen(3000)

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

// setup redirect
// app.get('/about-us', (req, res) => {
// 	res.redirect('/about')
// })

// 404- page setup
app.use((req, res) => {
	res.status(404).render('404', { title: 'Not Found' })
})
