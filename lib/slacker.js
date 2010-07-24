var sys = require('sys'), 
    url = require('url'),
    http = require('http');

// app
var router = require('./router').router;
var helpers = require('./helpers');
var templates = require('./templator');

var Slacker = function() {
    this.router = router;
}

Slacker.prototype = {
    get: function(route, callback) {
        this.router.addRoute(route, callback);
    },
    render: function() {
        templates.render.apply(null, arguments);
    },
    start: function(port) {
        var self = this;
        http.createServer(function (req, res) {
            try {
                var path = url.parse(req.url).pathname 
                var route = router.find(path);
                route.view.call(self, req, res, route.args || {});
            } catch (e) {
                helpers.errorHandler(req, res, e);
            }

        }).listen(port);
        sys.puts('Server running at http://127.0.0.1:'+ port +'/');
    }
}

module.exports = new Slacker;
