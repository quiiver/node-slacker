var templates = require('./lib/templator');

exports.views = {

    index: function(req, res) {
        templates.render(res, 200, 'index', {title: 'wil.im'});
    },

    hello: function(req, res, args) {
        templates.render(res, 200, 'index', {title: 'hello ' + args.who});
    }
};
