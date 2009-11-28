var posix = require('posix');
var repl  = require('repl');
var sys   = require('sys');

var Mojo = require('./mojo').Mojo;
var TEMPLATE_PATH = './templates';

// this needs to be done on start up.
// or a reload event. BLOCKING
var templates = {};
var load = function() {
    var re = /(.*)\.html$/;
    var files = posix.readdir(TEMPLATE_PATH).wait();
    var read  = function(path) {
        var fd   = posix.open(path, process.O_RDONLY, 0666).wait();
        return posix.read(fd, 10240, 0).wait();
    }
    for (i in files) {
        var t = files[i];
        var match = t.match(re);
        if (!match) continue;
        try {
            var path = [TEMPLATE_PATH, t + '.js'].join('/');
            var data = read(path);
        } catch (e) {
            // compile the template
            var inputPath  = [TEMPLATE_PATH, t].join('/');
            var outputPath = [TEMPLATE_PATH, t + '.js'].join('/');
            var command = 'mojo < '+ inputPath + ' > ' + outputPath;
            
            sys.exec(command).wait();
            var data = read(outputPath);
        }
        templates[match[1]] = data[0];
    }
}
load();


this.render = function(res, statusCode, template, o) {
   res.sendHeader(statusCode, {'Content-Type': 'text/html'});
   res.sendBody(eval(templates[template]));
   res.finish();
}
