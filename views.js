
exports.views = {

    index: function(req, res) {
        res.sendHeader(200, {'Content-Type': 'text/plain'});
        res.sendBody('wil.im');
        res.finish();
    },

    hello: function(req, res, args) {
        res.sendHeader(200, {'Content-Type': 'text/plain'});
        res.sendBody('Hello ' + args.who);
        res.finish();
    }
};

