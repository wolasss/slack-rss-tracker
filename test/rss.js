var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();
var rss = require("../rss.js")(ee);
var assert = require("assert");
var chai = require("chai");
var expect = chai.expect;


describe('Register feed', function(){

	describe('invalid feed fields', function(){

		var register = function(feed) {
			return function() {
				return rss.register(feed);
			};
		};

		it('should return error when the url is not specified', function(){
			var feed = {
				name: "test",
				interval: 1
			};
			expect(register(feed)).to.throw(Error);
		});

		it('should return error when the channel is not specified', function(){
			var feed = {
				url: "http://google.pl",
				name: "test",
				interval: 1
			};
			expect(register(feed)).to.throw(Error);
		});

		it('should return error when the interval is not specified', function(){
			var feed = {
				url: "http://google.pl",
				channel: "test",
				interval: 1
			};
			expect(register(feed)).to.throw(Error);
		});

		it('should return error when the interval is not a number', function(){
			var feed = {
				url: "http://google.pl",
				channel: "test",
				name: "test",
				interval: "asd"
			};

			expect(register(feed)).to.throw(Error);
		});

		it('should return error when the name id not provided', function(){
			var feed = {
				url: "http://google.pl",
				channel: "test",
				name: "",
				interval: 1
			};

			expect(register(feed)).to.throw(Error);
		});

		it('should return error when the url is already loaded', function(){
			var feed = {
				url: "http://google.pl",
				channel: "test",
				name: "test",
				interval: 1
			};
			register(feed)();

			expect(register(feed)).to.throw(Error);
		});
	});

});

describe('Deregister feed', function(){
	var deregister = function(feed) {
		return function() {
			return rss.deregister(feed);
		};
	};

	describe('invalid feed fields', function(){
		it('should return error when the feed is not specified', function(){
			expect(deregister()).to.throw(Error);
		});
	});

	describe('invalid feed', function(){
		it('should return error when the feed url is not registered', function(){
			expect(deregister("http://randomurl.pl")).to.throw(Error);
		});

		it('should return error when the feed url is not registered', function(){
			expect(deregister("somerandomname")).to.throw(Error);
		});
	});

});