const express = require('express');
const auth = require('../middleware/auth');
const userModel = require('../models/user');

const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/', auth, async(req, res)=>{
    try{
        const user = await userModel.findById(req.user.id).select('-password');
        res.send(user);
    }catch(err){
        res.status(500).send('server error');
    }
});

router.post('/', async (req, res)=>{
    try {
        const {email, password} = req.body;
        let user = await User.findOne({ email });
        if(!user) {return res.status(400).json({msg:'User Not Found'});}
        
        const isMatched = await bcrypt.compare(password, user.password);
        if(!isMatched) {return res.status(400).json({msg:'Invalid credentials'});}

        const payload = {
            user:{
                id:user.id
            }
        }
        
        jwt.sign(payload, config.jwtSecret, { expiresIn:360000}, (err, token)=>{
            if(err) throw err;
            res.json({token:token});
        })

    }catch(error){
        return res.status(400).json({msg:'Ooops! something went wrong.'});
    }
})

module.exports = router;