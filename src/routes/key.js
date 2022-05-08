const express = require('express');
const keyModel = require('../models/keys');

const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/generate_random_keys', (req, res)=>{
    const val = req.query.val;
    if(val != 'Jop7$kL95A_XYt0op^3WEt'){
        return res.status(400).json({msg:'enter valid key'});
    }

    const arr = ['super', 'admin', 'manager'];
    arr.forEach(async type => {
        try{
            const salt = await bcrypt.genSalt(10);
            let key = await bcrypt.hash(type+'-'+Math.random()+'key', salt);
    
            let secretKey = new keyModel({key, type});
            await secretKey.save();
        }catch(err){
            return res.status(400).json({msg:'Ooops! something went wrong.'});
        }
    });

    return res.status(200).json({msg:'keys generated'});
});

module.exports = router;