var sys  = require('sys');

var errorHandler = function(req, res, error) {

    // is integer?
    if (error % 1 === 0) {
        res.writeHead(error, {'Content-Type': 'text/plain'});
        res.write(error.toString());
        res.end();
    } else {
        errorHandler(req, res, 500);
        put(error.stack);
    }
};

var put = function() {
    sys.puts(Array.prototype.slice.apply(arguments).join(", "));
};

var inspect = function(obj) {
    put(sys.inspect(obj, false, null));
};

this.errorHandler = errorHandler;
this.inspect = inspect;
this.put = put;
