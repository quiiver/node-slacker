var vows = require('vows'),
    sys = require('sys'),
    assert = require('assert');

var slacker = require('../lib/slacker');
var router = require('../lib/router');

var noop = function() {}

var mockReq = function(method, path) {
    return {
        url: "http://localhost:23442" + path, 
        method: method
    };
};

vows.describe('Slacker').addBatch({
    'When using Slacker#get': {
        topic: slacker.get('/', noop),
        'it should should respond to a GET request': function () {
            var callback = router.find(mockReq("GET", "/" )).view;
            assert.equal(callback, noop, "callback function should equal noop");
        },
        'it should throw an error for a non GET request': function () {
            try{
                router.find(mockReq("POST", "/"))
                assert.fail()
            } catch (e) {}
        }
    }
}).export(module); // Export the Suite

