(function() {

    exports.router = {
	
	rootNode: {},
        
	testParam: function(param) {
            return (param.indexOf(":") === 0);
        },

        cleanParam: function(param) {
            return param.substr(1);
        },

        cleanURI:  function(r) {
            var route = decodeURIComponent(r);
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

        addRoute: function(route, view, validator) {
            var parts  = this.cleanURI(route);
            var cursor = this.rootNode;
            for (var i = 0,part; part = parts[i]; i++) {
                var isParam = this.testParam(part);
                if (isParam) {
                    cursor._param = this.cleanParam(part);
                } else {
                    if (!cursor[part]) {
                        cursor[part] = {};
                    }
                    cursor = cursor[part];
                }
            }
            cursor._view     = view;
            if (validator) {
                cursor._validator = validator;
            }
            return cursor;
        },

        find: function(uri) {
            var parts  = this.cleanURI(uri);
            var args   = {}; 
            var cursor = this.rootNode;
            var depth  = 0;

            for (p in parts) {
                var part = parts[p];
                // special case for root.
                if (part === "" && parts.length == 1) depth++;
                if (cursor[part]) {
                    cursor = cursor[part];
                    depth++;
                } else if (cursor._param && !args[cursor._param]) {
                    args[cursor._param] = part;
                    depth++;
                }
            }

            if (!cursor._view 
                || (cursor._param && !args[cursor._param])
                || depth != parts.length) {
                throw 404;
            }

            return {
                view: cursor._view, 
                args: args || {}, 
                validator: cursor._validator || {}
            };
        }
    };

})();

