var express = require('express');
var router = express.Router();

/* home page */
router.get('/', function (req, res, next) {
	res.redirect('/books');
	c;
});

module.exports = router;
