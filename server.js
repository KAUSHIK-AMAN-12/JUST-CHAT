const http = require('http')
const socketio = require('socket.io')
const express = require('express')
const app = express()
const server = http.createServer(app)//yaha app ko server me badla
const io = socketio(server)

app.use('/',express.static(__dirname+'/public'))

let users = {            //phle se passwrod save karne ka array
    'aman' : 'aman29',         //objects ka array hai
    'ishu' : 'ishu02',
    'ujjawal' : 'ujj26',
    'yash' : 'yash12'
}
let socketMap = {}

io.on('connection',(socket)=> //connection is an event here and then socket will give the response
{
    function login(s,u)  //ye function banadiya bas ab join karne ka
    {
        s.join(u)   //yaha socket aur username se judjaye
        s.emit('logged_in')
        socketMap[s.id] = u     //here id is the socket id of the user or uss id ke correspond nam save kaediya
        console.log(socketMap)  //yaha ye socket id ke sath uske user ka naam print karega
    }
      socket.on('login', (data)=>
     {   
     if(users[data.username]) //if data.username existin users array
     {
     if(users[data.username] == data.password)  //yaha password sahi hai ya nhi ye check kar rahe hai 
     {
        login(socket,data.username)    //socket.join(data.username)  //data.username wale name se
                                               //socket.emit('logged_in')
     }
     else
     {
         socket.emit('login_failed')
     }}
     else
     {
      users[data.username] = data.password  //user ka naam add karke users me fir join karadiya
      login(socket,data.username)  // socket.join(data.username)  //data.username wale name se
                                           // socket.emit('logged_in')
     }
     console.log(users)
     
 })

    socket.on('msg_send', (data) =>
    {
     data.from = socketMap[socket.id]  //socketid ke correspond hume user ka pata lagana hai
     if(data.to)  //data.to is like a room here and if data.to = aman ,then msg will go to aman room
     {

      socket.to(data.to).emit('msg_rcvd',data)    //ye event ab data.to ke room pe chale jayue
     }
     else{
         socket.broadcast.emit('msg_rcvd', data)  // ye default hi sab ko send kardega
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

server.listen(4444, ()=>
{
    console.log('http://localhost:4444')
})