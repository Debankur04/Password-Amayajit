const express = require('express');
const router = express.Router();
const {
    addCredentials,
    updateCredentials,
    readCredentials,
    deleteCredentials
  } = require('../controllers/credentials.controller');
  



router.get('/read',readCredentials)
router.post('/add', addCredentials)
router.put('/update', updateCredentials)
router.delete('/delete', deleteCredentials)


module.exports = router;
