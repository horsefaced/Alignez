const extend = require('util')._extend;

class Assist {
    var owner;
    
    constructor(owner, socket) {
	super();
	this.owner = owner;
	this.owner.alignez = { socket: socket };
    }

    clone() {
	var result = extend({}, this.owner);
	delete result.alignez;
	return result;
    }
}

module.exports = Assist;
