var slacker = require('./slacker');

slacker.get("/", function(req, res) {
    this.render('index', {title: 'wil.im'}, res);
});

slacker.start(4200);
