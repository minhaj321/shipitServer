const { getAllNotifications, getNotificationsByUser } = require('../Controllers/Notification');

const router = require('express').Router();


router.get('/getAllNotifications' , getAllNotifications )

router.post('/getNotificationsByUser' , getNotificationsByUser)

module.exports =  router;