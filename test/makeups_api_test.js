'use strict';

process.env.MONGO_URI = 'mongodb://localhost/makeupapp_test';
require('../server.js');
var mongoose = require('mongoose');
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

var expect = chai.expect;

describe('makeups api end points', function() {
	after(function(done) {
		mongoose.connection.db.dropDatabase(function() {
			done();
		});
	});

	it('should respond to a post request', function(done) {
		chai.request('localhost:3000/api/v1')
		.post('/makeups')
		.send({brand: 'YSL', type: 'lipstick'})
		.end(function(err, res) {
			expect(err).to.eql(null);
			expect(res.body).to.have.property('_id');
			expect(res.body.brand).to.eql('YSL');
			expect(res.body.type).to.eql('lipstick');
			done();
		});
	});

	it('should have a default brand', function(done) {
		chai.request('localhost:3000/api/v1')
		.post('/makeups')
		.send({brand: 'another brand'})
		.end(function(err, res) {
			expect(err).to.eql(null);
			expect(res.body.brand).to.eql('another brand');
			done();
		});
	});


	describe('already has stuff in database', function() {
		var id;
		beforeEach(function(done) {
			chai.request('localhost:3000/api/v1')
			.post('/makeups')
			.send({brand: 'YSL'})
			.end(function(err, res) {
				id = res.body._id;
				done();
			});
		});

		it('should have an index', function(done) {
			chai.request('localhost:3000/api/v1')
			.get('/makeups')
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(Array.isArray(res.body)).to.be.true;
				expect(res.body[0]).to.have.property('brand');
				done();
			});
		});

		it('should be able to update a makeup', function(done) {
			chai.request('localhost:3000/api/v1')
			.put('/makeups/' + id)
			.send({brand: 'new test brand'})
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res.body.brand).to.eql('new test brand');
				done();
			});
		});

		it('should be able to delete a makeup', function(done) {
			chai.request('localhost:3000/api/v1')
			.delete('/makeups/' + id)
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res.body).to.eql({});
				done();
			});
		});
	});
});


















