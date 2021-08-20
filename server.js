const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
	console.log(req.url, req.method)

	// setup header
	res.setHeader('Content-Type', 'text/html')

	// setup basic routing
	let path = './views/'
	switch (req.url) {
		case '/':
			path += 'index.html'
			res.statusCode = 200
			break
		case '/about':
			path += 'about.html'
			res.statusCode = 200
			break
		case '/about-me':
			res.setHeader('Location', '/about') // redirecting to about page
			res.statusCode = 301 // resource has been permanently moved to other location
			break
		default:
			path += '404.html'
			res.statusCode = 404
			break
	}

	fs.readFile(path, (err, data) => {
		if (err) {
			console.log(err)
			res.end()
		} else {
			res.write(data)
			res.end()
		}
	})
})

server.listen(3000, 'localhost', () => {
	console.log('listening for requests from port: 3000')
})
