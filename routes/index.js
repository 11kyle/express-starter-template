var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Blog = require('../models/blog');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

var mid = require('../middleware');

///////////////////////////////
//////////Site Routes//////////
///////////////////////////////
// GET /
router.get('/', function(req, res, next) {
  res.render('index');
});
// GET /login
router.get('/login', mid.loggedOut, function(req, res, next) {
  res.render('login');
});
// POST /login
router.post('/login',
  passport.authenticate('local', { successRedirect: '/admin',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

// GET /admin
router.get('/admin', mid.isAuthenticated, function(req, res, next) {
  res.render('admin');
});

// GET /logout
router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/'); // return to home page
      }
    });
  }
});

///////////////////////////////
///////////API Routes//////////
///////////////////////////////
// Create a Post
router.post("/api/blogpost", (req, res) => {
  Blog.create(req.body)
  .then(
    function(doc) {
      res.json(200);
    },
    function(err) {
      res.sendStatus(400);
    }
  );
  /*
  Blog.create(req.body, function(error, doc) {
	if(error) {
		res.sendStatus(400);
	} else if(doc) {
		res.json(200);
	}
  });
  */
});

// Get all Posts
router.get("/api/blogpost", (req, res) => {
  Blog.find({}, (err, docs) => {
    if (docs) {
      res.json(docs);
    } else if (err) {
      res.sendStatus(400);
    }
  });
});

// Delete Post
router.delete("/api/blogpost/:id", (req, res) => {
  Blog.remove({_id: req.params.id})
    .then(
      function(status) {
        res.sendStatus(200);
      },
      function() {
        res.sendStatus(400);
      }
    );
});

// Edit Post
router.get("/api/blogpost/:id", (req, res) => { // or getPostById
  var id = postId = req.params.id;
  Blog.findById(postId)
    .then(
      function(post) {
        res.json(post);
      },
      function (err) {
        res.sendStatus(400);
      }
    )
	/*
	Blog.findById(req.params.id, function(error, post) {
		if(error) {
			res.sendStatus(400);
		} else if (post) {
			res.json(post);
		}
	}
	*/
});

// Update Post
router.put("/api/blogpost/:id", (req, res) => {
  var postId = req.params.id;
  var post = req.body;
  Blog.update({_id: postId}, {
      title: post.title,
      body: post.body
    }).then(
      function(status) {
        res.sendStatus(200);
      },
      function(err) {
        res.sendStatus(400);
      }
    );
	/*
	Blog.update({_id: req.params.id}, {
		title: post.title,
		body: post.body
	}, function(error) {
		res.sendStatus(400);
	});
	*/
})

module.exports = router;
