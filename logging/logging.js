(function () {
	var logging = {};

	logging.logIncomingMessage = function(ip, method) {
		var now = new Date();
		//var date = new Date().format('dd/mmm/yyyy:HH:MM:ss o');
		console.log(ip +' - - ['+ now +'] "Received '+ method +'"');
	}

	logging.logOutgoingMessage = function(ip, method) {
		var now = new Date();
		//var date = new Date().format('dd/mmm/yyyy:HH:MM:ss o');
		console.log(ip +' - - ['+ now +'] "Sending '+ method +'"');
	}

	module.exports = logging;
}());