const express=require('express');
const cors=require('cors');
const path=require('path');
const http=require('http');
const socketio=require('socket.io')
const FilterbadWords=require('bad-words')

const {Messages} =require('./src/utils/messages')
const {generateMessageLocation}=require('./src/utils/messages')

const {addUser,removeUser,getUser,getUserInRoom} =require('./src/utils/userValidate')

const app=express();
const server=http.createServer(app);
const io=socketio(server)


app.use(express.json());
app.use(cors())

const PORT=process.env.PORT ||7000;
const publicDIR=path.join(__dirname,'./public')

app.use(express.static(publicDIR));


// app.listen(PORT,()=>{
//     console.log('server is running on port:',PORT)
// })


io.on('connection',(socket)=>{
    // console.log('new connection')

    socket.on('join',({username,roomname},callback)=>{
       const {error,user}= addUser({id:socket.id,username:username,roomname:roomname})
       if(error){
           return callback(error)
       }
        socket.join(user.roomname)
        
        socket.emit('newconnectionStatus',Messages(user.username,'Welcome'));
        socket.broadcast.to(user.roomname).emit('newconnectionStatus', Messages(`${user.username} has joined!`))
       
        io.to(user.roomname).emit('UserRoomData',{
            roomname:user.roomname,
            usersInRoom:getUserInRoom(user.roomname)

        })

        callback()
    })

    
    socket.on('newMsg',(msg,callback)=>{

        const user=getUser(socket.id);
        const filterWords=new FilterbadWords();
        if(filterWords.isProfane(msg)){
            return callback('The Profanity_Word, not allowed!')
        }
        io.to(user.roomname).emit('newconnectionStatus',Messages(user.username,msg))
        callback();
    });

    socket.on('Location',(coords,callback)=>{
                const user=getUser(socket.id)
            const url=`https://google.com/maps?q=${coords.lat},${coords.long}`
        io.to(user.roomname).emit('LocationUrl', generateMessageLocation(user.username,url));
        callback('Your Location Shared Success');
    })

    socket.on('disconnect',()=>{
       const user= removeUser(socket.id)
       if(user){
        io.to(user.roomname).emit('newconnectionStatus',Messages('Admin',`${user.username} left the chat`))

        io.to(user.roomname).emit('UserRoomData',{
            roomname:user.roomname,
            usersInRoom:getUserInRoom(user.roomname)
        })
       }
    })
})


server.listen(PORT,()=>{
    console.log('server is running on port:',PORT)
})





// let count=0;
// io.on('connection',(socket)=>{
//     console.log('web_socket connected')
//     socket.emit('updateCount',count)

//     socket.on('countInc',()=>{
//         count++;
//         // socket.emit('updateCount',count) =>show data to specific connection only

//         io.emit('updateCount',count)
//     })
// })