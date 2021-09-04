const Blog = require('../models/Blog')

const blog_index = (req, res) => {
	Blog.find()
		.sort({ createdAt: -1 }) // sorting by latest blog
		.then((result) => {
			res.render('index', { title: 'All Blogs', blogs: result })
		})
		.catch((err) => {
			console.log(err)
		})
}

const blog_details = (req, res) => {
	const id = req.params.id
	Blog.findById(id)
		.then((result) => {
			res.render('details', { title: 'Read Blog', blog: result })
		})
		.catch((err) => {
			// console.log(err)
			res.status(404).render('404', { title: 'Not Found' })
		})
}

const blog_create_get = (req, res) => {
	res.render('create', { title: 'Create a Blog' })
}

const blog_create_post = async (req, res) => {
	// const blog = new Blog(req.body)

	// blog
	// 	.save()
	// 	.then((result) => {
	// 		res.redirect('/blogs')
	// 	})
	// 	.catch((err) => {
	// 		console.log(err)
	// 	})
	const { title, snippet, body } = req.body
	try {
		const blog = await Blog.create({ title, snippet, body })
		res.redirect('/blogs')
	} catch (err) {
		console.log(err)
	}
}

const blog_delete = (req, res) => {
	const id = req.params.id

	Blog.findByIdAndDelete(id)
		.then((result) => {
			res.json({ redirect: '/blogs' })
		})
		.catch((err) => {
			console.log(err)
		})
}

module.exports = {
	blog_index,
	blog_details,
	blog_create_get,
	blog_create_post,
	blog_delete,
}