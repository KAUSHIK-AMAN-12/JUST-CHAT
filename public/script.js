let socket = io()

$('#loginBox').show()
$('#chatBox').hide()
$('#forgetPassword').hide()

//<<<<<<------yaha click se karega
$('#btnStart').click(()=>
{  
    socket.emit('login',{       //login event ke sath value aise send karte hai {} brackets me
     username : $('#inpUserName').val(),
     password : $('#inpPassword').val()
    })   
})
//------ENTER button se login karega yaha pe
$('#inpPassword').keypress((e)=>
{ 
    if(e.which == 13)
    {
    socket.emit('login',{
    
        username : $('#inpUserName').val(),
        password : $('#inpPassword').val()
       }) 
    }       
})

socket.on('logged_in', ()=>
{
    $('#loginBox').hide()
    $('#chatBox').show()
    $('#forgetPassword').hide()
})
socket.on('login_failed', () =>
{
    window.alert('sahi se dhekke username or password dal bhai')
})

$('#btnSendMsg').click(()=>            //yaha se jisko msg send krrahe hai or jo msg hai wo jayega serverpe
{                                   
    socket.emit('msg_send',{        //msg send event with to and msg value 
        to : $('#inpToUser').val(),   //yaha to me naam daldiya jisko send karna hai 
        msg : $('#inpNewMsg').val()   //yaha msg me message likha hoga
    })
    $('#inpNewMsg').val('')
})

$('#inpNewMsg').keypress((e) =>  //e is an event here
{
    if (e.which == 13)
    {
        socket.emit('msg_send',{        //msg send event with to and msg value 
            to : $('#inpToUser').val(),   //yaha to me naam daldiya jisko send karna hai 
            msg : $('#inpNewMsg').val()   //yaha msg me message likha hoga
        })
        $('#inpNewMsg').val('') 
    }
})

socket.on('msg_rcvd',(data)=>
{
    $('#ulMsgList').append($(`<li style="font-family: futura;
    font-style: italic;
    width:90%;
    height : 40px;
    background : #cce5ff ;
    margin : 15px;
    color:#313131;
    font-size:25px;
    font-weight: bold;
    ">`).text(
        `[${data.from}] : ${data.msg}`  //so yaha se print hoga ki kaha se message aaya aur sath message b 
    ))//msg rcv hote hi yaha <li> banake me message show karna hai

})


//$('#chatBox').scrollTop($('#chatBox')[0].scrollHeight);

$('#btnForget').click(()=>
{
    socket.emit('for_pass')
})

socket.on('enter_pass',()=>
{
    $('#forgetPassword').show()
    $('#loginBox').hide()
    $('#chatBox').hide()
})

$('#btnEnterPass').click(()=>
{
    socket.emit('match_pass', {                       //login event ke  sath  ,data b send kardiya ayaha se
        sirname : $('#inpYourID').val()
})
})
socket.on('matched',(data) =>
{
    $("#ulMsgList1").append($(`<li style="font-family: futura;
    font-style: italic;
    width:90%;
    height : 40px;
    background : #ffe5e5;
    margin : 20px;
    
    font-size:25px;
    font-weight: bold;">`).text(`your password is : ${data.d}`))
})



