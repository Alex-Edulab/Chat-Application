const express = require('express');
const cors = require('cors');
const { Server } = require("socket.io");
// var mysql = require('mysql');
var mysql = require('mysql2');
const { connect } = require('http2');
const app = express();
var bodyParser = require("body-parser");
const { response, query } = require('express');
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
});
app.use(cors());
// app.use(bodyParser.urlencoded());//function is not declared in the client side.
app.use(bodyParser.urlencoded({
    extended: true
}));
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "chat"
});

//database connection
connection.connect(function (err) {
    if (err) console.log("database err :" + err);
    else console.log('database connected');
})


const http = require('http').createServer(app);

const io = new Server(http, {
    cors: {
        origin: '*'
    }
})

// app.get('/users',(req,res) =>{
//     res.send("Hello World Today i am going to create the real time application ");
// })

let userList = new Map();
app.use(bodyParser.json());
app.use(function (request, result, next) {
    result.setHeader("Access-Control-Allow_Origin", "*");
    next();
})

//create the api to return all message
app.get("/users", function (request, res) {
    // console.log("Request query : ",request.params);s
    var view_data =[]
    connection.query("SELECT * FROM users", function (error, messages) {
        messages.forEach(data=>{
            view_data.push(data)
        })
        res.json({
            status: 200,
            data: view_data
        })
        console.log("This is query: ", view_data);
    })
});

//here you have you add where condition 
app.get('/users/:id', (req, res) => {
    console.log("reqq.prams//",req.params)
    connection.query('SELECT  * From chat_io where user_id ='+req.params.id+'',
     function(err, rows) {
        if (!err) {
            res.json({
                status: 200,
                data: rows
            })
            console.log("This is query: ", rows);
            // res.send(JSON.stringify(rows));
        } else {
            console.log('Error while performing Query.');
        }
    });
    // connection.end();
});

// //i tried this as the post
app.post("/users", (req, res) => {
    console.log("Request body : ", req.body);
    console.log("Request body sender : ", req.body.sender);
    connection.query("INSERT INTO users (sender) VALUES ('" + req.body.sender + "')"), function (err, result) {
        if (err) throw err;
        res.json({
            status: 200,
            data: result
        })
        console.log("Users Table :", result);
    };
})

app.post("/chat", (req, res) => {
    console.log("Request body : ", req.body);
    connection.query("INSERT INTO chat_io  (messages,receiver, user_id) VALUES ('" + req.body.message + "','" + req.body.receiver + "','" + req.body.user_id + "')"), function (err, result) {
         if (err) throw err;
         res.json({
            status: 200,
            data: result
        })
       
        console.log("Chat_io",result);
    };
})


io.on('connection', (socket) => {
    console.log("A user is Connected");
    let userName = socket.handshake.query.userName;
    let number = socket.handshake.query['id'];

    addUser(userName, socket.id);
    // socket.broadcast.emit(userName + ' has connected to this room'); 

    socket.broadcast.emit('user-list', [...userList.keys()]);
    socket.emit('user-list', [...userList.keys()]);

    socket.on('message', (msg, name) => {
        socket.broadcast.emit('message-broadcast', { message: msg, userName: userName });
        socket.on('receiver', (receiver) => {
            this.receiver = receiver;
            console.log("Receiver from get function from components.ts", this.receiver)
        });

        console.log("Mesage from ", userName, " And he says that", msg)
    })

    socket.on('disconnect', function () {
        const identify = socket.id
        console.log('user disconnected Identify', identify, userName);
        console.log('user disconnected', socket.id, userName);
    });

})


function addUser(id, userName) {

    if (!userList.has(userName)) {
        userList.set(id, userName);
    }
    else {
        userList.get(userName).add(id);
    }
}



function removeUser(id, userName) {
    if (userList.has(userName)) {
        let userIds = userList.get(userName);
        if (userIds.size == 0) {
            userList.delete(userName);
        }
    }
}


http.listen(3000, () => {
    console.log("Server is Running  http://localhost:3000")
});