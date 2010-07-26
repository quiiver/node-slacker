var slacker = require('./lib/slacker');

slacker
    .consuming("application/json")
    .producing("application/json")

    .get("/", function(request, response) {
        response.toHTML('index', {title: 'wil.im'}, response.OK);
    })
 
    .post("/", function(request, response) {
       response.toJson(body, response.OK) 
    });


slacker.start(4200);
