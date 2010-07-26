var sys = require('sys'), 
    url = require('url'),
    http = require('http');

(function() {
    
    // app
    var router = require('./router');
    var helpers = require('./helpers');

    require('./response');

    var inputGuards = {};
    var outputGuards = {};

    var resetGuards = function() {
        return inputGuards = outputGuards = {};
    };

    var Slacker = function() {
        this.router = router;
    }

    Slacker.prototype = {
        get: function(route, callback) {
            this.router.addRoute("GET", route, callback, inputGuards);
            return this;
        },
        post: function(route, callback) {
            this.router.addRoute("POST", route, callback, inputGuards);
            return this;
        },
        put: function(route, callback) {
            this.router.addRoute("PUT", route, callback, inputGuards);
            return this;
        },
        del: function(route, callback) {
            this.router.addRoute("DELETE", route, callback, inputGuards);
            return this;
        },
        consuming: function(guard) {
            inputGuards["Accept"] = guard;
            return this;
        },
        producing: function(guard) {
            outputGuards["Content-Type"] = guard;
            return this;
        },
        end: function() {
            resetGuards();
        },
        errorHandler: helpers.errorHandler,
        call: function(request, response) {
            try {
                var route = router.find(request);
                return route.view.call(this, request, response, route.args || {});
            } catch (e) {
                return this.errorHandler(request, response, e);
            }
        },
        start: function(port) {
            var self = this;
            http.createServer(function (req, res) {
                self.call(req, res);
            }).listen(port);
            sys.puts('Server running at http://127.0.0.1:'+ port +'/');
        }
    }

    module.exports = new Slacker;

})();
