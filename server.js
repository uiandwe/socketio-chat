const express = require('express');
var mongoose    = require('mongoose');
var moment = require('moment');
var ejs  = require('ejs');
const app = new express();

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log("Connected to mongod server");
});
mongoose.connect('mongodb://localhost/chat');
var Chat = require('./models/chat');


var server = require('http').createServer(app);
var io = require('socket.io')(server);


app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);


app.get('/',function(req,res){

    Chat.find(function(err, data){
        if(err) return res.status(500).send({error: 'database failure'});
        res.render('index', {
            data: data,
            moment: moment
        })
    }).limit(20).sort( { "_id": -1 } );
});


var chat = io.on('connection', function(socket) {
    var room = "chat";
    socket.join(room);

    socket.on('message', function(data){

        var chatTable = new Chat();
        var createdAt = new Date();
        chatTable.room = room;
        chatTable.message = data.msg;
        chatTable.createAt = createdAt;

        chatTable.save(function(err){
            if(err){
                console.error(err);
            }
            else{

                chat.to(room).emit('message', {msg: data.msg, createdAt: createdAt});
                // chat.emit('message', {msg: data.msg, createdAt: createdAt});
            }
        });

    });
});


server.listen(3000, function() {
    console.log('Socket IO server listening on port 3000');
});




