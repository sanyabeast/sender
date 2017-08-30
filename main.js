requirejs({
	paths : {
		"superagent" : "node_modules/superagent/superagent"
	}
});

requirejs(["sender"], function(Sender){
	window.sender = new Sender();
})