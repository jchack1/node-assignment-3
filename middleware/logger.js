const fs = require("fs");


function logger(request, response, next){
    fs.appendFile('log.txt',`Name: ${request.body.name} \nEmail:  ${request.body.email} \nOver 18: ${request.body.checkbox} \n\n`, function () {
        console.log('Log updated')});
    next();
}

module.exports = logger;