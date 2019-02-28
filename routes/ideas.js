const express = require('express')
const router = express.Router()

// load Idea model
const Idea = require('../models/Idea')

// load authentication helper
const { ensureAuthenticated } = require('../helpers/auth')

// idea index page
router.get('/ideas', ensureAuthenticated, (req, res) => {
	Idea.find({ user: req.user._id })
		.sort({ date: 'desc' })
		.then(ideas => {
			res.render('ideas/index', { ideas: ideas })
		})
		.catch(err => {
			res.status(500).send(err)
			console.log('get: /ideas-', err)
		})
})

// add index form
router.get('/ideas/add', ensureAuthenticated, (req, res) => {
	res.render('ideas/add')
})

// add form process
router.post('/ideas', ensureAuthenticated, (req, res) => {
	let errors = []
	if (!req.body.title) {
		errors.push({ textTitle: 'Please add a title' })
	}
	if (!req.body.details) {
		errors.push({ textDetails: 'Please add some details' })
	}
	if (errors.length > 0) {
		res.render('ideas/add', {
			errors: errors,
			title: req.body.title,
			details: req.body.details
		})
	} else {
		const newIdea = {
			title: req.body.title,
			details: req.body.details,
			user: req.user._id
		}
		Idea.create(newIdea)
			.then(idea => {
				req.flash('success_msg', 'Video idea added')
				res.redirect('/ideas')
			})
			.catch(err => {
				res.status(500).send(err)
				console.log('post: /ideas-', err)
			})
	}
})

// edit idea form
router.get('/ideas/edit/:id', ensureAuthenticated, (req, res) => {
	Idea.findById(req.params.id)
		.then(idea => {
			if (idea.user != req.user._id) {
				req.flash('error_msg', 'Not authorized')
				res.redirect('/ideas')
			} else {
				res.render('ideas/edit', { idea: idea })
			}
		})
		.catch(error => {
			res.status(500).send(err)
			console.log('get: /ideas/edit/:id', err)
		})
})

// edit form process
router.put('/ideas/:id', ensureAuthenticated, (req, res) => {
	// const updateIdea = {
	// 	title: req.body.title,
	// 	details: req.body.details
	// };
	Idea.findByIdAndUpdate(req.params.id, req.body)
		.then(updateIdea => {
			req.flash('success_msg', 'Video idea updated')
			res.redirect('/ideas')
		})
		.catch(err => {
			res.status(500).send(err)
			console.log('put: /ideas/:id-', err)
		})
})

// delete idea
router.delete('/ideas/:id', ensureAuthenticated, (req, res) => {
	Idea.findByIdAndRemove(req.params.id)
		.then(() => {
			req.flash('success_msg', 'Video idea removed')
			res.redirect('/ideas')
		})
		.catch(err => {
			res.status(500).send(err)
			console.log('delete: /ideas/:id', err)
		})
})

module.exports = router
