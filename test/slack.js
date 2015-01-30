var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();
var rss = require("../rss.js")(ee);
var assert = require("assert");
var chai = require("chai");
var expect = chai.expect;

