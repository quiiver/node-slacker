var http = require("http");
var templates = require('./templator');

var mu = require('./Mu/lib/mu');

mu.templateRoot = "./templates";

http.ServerResponse.prototype.toHTML = function(template, context, code) {

    var self = this;

    if (!code) {
        code = 200;
    }

    mu.render(template, context, {}, function(err, output) {
        if (err) {
            throw err;
        }

        var buffer = '';

        output
            .addListener('data', function (c) {buffer += c; })
            .addListener('end', function () {
               self.writeHead(statusCode, {'Content-Type': 'text/html'});
               self.write(buffer);
               self.end();
            });
        
    });
}

http.ServerResponse.prototype.toJSON = function(data) {
    
};
