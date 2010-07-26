(function() {

    var url = require('url');
    var sys = require('sys');

    module.exports = {
	
        routes: {},

        reset: function() {
            this.routes = {};
        },
        
        testParam: function(param) {
            return (param.indexOf(":") === 0);
        },

        cleanParam: function(param) {
            return param.substr(1);
        },

        cleanURI:  function(r) {
            var route = decodeURIComponent(r);
            // special case for root.
            if (route == "/") return [];
            if (route.indexOf("/") === 0) 
                return route.substr(1).split("/");
            return route.split("/");
        },

        addRoutes: function(routes) {
            var self = this;
            routes.forEach(function(route) {
                self.addRoute.apply(self, route);
            });
        },

        addRoute: function(method, route, view, guards) {
            var parts  = this.cleanURI(route);
            var cursor = this.routes;

            for (var i = 0,part; part = parts[i]; i++) {
                var isParam = this.testParam(part);
                if (isParam) {
                    var param = this.cleanParam(part);
                    cursor._param = cursor._param || { _name: param };
                    cursor = cursor._param;
                } else {
                    cursor[part] = cursor[part] || {};
                    cursor = cursor[part];
                }
            }
           
            cursor._methods = cursor._methods || {};
            cursor._methods[method] = {
                view: view,
                guards: guards || {}
            }

            return cursor;
        },

        find: function(request) {
            var uri    = url.parse(request.url).pathname
            var parts  = this.cleanURI(uri);
            var args   = {}; 
            var cursor = this.routes;
            var depth  = 0;

            for (p in parts) {
                var part = parts[p];
                if (cursor[part]) {
                    cursor = cursor[part];
                    depth++;
                } else if (cursor._param) {
                    var p = cursor._param._name;
                    if(!args[p]) {
                        args[p] = part;
                        cursor = cursor._param;
                        depth++;
                    }
                }

            }

            if (!cursor._methods || depth != parts.length) {
                throw new Error(404);
            }

            if (!cursor._methods[request.method]) {
                throw new Error(405)
            }

            var ret = cursor._methods[request.method];
            ret.args = args;
            return ret;
        }
    };

})();

