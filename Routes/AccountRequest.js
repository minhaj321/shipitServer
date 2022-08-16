const express = require('express');
const { rejectAccountRequest,approveAccountRequest ,getAllAccountRequests,getAccountRequestById} = require('../Controllers/AccountRequest');

const router = express.Router();

router.post('/rejectAccountRequest',rejectAccountRequest);
router.post('/approveAccountRequest',approveAccountRequest);
router.post('/getAccountRequestById',getAccountRequestById);
router.get('/getAllAccountRequests',getAllAccountRequests);



module.exports = router