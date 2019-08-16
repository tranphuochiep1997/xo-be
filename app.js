const http = require('http');
const fs = require('fs');
const IO = require('socket.io');
const PORT = process.env.PORT || 2019;

const server = http.createServer(function (req, res) {
		const filename = "." + req.url;
		fs.readFile(filename, (err, data) => {
				if (err) {
						return res.end('Error' + err);
				}
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.write(data);
				res.end();
		});
});

server.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});

const io = IO(server);
let connectedSockets = [];
io.on('connection', onConnect());

function onConnect() {
		return function (socket) {
			console.log(`User connected: ${socket.id}`);
			connectedSockets.push(socket.id);

				socket.on('disconnect', () => {
					console.log('User disconnect: ', socket.id);
						removeSocketId(socket.id);
						io.emit('UPDATE_QUEUE', connectedSockets);
				});

				socket.on('MOVE', ({i, j}) => {
					console.log('MOVE', i, j);
						io.emit('MOVE', ({i, j}));
				});

				socket.on('WINNER', (loserId) => {
					removeSocketId(loserId);
					socket.broadcast.emit('UPDATE_QUEUE', connectedSockets);
				})
		}
}

function removeSocketId(socketId) {
		connectedSockets = connectedSockets.filter(id => id !== socketId);
}
