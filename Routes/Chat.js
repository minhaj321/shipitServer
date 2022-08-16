
const express = require ('express');

const router = express.Router();

const { getChatById, sendMessage } = require('../Controllers/Chat')

router.post('/getChatById' , getChatById)

router.post('/sendMessage' , sendMessage)

module.exports = router;
