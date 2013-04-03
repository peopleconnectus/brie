var util = exports;
var dateFormat = require('dateformat');

util.RESTOptions = function(path,method,headers,host,port){
    var options ={
        path : path,
        method : method ? method = method : method = "GET",
        host : host ? host = host : host = 'api.qa09.sea1.cmates.com',
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