const express = require('express');
const app = express();
const cors = require('cors')
const httpServer = require('http').createServer(app);
const Chat = require('./Model/Chat')
const Auction = require('./Model/Auction')
const moment = require("moment");
const connectDB = require('./DB/conn');


const io = require('socket.io')(httpServer , {
    cors:{
        origin:"*",
    }
});


app.use(cors({
    origin:'*'
}))


app.use(express.json());



connectDB();

app.get('/' , (req,res) =>{
    res.json({
        status:200,
        message:"Hello Dakiyah"
    })
})



const userRouter = require('./Routes/User')

const auctionRouter = require('./Routes/Auction')

const tripRouter = require('./Routes/Trip')

const vehicleRouter = require('./Routes/Vehicle');

const chatRouter = require('./Routes/Chat')

const notificationRouter = require('./Routes/Notification')

const complaintRouter = require('./Routes/Complaint');

const adminRouter = require('./Routes/Admin');

const accountRequestRouter = require('./Routes/AccountRequest');


app.use('/admin',adminRouter);

app.use('/vehicle' , vehicleRouter);

app.use('/trip', tripRouter)

app.use('/auction', auctionRouter)

app.use('/user',  userRouter)

app.use('/chat',  chatRouter)

app.use('/notification', notificationRouter)

app.use('/complaint', complaintRouter)

app.use('/accountRequest',accountRequestRouter);


io.on('connection' , (socket) =>{
    socket.on('RoomJoin' , async({roomId}) => {
        socket.join(roomId);
            socket.on('sendMessage',async({senderId,message})=>{
                let dateAndTime = moment().format('LLL');
            
                const response = await Chat.findByIdAndUpdate({_id: roomId} , {$push:{chats:{senderId: senderId, message: message , dateAndTime: dateAndTime}}} , {new: true})
            
                socket.emit('getMessages',response)
            })
    }) 
    socket.on('createAuction',async ()=>{
        
    const auctions = await Auction.find();
    socket.emit('FetchAuctions',auctions)
    })
})



httpServer.listen(process.env.PORT || 5000 ,()=>{
    console.log(`server running on port`);
});


