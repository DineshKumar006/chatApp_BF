const Users=[];

const addUser=({id,username,roomname})=>{
    username=username.trim().toLowerCase();
    roomname=roomname.trim().toLowerCase();

    //checking roomname and username
    if(!username || !roomname){
        return{
            error:'User_name and room_name required'
        }
    }

    //cheking existing user
    const isMatch=Users.find(curr=>{
        return curr.roomname ===roomname && curr.username===username
    })

    if(isMatch){
        return{
            error:'User_name existed,try other one!'
        }
    }

    //addd user
    const user={id,username,roomname}
    Users.push(user)
    return {user}

}

const removeUser=(id)=>{
    const index=Users.findIndex(idx=>{
        return idx.id===id
    })
    if(index!=-1){
        return Users.splice(index,1)[0]
    }
}


const getUser=(id)=>{
    const user=Users.find(ele=>{
        return ele.id==id
    })
    return user
}


const getUserInRoom=(roomname)=>{
    roomname.trim().toLowerCase();
    const Userroom=Users.filter(user=>{
        return user.roomname==roomname
    })
    return Userroom
}


// addUser({id:22,username:'dinesh',roomname:'wings'})
// const {Error,user}= addUser({id:23,username:'dd',roomname:'winwwgs'})

// console.log(user)

// console.log(removeUser(22))

// console.log(Users)


module.exports={
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}



