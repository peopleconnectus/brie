var http = require('http');
var mlUtil = require('mlUtil');
var restWrapper = function(path,method,jsonReq,host,port){
    var data = '',
        self = this,
        jsonDataStr = jsonReq ? JSON.stringify(jsonReq) : '';
    this.options = {
        path : path,
        method : method ? method = method : method = "GET",
        host : host ? host = host : host = "api.qa09.sea1.cmates.com", //CONFIG.links.apiBaseHost,
        port : port ? port = port : port = 80
    };

    //if json object is present in request overwrite header info

    if(jsonReq)
        this.options.headers = {'Content-Type': 'application/json','Content-Length': JSON.stringify(jsonReq).length};

    this.resultObj = {};

    this.asyncReq = function(data){
        this.asyncCallback = data;
        this.req();
    };

    this.socketReq = function(data){
        this.socket = data.socket;
        this.callbackName = data.callbackName;
        this.req();
    };

    this.req = function(){
        var req = http.get(self.options, function(res) {
            res.setEncoding('utf8');
            self.statusCode = res.statusCode;
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function() {
                var resultObj;
                try {
                    resultObj = JSON.parse(data);
                } catch(e){
                    resultObj = {'errorCode' : self.statusCode};
                };

                self.resultObj = resultObj;
                if(self.statusCode !== 200) self.logError();

                self.onEnd();
            });
        });

        if(jsonReq) req.write(jsonDataStr);

        req.end();
    };

    this.logError = function(){
        var msg = "Reponse " + JSON.stringify(this.resultObj) + '\n';
            msg += 'Error occurred in restWrapper.js\n ';
            msg += 'Request params \n';
            msg += JSON.stringify(this.options);
    };
};

restWrapper.prototype.onEnd = function(){
    if(this.asyncCallback)
        this.asyncCallback(null,this.resultObj);
    else if(this.socket)
        this.socket.emit(this.resultObj,this.callbackName);
    else
        return this.resultObj;
};

exports.restWrapper = restWrapper;