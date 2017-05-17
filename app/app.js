require('dotenv').load();

const alignez = require('app/alignez');
const Assist = require('app/assist');

const fs = require('fs');
const fsPath = require('path');

const http = require('http').createServer((req, res) => {
    if (req.url && req.url.startsWith('/public/')) {
	let path = req.url.split('/');
	let name = path[path.length - 1];
	if (name == '.' || name == '..') {
	    res.status(404).end();
	    return;
	}
	let file = fsPath.join(__dirname, '..', 'public', name);
	fs.exits(file, (exists) => {
	    if (!exists) res.status(404).end();
	    else {
		res.writeHead(200, {'Content-Type': 'application/javascript'});
		fs.createReadStream(file).pipe(res);
	    }
	});
    }
}).listen(process.env.port, '0.0.0.0');

function logout(socket) {
    alignez.leave(socket.user);
    delete socket.user;
}

require('socket.io').listen(http).on('connection', (socket) => {

    //使用一些方法前必须登录
    socket.use((packet, next) => {
	let event = packet[0];
	if (event
	    && ['monitor', 'lineup', 'leave', 'answer'].indexOf(event) > -1
	    && !socket.user) 
	    next(new Error({ event: event, code: 401 }));
	else
	    next();
    });
    
    socket.on('error', (err) => {
	socket.emit('err', err);
    });

    socket.on('disconnect', () => {
	logout(socket);
    });

    socket.on('login', (user) => {
	//在没有断线或者明确明确登出的情况下不会处理再次登录请求
	if (socket.user) return; 
	user.alignez = new Assist(user, socket);
	socket.user = user;
	socket.emit('login', user.alignez.clone());
    });

    socket.on('logout', () => {
	var user = socket.user;
	logout(socket);
	socket.emit('logout', !user || user.alignez.clone());
    });

    socket.on('monitor', () => {
	alignez.monitor(socket.user);
	socket.emit('monitor');
    });

    socket.on('lineup', () => {
	alignez.lineup(socket.user);
	socket.emit('lineup');
    });

    socket.on('leave', () => {
	alignez.leave(socket.user);
	socket.emit('leave');
    });

    socket.on('answer', () => {
	alignez.answer(socket.user);
	socket.emit('answer');
    });
});
