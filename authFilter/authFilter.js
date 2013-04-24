var http = require('http');
var cookie = require('cookie');
var async = require('async');
var mlUtil = require('mlUtil');
var dateFormat = require('dateformat/lib/dateformat.js');
var restWrapper = require('restWrapper');

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
        salesProgramId = 11,
        errMsg,
        handOff = {},
        scribeObj;

    hs.cookieObj = hs.headers.cookie ? cookie.parse(hs.headers.cookie) : '';

    this.authInitHttp = function(outerCallback){
        async.series([
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
                /*console.log('session cookie',sessionCookie);
                console.log('ident Cookie',ident);
                console.log('mlVisitor Cookie',mlVisitor);
                console.log('scribe object',scribeObj);
                console.log('outgoing cookies',respCookies);*/
                outerCallback(err,handOff);
            });
    };

    // BEGIN FILTER DEFINITIONS

    this.salesFilter = function(callback){
        salesProgramId = hs.query.s || matchUrlPattern(hs.url) || 0;
        callback(null);
    };

    this.globalIdFilter = function(callback){

        async.series([
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
            handOff.ident = ident;
            callback(null);
        });
    };

    this.scribeFilterIn = function(callback){
        async.series([
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
        if(!scribeObj.authenticated){
            if(scribeObj.autoLogin){
                //the below logic needs to be clarified
                if((reqCookies.cmates || reqCookies.remember) || (!reqCookies.cmates || !reqCookies.remember)){
                    handOff.redirect = true;
                }
            }
        }
        callback(null);
    };

    this.scribeFilterOut = function(callback){
        if(scribeObj.version ==1){
            var setScribe = new restWrapper.restWrapper('/sessions/scribe','POST',scribeObj);
            setScribe.asyncReq(callback);
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
        reqCookies.ident = false;
        if(reqCookies.ident){
            ident = reqCookies.ident.split('&')[1];
        }else{
            var reqHeader ={
                "salesProgramId" : salesProgramId,
                "visitorId" : mlVisitor,
                "clientIPAddress" : hs.address.address,
                "userAgent" : hs.headers["user-agent"],
                "requestUrl" : hs.headers.referer,
                "referer" : hs.headers.referer
            };
            async.waterfall([
                function(scribeCallback){
                    var newScribeObj = new restWrapper.restWrapper('/sessions/sessionid?logSessionStart=true','POST',reqHeader);
                    newScribeObj.asyncReq(scribeCallback);
                },
                function(respObj,scribeCallback){
                    ident = respObj.id;
                    newGlobalId = true;
                    scribeCallback();
                }
            ],
            function(){
                callback();
            });
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
        if(reqCookies.ML_VISITOR)
            mlVisitor = reqCookies.ML_VISITOR;
        else
            mlVisitor = ident + dateFormat("yyyymmddHHMMss");

        var now = new Date();
        respCookies.mlVisitor = "ML_VISITOR=" + mlVisitor + "; expires="+dateFormat(new Date(now.setYear(now.getFullYear() + 10)),"UTC:ddd, dd-mmm-yyyy HH:MM:ss 'GMT'")+'; path=/; domain=.qa09.sea1.cmates.com;';
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

        async.waterfall([
            function(scribeCallback){
                var lkupScribeObj = new restWrapper.restWrapper('/sessions/scribe/'+sessionCookie);
                lkupScribeObj.asyncReq(scribeCallback);
            },
            function(lkupScribeResult,scribeCallback){
                scribeObj = lkupScribeResult;
                scribeCallback();
            }
        ],
        function(){
            callback();
        });
    };

    var checkScribeObj = function(callback){
        if(scribeObj.errorCode == '404' || scribeObj.errorCode == '400'){
            async.waterfall([
                function(newScribeCallback){
                    var getScribeObj = new restWrapper.restWrapper('/sessions/scribe','POST');
                    getScribeObj.asyncReq(newScribeCallback);
                },
                function(newScribeObj,newScribeCallback){
                    scribeObj = newScribeObj;
                    newScribeCallback();
                }
            ],
                function(){
                    callback();
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
        if(scribeObj.registrationId){
            var permissionReq = new restWrapper.restWrapper('/people/'+scribeObj.registrationId+'/permissions');
            permissionReq.asyncReq(outerCallback);
        }
        else{
            outerCallback(null,{"records":[]});
        }
    };
};

exports.authFilter = authFilter;