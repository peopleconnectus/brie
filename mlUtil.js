var util = exports;
var dateFormat = require('dateformat');

util.RESTOptions = function(path,method,headers,host,port){
    var options ={
        path : path,
        method : method ? method = method : method = "GET",
        host : host ? host = host : host = "api.qa09.sea1.cmates.com", //CONFIG.links.apiBaseHost,
        port : port ? port = port : port = 80
    };

    if(headers) options.headers = headers;

    return options;
};

util.checkPermission = function(permissionObj,permission){

    var hasPermission = false;
    permissionObj.forEach(function(currentPermission){
        if(currentPermission.feature == permission)
            hasPermission = true;
    });
    return hasPermission;
};

util.handleNonSocketRequest = function(request,response) {
    var baseUrl = request.url.split('?');
	console.log(baseUrl[0]);

    if (baseUrl[0] == '/static/config.js') {
        util.writeConfigJsonInResponse(response);
    }
};

util.writeConfigJsonInResponse = function(response) {
    var configsAvailToClient = new Array ('links','facebook'); // add as many top level attributes from the CONFIG object as needed
    response.write('var envConf = {');
    for (var i=0; i<configsAvailToClient.length; i++) {
        var key = configsAvailToClient[i];
        response.write('"'+key+'":'+JSON.stringify(CONFIG[key]));
        if (i < configsAvailToClient.length - 1) {
            response.write(',');
        }
    }
    response.write('};');
	response.end();
};