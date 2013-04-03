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
        reqCookies = hs.headers.cookie ? cookie.parse(hs.headers.cookie) : {},
        respCookies,
        salesId,
        salesProgram,
        mlVisitor,
        sessionCookie,
        xSessionId,
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
        async.waterfall([
            function(callback){
                checkSalesParams(callback);
            },
            function(callback){
                lookupSalesProgram(callback);
            }
        ],
        function(err,results){
            //If a sales Program is returned set to salesProgram property to outgoing handOff obj.
            //expecting 'id','name','beaconUrl' and 'interactionBeaconUrl'
            if(salesProgram) handOff.salesProgram = salesProgram;
            callback(null);
        })
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
                //Add scribe object to outgoing handOff obj.
                handOff.scribeObj = scribeObj;
                //Set session cookie to outgoing handOff obj for HTTP Response
                handOff.sessionCookie = sessionCookie;
                callback(null);
            });
    };

    this.canvasAutoLoginFilter = function(callback){
        var err;
        /**
         * Is authenticated flag not set on scribe?
         * Is autoLogin flag set on scribe?
         * Are either "remember" or "cmates" cookies present in Request?
         * If true to any of the above and request is POST redirect to autoLogin
         * If true to any of the above and request is NOT POST and referrer matches
         * one of configured domains from which posts should be autoLogged in redirect to autoLogin
         */
        if(!scribeObj.authenticated || scribeObj.autoLogin || (reqCookies.cmates || reqCookies.remember)){
            if(requestType != "POST" || (requestType == "POST" && checkAutoLogDomains())) err = 'redirect';
        };
        callback(err);
    };

    this.scribeFilterOut = function(callback){
        //Was this Scribe object newly created, or updated since it was last saved?
        if(scribeObj.version ==1){
            //if newly created save scribe object to sessions DB
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

    //Is the "s"parameter present in Request?
    //If true use the value of the "s" param as the Sales Number
    //If false Does the referer match a predetermined set of URL patterns?
    var checkSalesParams = function(callback){
        //Set the Sales Program Id as a Request Attribute
        salesId = hs.query.s || matchUrlPattern(hs.url);
        callback(null);
    };

    //match url to set of predetermined sales based URL patterns
    var matchUrlPattern = function(){
        //TBD function to use the mapped Sales Number against the matched URL pattern from config.
        return null;
    };

    var lookupSalesProgram = function(callback){
        if(salesId){
            var req = http.get(mlUtil.RESTOptions('/salesprograms/'+salesId), function(res) {
                res.setEncoding('utf8');

                var data = '';
                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function() {
                    salesProgram = JSON.parse(data);
                    callback(null)
                })
            })
        }else{
            callback(null);
        }
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

    //Reset expiry on the cookie to 30 min from now, and add it to the HTTP Response
    var setIdentCookie = function(callback){
        var now = new Date();
        var newUTC = now.setMinutes(now.getMinutes() + 30);
        respCookies = "ident=" + newUTC + "&" + ident + "; expires="+dateFormat(new Date(newUTC),"UTC:ddd, dd-mmm-yyyy HH:MM:ss 'GMT'")+';';
        callback();
    };

    //Is "ML_VISITOR'cookie present?  If none supplied set a new one based on prev set "ident" property and a timestamp.
    var checkMlVisitorCookie = function(callback){
        reqCookies.ML_VISITOR = '';
        if(reqCookies.ML_VISITOR){
            mlVisitor = reqCookies.ML_VISITOR;
        }else{
            var now = new Date();
            mlVisitor = ident + dateFormat("yyyymmddHHMMss");
            respCookies +="mlVisitor=" + mlVisitor + "; expires="+dateFormat(new Date(now.setYear(now.getFullYear() + 10)),"UTC:ddd, dd-mmm-yyyy HH:MM:ss 'GMT'")+';';
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
        sessionCookie = reqCookies.session || (Math.floor(Math.random() * (2 - 0 + 1)) + 0) + ident;
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
    //Found matching scribe record?
    var checkScribeObj = function(callback){
        //if no record found create new scribe object representing a visitor session
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