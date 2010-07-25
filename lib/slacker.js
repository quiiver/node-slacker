var sys = require('sys'), 
    url = require('url'),
    http = require('http');

// app
var router = require('./router');
var helpers = require('./helpers');
var templates = require('./templator');

var Slacker = function() {
    this.router = router;
}

Slacker.prototype = {
    get: function(route, callback) {
        this.router.addRoute("GET", route, callback);
    },
    post: function(route, callback) {
        this.router.addRoute("POST", route, callback);
    },
    put: function(route, callback) {
        this.router.addRoute("PUT", route, callback);
    },
    del: function(route, callback) {
        this.router.addRoute("DELETE", route, callback);
    },
    render: function() {
        templates.render.apply(null, arguments);
    },
    start: function(port) {
        var self = this;
        http.createServer(function (req, res) {
            try {
                var route = router.find(req);
                route.view.call(self, req, res, route.args || {});
            } catch (e) {
                helpers.errorHandler(req, res, e);
            }

        }).listen(port);
        sys.puts('Server running at http://127.0.0.1:'+ port +'/');
    }
}

module.exports = new Slacker;
