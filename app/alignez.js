require('dotenv').load();
const agora = require('app/DynamicKey4');
const uuid = require('uuid');

class Alignez {
    constructor() {
	this.servers = new Map();
	this.customers = new Map();
    }

    monitor(user) {
	if (!user || !user.alignez || this.servers.has(user.alignez.id)) return;
	this.customers.delete(user.alignez.id);
	this.servers.set(user.alignez.id, user);

	//向服务员发出请求，并回送排队人数
	this.sendRequest(new Map([[user.alignez.id, user]]), this.customers.size);
    }

    lineup(user) {
	if (!user || !user.alignez || this.customers.has(user.alignez.id)) return;
	this.servers.delete(user.alignez.id);
	this.customers.set(user.alignez.id, user);

	//有人排队了，就通知服务人员
	this.sendRequest(this.servers, this.customers.size);
    }

    leave(user) {
	if (!user || !user.alignez) return;
	
	if (this.servers.has(user.alignez.id))
	    this.servers.delete(user.alignez.id);
	else if (this.customers.has(user.alignez.id)) {
	    this.customers.delete(user.alignez.id);
	    //有人离开了，也要通知服务人员
	    this.sendRequest(this.servers, this.customers.size);
	}
    }

    sendRequest(servers, count) {
	for (let [_, user] of servers) {
	    user.alignez.socket.emit('request', { count: count });
	}
    }

    firstCustomer() {
	for(let [_, user] of this.customers)
	    return user;
	return undefined;
    }

    randomInt() {
	return Math.round(Math.random()*100000000);
    }

    answer(server) {
	if (!server || !server.alignez || !this.servers.has(server.alignez.id)) return;
	let customer = this.firstCustomer();
	if (!customer)
	    this.sendRequest(new Map([server.alignez.id, server]));
	else {
	    this.leave(server);
	    this.leave(customer);

	    let channel = uuid.v1();
	    var unixTs = Math.round(new Date().getTime() / 1000);
	    var randomInt = this.randomInt();

	    server.alignez.socket.emit('start', {
		channel: channel,
		opposite: customer.alignez.clone(),
		vendorKey: process.env.vendor_key,
		channelKey: agora.generateMediaChannelKey(process.env.vendor_key, process.env.app_key, channel, unixTs, randomInt, server.id || this.randomInt(), 0),
	    });

	    customer.alignez.socket.emit('start', {
		channel: channel,
		opposite: server.alignez.clone(),
		vendorKey: process.env.vendor_key,
		channelKey: agora.generateMediaChannelKey(process.env.vendor_key, process.env.app_key, channel, unixTs, randomInt, customer.id || this.randomInt(), 0),
	    });
	} 
	
    }
}

module.exports = new Alignez();
