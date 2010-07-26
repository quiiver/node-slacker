var vows = require('vows'),
    sys = require('sys'),
    assert = require('assert');

var slacker = require('../lib/slacker');
var router = require('../lib/router');

var view = function() { return "testing123" }

var mockReq = function(method, path, headers) {
    return {
        url: "http://localhost:23442" + path, 
        method: method,
        headers: headers || {}
    };
};

slacker.errorHandler = function(rq, rs, e) { return e; }

vows.describe('Slacker').addBatch({
    'When using Slacker#get': {
        topic: slacker.get('/', view),
        'it should should respond to a GET request': function () {
            assert.equal(slacker.call(mockReq("GET", "/" )), "testing123");
        },
        'it should throw an error for a non GET request': function () {
            var e = slacker.call(mockReq("POST", "/"));
            assert.instanceOf(e, Error);
        },
        'it should throw a `405 Method not Allowed` for a non GET request': function () {
            var e = slacker.call(mockReq("POST", "/"));
            assert.equal(e.message, 405);
        }
    }
}).export(module);

