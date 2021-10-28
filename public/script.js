let socket = io()

$('#loginBox').show()      
$('#chatBox').hide()
$('#chatdiv').hide()
$('#forgetPassword').hide()
$('#signupBox').hide()

///-----------   SIGN-Up --------------------////
$('#btnsignuppage').click(()=>
{  
    $('#signupBox').show()
    $('#loginBox').hide()  
})

$('#btncreateuser').click(()=>
{  
    socket.emit('signup',{       //login event ke sath value aise send karte hai {} brackets me
     username : $('#newusername').val(),
     password : $('#newuserpass').val()
    })   
})

socket.on('usercreated', ()=>
{
    $('#loginBox').show() 
    $('#signupBox').hide()

})

//------ logout button --------------//
$('#logoutbtn').click(()=>
{  
    $('#inpUserName').val('')
    $('#inpPassword').val('')
    $('#chatBox').hide()
    $('#chatdiv').hide()
    $('#loginBox').show()  
})

//------          on click login button      ------------------//
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
    $('#chatdiv').show()
    $('#forgetPassword').hide()
})

socket.on('login_failed', () =>
{
    window.alert('Check your username or password please')
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
        socket.emit('msg_send',{                  //msg send event with to and msg value 
            to : $('#inpToUser').val(),           //yaha to me naam daldiya jisko send karna hai 
            msg : $('#inpNewMsg').val()           //yaha msg me message likha hoga
        })
        $('#inpNewMsg').val('') 
    }
})

socket.on('msg_rcvd',(data)=>
{
    if(!data.from)
    {
        $('#ulMsgList').append($(`<li style="
        width:100%;
        height : 40px;
        min-height : 40px;
        margin-top : 7px;
        margin-bottom : 10px;
        padding-bottom : 10px;
        color:black;
        font-size:1.5rem;
        font-weight: bold;
        ">`).text(
            `Anonymous : ${data.msg}`  //so yaha se print hoga ki kaha se message aaya aur sath message b 
        ))//msg rcv hote hi yaha <li> banake me message show karna hai
    }
    //height : 40px;
    else{
    $('#ulMsgList').append($(`<li style="
    width:100%;
    margin-top : 10px;
    color:black;
    font-size:1.2rem;
    font-weight: bold;
    ">`).text(
        `[${data.from}] : ${data.msg}`  //so yaha se print hoga ki kaha se message aaya aur sath message b 
    ))//msg rcv hote hi yaha <li> banake me message show karna hai
    }
})


$('#chatdiv').scrollTop($('#chatdiv')[0].scrollHeight);

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
    socket.emit('match_pass', {                 //login event ke  sath  ,data b send kardiya ayaha se
        sirname : $('#inpYourID').val()
})
})
socket.on('matched',(data) =>
{
    $("#ulMsgList1").append($(`<li style="
    width:90%;
    height : 40px;
    background : red;
    margin : 20px;
    font-size: 1.5rem;
    font-weight: bold;">`).text(`your password is : ${data.d}`))
})



