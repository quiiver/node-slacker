var posix = require('posix');
var sys   = require('sys');

var Mojo = require('./mojo').Mojo;
var BASE_DIR = process.ENV.SLACKER_ROOT || '.';
var TEMPLATE_PATH = BASE_DIR + '/templates';
var AUTO_RELOAD   = true;

// this needs to be done on start up.
// or a reload event. BLOCKING
var templates = {};
var re = /(.*)\.html$/;

// helper methods
var isFile = function(path) {
    try {
        var stats = posix.stat(path).wait();
        return stats.isFile();
    } catch(e) {
        return false;
    }
}

var rmFile = function(path) {
    posix.unlink(path).wait();
}

var generate = function(inPath, outPath) {
    outPath = outPath || inPath + '.js';
    var command = 'mojo < '+ inPath + ' > ' + outPath;
    sys.exec(command).wait();
}

var read = function(path) {
    var fd = posix.open(path, process.O_RDONLY, 0666).wait();
    return posix.read(fd, 10240, 0).wait();
}

var reload = function(inPath, outPath) {
    var match = inPath.match(re);
    generate(inPath, outPath);
    templates[match[0]] = read(outPath);
}

var load = function() {
    var files = posix.readdir(TEMPLATE_PATH).wait();
    for (var i in files) {
        
        var t = files[i];
        var match   = t.match(re);
        var inPath  = [TEMPLATE_PATH, t].join('/');
        var outPath = inPath + '.js';

        // filter files
        if (!match) continue;
        
        if (isFile(outPath) && !AUTO_RELOAD) {
            data = read(outPath);
        } else {
            generate(inPath, outPath);
            data = read(outPath);
        }

        if (AUTO_RELOAD) {
            // capture scope
            (function() {
                var input = inPath, output = outPath;
                process.watchFile(input, function() {
                    reload(input, output)
                });
            })();
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

