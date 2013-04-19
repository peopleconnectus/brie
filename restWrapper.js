var http = require('http');
var mlUtil = require('mlUtil');
var restWrapper = function(path,method,host,port,socket,asyncCallback){
    var data = '',
        self = this;
    this.options = {
        path : path,
        method : method ? method = method : method = "GET",
        host : host ? host = host : host = "api.qa09.sea1.cmates.com", //CONFIG.links.apiBaseHost,
        port : port ? port = port : port = 80
    };
    this.callback = asyncCallback ? asyncCallback : false;
    this.resultObj = {};
    this.statusCode;

    this.getAsync = function(asyncCallback){
        this.get(asyncCallback);
    };

    this.getSocket = function(socket){

    };

    this.get = function(asyncCallback,socket){
        //setup initial userInfo Call for user
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
                //return self.resultObj;
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
    console.log('yooo')
    if(this.callback)
        callback(null,this.resultObj);
    else if(this.socket)
        this.socket.thisSocket.emit(this.resultObj,socket);
    else
        return this.resultObj;

};

restWrapper.prototype.socketCallback = function(){

};

restWrapper.prototype.asyncCallback = function(){

};

restWrapper.prototype.onError = function(){
    console.log('error');
}

exports.restWrapper = restWrapper;