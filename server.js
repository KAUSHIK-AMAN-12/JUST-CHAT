const http = require('http')
const socketio = require('socket.io')
const express = require('express')
const app = express()
const server = http.createServer(app)                         //yaha app ko server me badla
const io = socketio(server)
const PORT = process.env.PORT || 4444

app.use('/',express.static(__dirname+'/public'))

let users = {                                           
    'aman' : 'aman29',                                   
    'ishu' : 'ishu02',
    'ujjawal' : 'ujj26',
    'yash' : 'yash12'
}
 
let socketMap = {}                 //-> {'akjsbcaksjcbask' : 'aman'}

io.on('connection',(socket)=>    //connection is an event here and then socket will give the response
{
    function login(s,u)                          //ye function to join the room here
    {
        s.join(u)                        //yaha socket aur username se judjaye
        s.emit('logged_in')
        socketMap[s.id] = u     //here id is the socket id of the user or uss id ke correspond nam save kaediya
        console.log(socketMap)  //yaha ye socket id ke sath uske user ka naam print karega
    }


    socket.on('login', (data)=>
     {   
     if(users[data.username])                   //if "data.username" exist in users array
     {
     if(users[data.username] == data.password)  //yaha password sahi hai ya nhi ye check kar rahe hai 
     {
        login(socket,data.username)    //socket.join(data.username) 
                                       //after login we need to attach socket id to username
                                               //socket.emit('logged_in')
     }
     else
     {
         socket.emit('login_failed')
     }}
     else
     {
    //   users[data.username] = data.password      //user ka naam add karke users me fir join karadiya
    //   login(socket,data.username)        // socket.join(data.username)  
                                           // socket.emit('logged_in')
        socket.emit('login_failed')                                   
     }
     console.log(users)
     
 })

socket.on('signup' , (data) =>
{
users[data.username] = data.password             //new user created  
socket.emit('usercreated')
})

    socket.on('msg_send', (data) =>
    {
     data.from = socketMap[socket.id]         //socketid ke correspond hume user ka pata lagana hai
     if(data.to)  //data.to is like a room here and if data.to = aman ,then msg will go to aman room
     {
        io.in(data.to).emit('msg_rcvd', data);
      //socket.to(data.to).emit('msg_rcvd',data)    //ye event ab data.to ke room pe chale jayue
     }
     else{
        // socket.broadcast.emit('msg_rcvd', data)          // ye default hi sab ko send kardega
        io.emit('msg_rcvd', data) 
     }
 })

 socket.on('for_pass',()=>
 {
     socket.emit('enter_pass')
 })

 socket.on('match_pass',(data)=>
 {
     console.log(data.sirname)
     if(users[data.sirname])  //if agar user me wo name exist karta hai to ye aage bhadega
     {
         console.log('and the password is',users[data.sirname])
         data.d = users[data.sirname]
         console.log(data.d)
         socket.emit('matched',data)
     }
     else
     {
        console.log('no match') 
     }
     
 })
})

server.listen(PORT, ()=>
{
    console.log(`http://localhost:${PORT}`)
})