import { Server } from "socket.io";  // taking Server from socket.io

let io;  //initializing a instance of Socket.io

export const initSocket=(server)=>{
io=new Server(server,{
    cors:{
        origin:'*'  //allow all frontend urls to connect
    }
})

io.on('connection',(socket)=>{  //connection event runs when a new user connects
  console.log('User connected:',socket.id)

  //join task room
  socket.on('joinTask',(taskId)=>{   // task act as a room
    socket.join(taskId)
  })

  socket.on('leaveTask',(taskId)=>{
    socket.leave(taskId)
  })
})
return io
}

export const  getio =()=>{
    if(!io) throw new Error('Socket now initialized')
        return io
}