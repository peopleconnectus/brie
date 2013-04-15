var http = require('http');
var cookie = require('cookie');
var async = require('async');
var mlUtil = require('mlUtil');
var dateFormat = require('dateformat/lib/dateformat.js');

var authFilter = function(hs){

    var self = this,
        redirect = false,
        requestType = "POST",
        ident,
        newGlobalId = false,
        reqCookies = hs.headers.cookie ? cookie.parse(hs.headers.cookie) : {},
        respCookies = {},
        mlVisitor,
        sessionCookie,
        xSessionId,
        salesProgramId,
        errMsg,
        handOff = {},
        scribeObj;

    hs.cookieObj = hs.headers.cookie ? cookie.parse(hs.headers.cookie) : '';

    this.authInitHttp = function(outerCallback){

        async.waterfall([
            function(callback){
                self.salesFilter(callback);
            },
            function(callback){
                self.globalIdFilter(callback);
            },
            function(callback){

                self.scribeFilterIn(callback);
            },
            function(callback){
                self.canvasAutoLoginFilter(callback);
            },
            function(callback){
                self.scribeFilterOut(callback);
            }

        ],
            function(err, results) {
                outerCallback(err,handOff);
            });
    };

    // BEGIN FILTER DEFINITIONS

    this.salesFilter = function(callback){
        salesProgramId = hs.query.s || matchUrlPattern(hs.url);
        callback(null);
    };

    this.globalIdFilter = function(callback){

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
            //save respCookies to and xSessionId handOff object to return to server.js
            handOff.respCookies = respCookies;
            handOff.xSessionId = xSessionId;
            callback(null);
        });
    };

    this.scribeFilterIn = function(callback){
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
            handOff.scribeObj = scribeObj;
            callback(null);
        });
    };

    this.canvasAutoLoginFilter = function(callback){
        var err;
        handOff.redirect = false;
        if(!scribeObj.authenticated){
            if(scribeObj.autoLogin){
                //the below logic needs to be clarified
                if((reqCookies.cmates || reqCookies.remember) || (!reqCookies.cmates || !reqCookies.remember)){
                    handOff.redirect = true;
                }
            }
        }
        callback();
    };

    this.scribeFilterOut = function(callback){
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
            callback(null);
        }
    };

    //Sales Program Filter functions

    var matchUrlPattern = function(){
    };

    //Global ID Filter functions
    /**
     * Is the "ident" cookie present?
     * If not create new "ident" cookie using newly generated identifier.
     * Then extract the GUID part of the cookie content and set it as a request attribute.
     */
    var checkIdentCookie = function(callback){

        if(reqCookies.ident){
            ident = reqCookies.ident.split('&')[1];
            callback(null);
        }else{
            var reqHeader ={
                "salesProgramId" : salesProgramId,
                "visitorId" : mlVisitor,
                "clientIPAddress" : hs.address.address,
                "userAgent" : hs.headers["user-agent"],
                "requestUrl" : hs.headers.referer,
                "referer" : hs.headers.referer
            };

            var reqHeaderStr = JSON.stringify(reqHeader);
            var req = http.get(mlUtil.RESTOptions('/sessions/sessionid','POST',{'Content-Type': 'application/json','Content-Length': reqHeaderStr.length}), function(res) {
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
            req.write(reqHeaderStr);
            req.end();
        }
    };

    //Reset expiry on the cookie to 30 min from now, and add it to the HTTP Response
    var setIdentCookie = function(callback){
        var now = new Date();
        var newUTC = now.setMinutes(now.getMinutes() + 30);
        respCookies.ident = "ident=" + newUTC + "&" + ident + "; expires="+dateFormat(new Date(newUTC),"UTC:ddd, dd-mmm-yyyy HH:MM:ss 'GMT'")+'; path=/; domain=.qa09.sea1.cmates.com;';
        callback();
    };

    //Is "ML_VISITOR'cookie present?  If none supplied set a new one based on prev set "ident" property and a timestamp.
    var checkMlVisitorCookie = function(callback){
        if(reqCookies.ML_VISITOR){
            mlVisitor = reqCookies.ML_VISITOR;
        }else{
            var now = new Date();
            mlVisitor = ident + dateFormat("yyyymmddHHMMss");
            respCookies.mlVisitor = "ML_VISITOR=" + mlVisitor + "; expires="+dateFormat(new Date(now.setYear(now.getFullYear() + 10)),"UTC:ddd, dd-mmm-yyyy HH:MM:ss 'GMT'")+'; path=/; domain=.qa09.sea1.cmates.com;';
        }
        callback();
    };
    //Was a new global Id generated in this execution?
    var startSessionLog = function(callback){
        if(newGlobalId){
            //Write "sessionStart" log, passing global id from "ident" cookie and visitorId from "ML_VISITOR" cookie
            //unclear how this will work in Node env
        };
        callback();
    };

    //Set the "X-Session-ID" Response Header with the value of the global Id.
    var setSessionIdResponseHeader = function(callback){
        xSessionId = ident;
        callback();
    };

    //Inbound Scribe Creation Filter functions

    //Is "session" cookie present in request?
    var checkSessionCookie = function(callback){
         //If no "session" cookie Create New "session" cookie with newly created sessionId
         // and a randomly picked datasource id portion (a value from 0 - 2)
        sessionCookie = reqCookies.session || (Math.floor(Math.random() * (2 - 0 + 1)) + 0) +'&' + ident;
        callback();
    };

    //Lookup sessions DB using sessionId from cookie
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
        if(scribeObj.errorCode == '404' || scribeObj.errorCode == '400'){
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
