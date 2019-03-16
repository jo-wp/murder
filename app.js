
var portHttp = 3000;
var http = require('http');
var express = require('express'),
    app = module.exports.app = express();
var each = require('foreach');


var server = http.createServer(app);
var io = require('socket.io').listen(server);


app.get('/', function(req, res) {
    res.render('index.twig');
});

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
});

users = [];
io.sockets.on('connection', function (socket) {

    socket.on('create', function(room) {
        socket.join(room);
        start_session(room);
    });

    socket.on('join', function(room) {
        socket.join(room);
        start_session(room);
    });

    socket.on('disconnect', function(){
        //ON EST ICI Virer de users son id et pseudo.
    });

    socket.on('startchat', function(room,messageRoom){
        console.log(room+' Message : '+messageRoom);
        socket.broadcast.to(room).emit('msg',messageRoom);
    });

   
    function start_session(room){
        socket.on('nickname',function(nickname){
            socketClientId = socket.id,
            users.push({
                ID:socketClientId,
                pseudo:nickname
            });
        });
        socket.on('startGame',function(data){
            if(data===1){
                console.log(users);
            }
        });
        refresh_players(room);
        start_game();
    }


});


function refresh_players(room){
    var roomInfos = io.sockets.adapter.rooms[room];
    nbPlayers = roomInfos.length; 
    io.sockets.in(room).emit('refreshPlayer', nbPlayers);
}

function start_game(){
    if(nbPlayers>=3){
        delivery_cards();
    }
}

cardsMurder = ['couteau','pistolet','lacé','dynamite','seringue','coussin','voiture'];
cardsObject = ['foulard','lentille','pull','canette','porte monnaie','clé usb','lunette de soleil'];

function delivery_cards(){
    //console.log(users);
    each(users, function (value, key, array) {
        //console.log('Info : '+ value.pseudo);
    });
}










server.listen(portHttp);  