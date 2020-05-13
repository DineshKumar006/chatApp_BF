const Messages=(username,text)=>{
    return{
        text:text,
        createdAt:new Date().getTime(),
        username:username
    }
}
const generateMessageLocation=(username,url)=>{
    return{
     url:url,
     createdAt:new Date().getTime(),
     username:username
    } 
}
module.exports={
    Messages,
    generateMessageLocation
}

