const express = require("express");
const app = express();
const cors = require('cors');


console.log('server is running');

// app.get("/", (req, res) => {
//   res.send(`Hello World!`);
// });
app.use(cors());
app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

var PORT = process.env.PORT || 3000;
// const server = app.listen(PORT);

const server = app.listen(PORT, () => {
  console.log("My socket server is running");
})

const io = require('socket.io')(server);


function listen() {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));



io.sockets.on('connection', newConnection);

function newConnection(socket){
	console.log('new connection: ' + socket.id);

  socket.on('game', function (data){
    io.sockets.emit('game', data);//向所有客户端传输游戏数据
  })

  socket.on('keys', function (data){
		data.chaTemp = 1;
		data.danTemp = 0;
		data.needleStateTemp = 0;

		data.bulStateTemp = 0;
    socket.broadcast.emit('keys', data);//向其他所有客户端传输游戏数据
    // console.log(gameState);
  })

  socket.on('virus', function(data){
    data.virusRtemp+=5;
    io.sockets.emit('virus', data);//向所有客户端传输游戏数据
  })

}
