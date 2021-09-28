var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

// Async Handler
const asyncHandler = (cb) => {
	return async (req, res, next) => {
		try {
			await cb(req, res, next);
		} catch (error) {
			next(error);
		}
	};
};

/* get a books list. */
router.get(
	'/',
	asyncHandler(async (req, res) => {
		const books = await Book.findAll({ order: [['createdAt', 'DESC']] });
		res.render('index', { books });
	})
);

/* Create new book */
router.get('/new', (req, res) => {
	res.render('new-book', { books: {}, errors: false });
});

/* POST New book */
router.post(
	'/',
	asyncHandler(async (req, res) => {
		let book;
		try {
			const newBook = await Book.create(req.body);
			res.redirect(`/books/${newBook.id}`);
		} catch (error) {
			if (error.name === 'SequelizeValidationError') {
				book = await Book.build(req.body);
				res.render('books/new-book', {
					book,
					errors: error.errors,
					title: 'New Book',
				});
			} else {
				throw error;
			}
		}
	})
);

/* GET  book "Update" */
// router.get(
// 	'/:id',
// 	asyncHandler(async (req, res) => {
// 		const book = await Book.findByPk(req.params.id);
// 		res.render('update-book', { book });
// 	})
// );

router.get(
	'/:id',
	asyncHandler(async (req, res) => {
		const book = await Book.findByPk(req.params.id);
		res.render('update-book', { book });
		if (book) {
			res.render('update-book', { book, errors: false });
		} else {
			res.status(404);
			next();
		}
	})
);

/* POST  book "Update" */
router.post(
	'/:id',
	asyncHandler(async (req, res) => {
		try {
			const book = await Book.findByPk(req.params.id);
			await book.update(req.body);
			res.redirect('/books');
		} catch (error) {
			if (error.name === 'SequelizeValidationError') {
				const book = await Book.findByPk(req.params.id);
				res.render('update-book', { book, errors: error.errors });
			} else {
				throw console.error();
			}
		}
	})
);

/*  DELETE  book */
router.post(
	'/:id/delete',
	asyncHandler(async (req, res) => {
		const book = await Book.findByPk(req.params.id);
		await book.destroy();
		res.redirect('/books');
	})
);
module.exports = router;
