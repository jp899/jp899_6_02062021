const express = require('express');
const router = express.Router();

// Module pour limiter le nombre de tentatives de connection successives
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    skipSuccessfulRequests: true // Ne pas compter les requettes/connections réussies
});


const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', apiLimiter, userCtrl.login);

module.exports = router;