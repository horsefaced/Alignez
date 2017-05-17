const extend = require('util')._extend;
const uuid = require('uuid');

class Assist {
    constructor(owner, socket) {
	this.owner = owner;
	this.socket = socket;
	this.id = uuid.v1();
    }

    clone() {
	var result = extend({}, this.owner);
	delete result.alignez;
	return result;
    }
}

module.exports = Assist;
