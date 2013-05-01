(function () {
	var logging = {};

	logging.calledMethod = function(ip, method) {
		console.log('logging', ip, method);
		var now = new Date();

		var date = new Date();
		//var now = new Date('dd/mmm/yyyy:HH:MM:ss o');
		//console.log('now', now);
		//var date = new Date().format('dd/mmm/yyyy:HH:MM:ss o');
		console.log(ip +' - - ['+ date +'] "'+ method +'"');
	}

	module.exports = logging;
}());