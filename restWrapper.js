var http = require('http');
var mlUtil = require('mlUtil');
var restWrapper = function(path,method,host,port){
    var data = '',
        self = this;
    this.options = {
        path : path,
        method : method ? method = method : method = "GET",
        host : host ? host = host : host = "api.qa09.sea1.cmates.com", //CONFIG.links.apiBaseHost,
        port : port ? port = port : port = 80
    };
    this.resultObj = {};

    this.getAsync = function(data){
        this.asyncCallback = data;
        this.get();
    };

    this.getSocket = function(data){
        this.socket = data.socket;
        this.socketEmitName = data.socketEmitName;
        this.get();
    };

    this.get = function(asyncCallback,socket){
        var req = http.get(self.options, function(res) {
            res.setEncoding('utf8');
            self.statusCode = res.statusCode;
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function() {
                if(self.statusCode === 200 || self.statusCode === 400){
                    self.resultObj = JSON.parse(data);
                }else{
                    self.resultObj = {"errorCode" : self.statusCode};
                }
                self.onEnd();
            });
        });
        req.on('error',function(){
            self.onError();
        });
        req.end();
    };
};

restWrapper.prototype.onEnd = function(){
    if(this.asyncCallback){
        this.asyncCallback(null,this.resultObj);
    }else if(this.socket){
        this.socket.emit(this.resultObj,this.socketEmitName);
    }else{
        return this.resultObj;
    }
};

restWrapper.prototype.onError = function(){
    console.log('error');
}

exports.restWrapper = restWrapper;