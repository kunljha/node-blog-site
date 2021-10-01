const express = require('express')
const { requireAuth } = require('../middleware/authMiddleware')
const {
	blog_index,
	blog_create_get,
	blog_create_post,
	blog_details,
	blog_delete,
} = require('../controllers/blogControllers')

const router = express.Router()

router.get('/', blog_index)

router.get('/create', blog_create_get)

router.post('/', blog_create_post)

router.get('/:id', blog_details)

router.delete('/:id', blog_delete)

module.exports = router
