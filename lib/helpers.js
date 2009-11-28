var sys  = require('sys');

var errorHandler = function(req, res, error) {
    inspect(arguments.callee);
    // is integer?
    if (error % 1 === 0) {
        res.sendHeader(error, {'Content-Type': 'text/plain'});
        res.sendBody(error.toString());
        res.finish();
    } else {
        errorHandler(req, res, 500);
        sys.puts(error);
    }
};

var inspect = function(obj) {
    for (x in obj) {
        sys.debug(x + ": " + obj[x]);
    }
};

exports.errorHandler = errorHandler;
exports.inspect = inspect;
