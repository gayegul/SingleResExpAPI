'use strict';
var Makeup = require('../models/Makeup');
var bodyparser = require('body-parser');

module.exports = function(app) {
	app.use(bodyparser.json());

	app.get('/makeups', function(req, res) {
		Makeup.find({}, function(err, data) {
			if (err) return res.status(500).send({'msg': 'could not retrieve makeup'});

			res.json(data);
		});
	});

	app.post('/makeups', function(req, res) {
		var newMakeup = new Makeup(req.body);
		newMakeup.save(function(err, makeup) {
			if (err) return res.status(500).send({'msg': 'could not save brand'});
		
			res.json(makeup);
		});
	});

	app.put('/makeups/:id', function(req, res) {
		var updatedMakeup = req.body;
		delete updatedMakeup._id;
		Makeup.update({_id: req.params.id}, updatedMakeup, function(err) {
			if (err) return res.status(500).send({'msg': 'could not update makeup' + err});
		
			res.json(req.body);
		});
	});
};