const Notification = require('../Model/Notification')



exports.getAllNotifications = async (req,res) =>{
 
  
    try {
      const notifications = await Notification.find();
      
      res.json({
          status:200,
          message: notifications
      })
      
    } catch (error) {
        res.json({
            status:200,
            message: error.message
        })
    }
}


exports.getNotificationsByUser = async (req,res) =>{

    const { accountId } = req.body;


    try {
        const notifications = await Notification.find({accountId: accountId})

        res.json({
            status:200,
            message: notifications
        })


    } catch (error) {
        
         res.json({
          status:500,
          message: error.message
      })

    }

}