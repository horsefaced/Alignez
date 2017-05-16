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
    alignez.logout(socket.user);
    delete socket.user;
}

require('socket.io').listen(http).on('connection', (socket) => {
    socket.on('error', (err) => {
	socket.emit('err', err);
    });

    socket.on('disconnect', () => {
	logout(socket);
    });

    socket.on('login', (user) => {
	logout(socket)
	user.alignez = new Assist(user, socket);
	socket.user = user;
	alignez.login(user);
	socket.emit('login', user.clone());
    });
});
