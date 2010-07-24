var mu = require('./Mu/lib/mu');

mu.templateRoot = "./templates";


this.render = function(template, context, response, statusCode) {
    if (!statusCode) {
        statusCode = 200;
    }
    mu.render(template, context, {}, function(err, output) {
        if (err) {
            throw err;
        }

        var buffer = '';

        output
            .addListener('data', function (c) {buffer += c; })
            .addListener('end', function () {
               response.writeHead(statusCode, {'Content-Type': 'text/html'});
               response.write(buffer);
               response.end();
            });
        
    });
}

