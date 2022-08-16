const express = require ('express');

const router = express.Router();

const {createComplaint, viewComplaint, giveDecision, deleteComplaint, viewComplaintById} =require('../Controllers/Complaint');

router.post('/createComplaint',createComplaint);

router.post('/viewComplaint',viewComplaint);

router.post('/viewComplaintById',viewComplaintById);

router.post('/giveDecision',giveDecision);

router.post('/deleteComplaint',deleteComplaint);


module.exports = router;