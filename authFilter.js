var http = require('http');
var cookie = require('cookie');
var async = require('async');
var mlUtil = require('mlUtil');
var dateFormat = require('dateformat/lib/dateformat.js');

var authFilter = function(hs){

    var self = this,
        requestType = "POST",
        ident,
        newGlobalId = false,
        newUTC,
        reqCookies = hs.headers.cookie ? cookie.parse(hs.headers.cookie) : {},
        respCookies,
        mlVisitor,
        sessionCookie,
        xSessionId,
        errMsg,
        scribeObj;

    hs.cookieObj = hs.headers.cookie ? cookie.parse(hs.headers.cookie) : '';

    this.authInitHttp = function(outerCallback){

        async.waterfall([
            function(callback){
                self.salesFilter(callback);
            },
            function(handOff,callback){
                self.globalIdFilter(handOff,callback);
            },
            function(handOff,callback){
                self.scribeFilterIn(handOff,callback);
            },
            function(handOff,callback){
                self.canvasAutoLoginFilter(handOff,callback);
            },
            function(handOff,callback){
                self.scribeFilterOut(handOff,callback);
            }

        ],
            function(err, results) {
                outerCallback(err,results);
            });
    };

    // BEGIN FILTER DEFINITIONS

    this.salesFilter = function(callback){
        var salesId = hs.query.s || matchUrlPattern(hs.url);

        if(salesId){
            //interface with sales API once it is available;
        }else{
            callback(null, hs);
        }
    };

    this.globalIdFilter = function(handOff,callback){

        async.waterfall([
            function(callback){
                checkIdentCookie(callback);
            },
            function(callback){
                setIdentCookie(callback);
            },
            function(callback){
                checkMlVisitorCookie(callback);
            },
            function(callback){
                startSessionLog(callback);
            },
            function(callback){
                setSessionIdResponseHeader(callback);
            }
        ],
        function(err, results) {
            callback(null,'ya');
        });
    };

    this.scribeFilterIn = function(handOff,callback){
        async.waterfall([
            function(callback){
                checkSessionCookie(callback);
            },
            function(callback){
                lookupSession(callback);
            },
            function(callback){
                checkScribeObj(callback);
            }
        ],
        function(){
            callback(null,'yo');
        });
    };

    this.canvasAutoLoginFilter = function(handOff,callback){
        var err;
        if(!scribeObj.authenticated || scribeObj.autoLogin || (reqCookies.cmates || reqCookies.remember)){
            if(requestType != "POST" || (requestType == "POST" && checkAutoLogDomains())) err = 'redirect';
        };
        callback(err,'yo');
    };

    this.scribeFilterOut = function(handOff,callback){
        if(scribeObj.version ==1){
            var scribeStr = JSON.stringify(scribeObj);
            var req = http.request(mlUtil.RESTOptions('/sessions/scribe','POST',{'Content-Type': 'application/json','Content-Length': scribeStr.length}),function(res){
                var responseString = '';
                res.setEncoding('utf-8');
                res.on('data', function(data) {
                    responseString += data;
                });
                res.on('end', function() {
                    callback(null,scribeObj);
                });
            });
            req.write(scribeStr);
            req.end();
        }else{
            callback(null,scribeObj);
        }
    };

    //Sales Program Filter functions

    var matchUrlPattern = function(){
    };

    //Global ID Filter functions

    var checkIdentCookie = function(callback){
        if(hs.ident){
            this.resp.ident = hs.ident.split('&')[1];
            callback(null);
        }else{
            var req = http.get(mlUtil.RESTOptions('/sessions/sessionid','POST'), function(res) {
                res.setEncoding('utf8');
                var data = '';
                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function(){
                    var obj = JSON.parse(data);
                    ident = obj.id;
                    newGlobalId = true;
                    callback();
                })
            });
        }
    };

    var setIdentCookie = function(callback){
        var now = new Date();
        newUTC = now.setMinutes(now.getMinutes() + 30);
        respCookies = "ident=" + newUTC + "&" + ident + "; expires="+dateFormat(new Date(newUTC),"UTC:ddd, dd-mmm-yyyy HH:MM:ss 'GMT'")+';';
        callback();
    };

    var checkMlVisitorCookie = function(callback){
        //check for ML_VISITOR cookie.  If none supplied set a new one based on prev set "ident" property and a timestamp.
        mlVisitor = reqCookies.ML_VISITOR || ident + dateFormat("yyyymmddHHMMss");
        callback();
    };

    var startSessionLog = function(callback){
        if(newGlobalId){
            //TBD start session log if this.resp.newGlobalId is set to true;
        };
        callback();
    };

    var setSessionIdResponseHeader = function(callback){
        xSessionId = ident;
        callback();
    };

    //Inbound Scribe Creation Filter functions

    var checkSessionCookie = function(callback){
        //if we received a session cookie in our request use it if not creat a new one with random number from 0-2 + globalId;
        sessionCookie = reqCookies.session || (Math.floor(Math.random() * (2 - 0 + 1)) + 0) + ident;
        callback();
    };

    var lookupSession = function(callback){
        var req = http.get(mlUtil.RESTOptions('/sessions/scribe/'+sessionCookie), function(res) {
            res.setEncoding('utf8');
            var data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function(){
                scribeObj = JSON.parse(data);
                callback();
            });
        });
    };

    var checkScribeObj = function(callback){
        if(scribeObj.errorCode == '404'){
            var req = http.get(mlUtil.RESTOptions('/sessions/scribe','POST'), function(res){
                res.setEncoding('utf8');
                var data = '';
                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function(){
                    scribeObj= JSON.parse(data);
                    callback(null);
                });
            });
        }else{
            callback();
        }
    };

    //Canvas AutoLogin Filter functions

    var checkAutoLogDomains = function(){
        //unclear on the logic for this setting to false for now;
        //also need clarification on where to find configured autolog domains;
        return false;
    };

    //get User Permissions

    this.getUserPermissions = function(outerCallback){
        require('../rest/userPermissions').get(scribeObj.registrationId,outerCallback);
    };
};

exports.authFilter = authFilter;