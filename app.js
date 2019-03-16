
var portHttp = 3000;
var http = require('http');
var express = require('express'),
    app = module.exports.app = express();
var each = require('foreach');
var removeItems = require('remove-array-items');


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
        each(users, function (value, key, array) {
            if(value.ID===socket.id){
                removeItems(users,key,1);
            }
        });
    });

    socket.on('startchat', function(room,messageRoom){
        socket.broadcast.to(room).emit('msg',messageRoom);
    });

   
    function start_session(room){
        socket.on('nickname',function(nickname){
            socketClientId = socket.id;
            users.push({
                ID:socketClientId,
                pseudo:nickname,
                cardsMurder:'',
                cardsObject:''
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
    each(users, function (value, key, array) {
       //ON EST ICI FAUT DONNER UNE CARTE MURDER + OBJECT

    });
}










server.listen(portHttp);  