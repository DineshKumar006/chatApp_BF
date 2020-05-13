const socket=io();

const $uiMsg=document.querySelector('#uiMsg');
const $messageBox=document.querySelector('#message-box').innerHTML;

// event handler for message
socket.on('newconnectionStatus',(msg)=>{
    const html=Mustache.render($messageBox,{ message:msg.text , createdAt:moment(msg.createdAt).format('ddd hh:mm A') , username:msg.username});
    $uiMsg.insertAdjacentHTML('beforeend',html);
    autoScroll();
})

// event handler for Location
const $location_message_box = document.querySelector('#location-message-box').innerHTML
socket.on('LocationUrl',(data)=>{
    const htmldata=Mustache.render($location_message_box,{locationUrl:data.url,createdAt:moment(data.createdAt).format('ddd hh:mm A') ,username:data.username } );
    $uiMsg.insertAdjacentHTML('beforeend',htmldata);
    autoScroll();
})

//event handler fo UserRoomData
$sidebar_template=document.querySelector('#sidebar-template').innerHTML
$chat_sidebar=document.querySelector('#chat_sidebar')
socket.on('UserRoomData',(data)=>{
    const {roomname,usersInRoom}=data
    const htmlData=Mustache.render($sidebar_template,{RoomName:roomname,usersList:usersInRoom})
  $chat_sidebar.innerHTML=htmlData
    // console.log(usersInRoom)
})


const autoScroll=()=>{
    //new msg element
   const $newMessage= $uiMsg.lastElementChild
//heigth of new msg
    const msgStyle=getComputedStyle($newMessage);
    const  newMsgMargin=parseInt(msgStyle.marginBottom)
   const  newMsgHeight=$newMessage.offsetHeight + newMsgMargin;

   //visible height
   const visibleHeight=$uiMsg.offsetHeight

  //height of container
   const containerHeight=$uiMsg.scrollHeight

    //How far i have scrolled
    const scrollOffsetHeight=$uiMsg.scrollTop + visibleHeight

    if(containerHeight-newMsgHeight <=scrollOffsetHeight){

        $uiMsg.scrollTop = $uiMsg.scrollHeight

        // console.log( $uiMsg.scrollTop, $uiMsg.scrollHeight,newMsgHeight,scrollOffsetHeight,$uiMsg.scrollTop)
    }

}


const $FormInput=document.querySelector('.txt')
// const $FormInput=document.querySelector('input')
const $Form=document.querySelector('.submitForm')
const $FormBtn=document.querySelector('.btn')


// Message socket
$Form.addEventListener('submit',(event)=>{
    
    //disable btn
    $FormBtn.setAttribute('disabled','disabled')

    const ele=event.target.elements.textMsg.value
    event.preventDefault();
    let msg=ele
    socket.emit('newMsg',msg,(ackError)=>{
        //btn enable
        $FormBtn.removeAttribute('disabled')
        $FormInput.value='';
        $FormInput.focus();

        if(ackError){
            return console.log(ackError)
        }
        console.log('Message is delivered!') //acknowledgement
    });

});



// Location socket
$LocationBtn=document.querySelector('.location');

$LocationBtn.addEventListener('click',()=>{

    $LocationBtn.setAttribute('disabled','disabled')
    if(!navigator.geolocation){
        return alert('geolocation is not supporetd by your browser')
    }
     navigator.geolocation.getCurrentPosition(async(data)=>{
        const coords={
            lat: data.coords.latitude,
            long:data.coords.longitude
        }

        socket.emit('Location',coords,(Ack)=>{
            $LocationBtn.removeAttribute('disabled')
            console.log('Location shared to user!',Ack)
        });

        return  coords
    })


})


// Room join by username and roomname

const {username,roomname}=Qs.parse(location.search,{ignoreQueryPrefix:true})  //return object data
// console.log({username,roomname})
socket.emit('join',{username,roomname},(error)=>{
    if(error){
        alert(error)
        location.href='/index.html'
    }

})































// document.querySelector('.txt').addEventListener('change',(e)=>{
//     console.log(e.target.value)
// })




// socket.on('updateCount',(count)=>{
//     console.log('Count updated! from server:',count)
// })

// document.querySelector('#inc').addEventListener('click',()=>{
//     console.log('clicked!')

//      socket.emit('countInc') 


// })

