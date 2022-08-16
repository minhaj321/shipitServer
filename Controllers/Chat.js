const moment = require("moment");
const Chat = require("../Model/Chat");

    
    exports.getChatById = async (req , res) =>{
        
        const { chatId } = req.body;
        
        
        try {
            const chat = await Chat.findOne({_id: chatId })
            
            res.json({
                status:200,
                message: chat
            })
            
        } catch (error) {
            res.json({
                status: 500,
                message: error.message
            })
        }
        
    }
    
    
    
    exports.sendMessage = async (req , res) =>{
        const { chatRoomId , senderId , message } = req.body;
        
        
        try {
            let dateAndTime = moment().format('LLL');
            
            const response = await Chat.findByIdAndUpdate({_id: chatRoomId} , {$push:{chats:{senderId: senderId, message: message , dateAndTime: dateAndTime}}} , {new: true})
            
            res.json({
                status:200,
                message: response
            })
            
        } catch (error) {
            res.json({
                status:500,
                error: error.message
            })
        }
        
    }
