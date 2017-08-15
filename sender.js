(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory(true);
    } else {
    	var Sender = factory();
    	var sender = new Sender();
    	window.sender = sender;
    }
}(this, function(){

	var Sender = function(){

	};

	Sender.prototype = {

	};

	return Sender;
    
}));