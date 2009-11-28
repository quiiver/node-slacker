var sys = require('sys'), 
    http = require('http');

// app
var views = require('./views').views;
var router = require('./lib/router').router;
var routes = require('./routes').routes;
var helpers = require('./lib/helpers');

router.addRoutes(routes);

http.createServer(function (req, res) {
    try {
        var route = router.find(req.uri.path);
        var view  = eval(route.view);
        view(req, res, route.args || {});
    } catch (e) {
        helpers.errorHandler(req, res, e);
    }

}).listen(80);
sys.puts('Server running at http://127.0.0.1:80/');
