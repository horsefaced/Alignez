$(function() {
    var alignez = {}, info = $('#info textarea');
    info.appendInfo = function(msg) {
	info.val(info.val() + '\n' + msg);	
    };
    
    alignez.socket = io.connect('http://localhost:10010').on('connect', function() {
	alignez.socket.on('login', function(user) {
	    info.appendInfo(JSON.stringify(user) + ' login');
	});

	alignez.socket.on('logout', function(user) {
	    info.appendInfo(JSON.stringify(user) + ' logout');
	});

	alignez.socket.on('monitor', function() {
	    info.appendInfo('monitor');
	});

	alignez.socket.on('lineup', function() {
	    info.appendInfo('lineup');
	});

	alignez.socket.on('leave', function() {
	    info.appendInfo('leave');
	});

	alignez.socket.on('request', function(data) {
	    info.appendInfo('request ' + JSON.stringify(data));
	});

	alignez.socket.on('start', function(data) {
	    info.appendInfo('start ' + JSON.stringify(data));
	});
    });

    $('#user .login').click(function() {
	alignez.socket.emit('login', {
	    id: Number.parseInt($('#user .id').val()),
	    name: $('#user .name').val(),
	});
    });

    $('#user .logout').click(function() {
	alignez.socket.emit('logout');
    });

    $('#oper .monitor').click(function() {
	alignez.socket.emit('monitor');
    });

    $('#oper .lineup').click(function() {
	alignez.socket.emit('lineup');
    });

    $('#oper .leave').click(function() {
	alignez.socket.emit('leave');
    });

    $('#oper .answer').click(function() {
	alignez.socket.emit('answer');
    });
});
