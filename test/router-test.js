var vows = require('vows'),
    sys = require('sys'),
    assert = require('assert');

var router = require('../lib/router');

var noop = function() {};

var mockReq = function(method, path) {
    return {
        url: "http://localhost:23442" + path, 
        method: method
    };
};

vows.describe('The Router').addBatch({
    'When given a new route': {
        topic: router.addRoute("GET", "/new", noop),
        'should match given route': function () {
            var callback = router.find(mockReq("GET", "/new" )).view;
            assert.equal(callback, noop);
        }
    },
    'When given a new route with arguments': {
        topic: router.addRoute("GET", "/users/:user_id", noop),
        'should return the arguments in an object': function (topic) {
            var args = router.find(mockReq("GET", "/users/123" )).args;
            assert.equal(args.user_id, '123', "user id should equal 123");
        }
    },
    'With multiple params': {
        topic: router.addRoute("GET", "/blog/:slug/:date", noop),
        'it should return all params': function (topic) {
            var args = router.find(mockReq("GET", "/blog/foo/bar" )).args;
            assert.ok(("slug" in args) && ("date" in args));
        }
    },
    'When given a list of routes': {
        topic: router.addRoutes([["GET", "/blog/:slug", noop], ["GET", '/admin', noop]]),
        'it should return a route for one of the routes': function (topic) {
            var args = router.find(mockReq("GET", "/blog/foo" )).args;
            assert.equal(args.slug, 'foo', "slug should be foo");
        }
    },
    'When calling Router#cleanParam': {
        topic: router.cleanParam(":user_id"),
        'it should strip the `:` from the param' : function(topic) {
            assert.equal(topic.indexOf(":"), -1);
        }
    },
    'When calling Router#testParam': {
        topic: router.testParam(":user_id"),
        'it should recognize a valid param' : function(topic) {
            assert.equal(topic, true);
        }
    },
    'When calling Router#cleanURI': {
        topic: router.cleanURI("/foo/bar/baz/bah"),
        'the first element should be correct' : function(topic) {
            assert.equal(topic[0], "foo");
        },
        'the length should be correct' : function(topic) {
            assert.equal(topic[0], "foo");
        }
    }
}).export(module); // Export the Suite

