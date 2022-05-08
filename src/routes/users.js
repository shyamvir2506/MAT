const express = require('express');

const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const userModel = require('../models/user');
const keyModel = require('../models/keys');
const config = require('config');

const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/',
    async (req, res)=>{
        try {
            const {name, email, password, key, designation, secretQst} = req.body;
            //check for the secret key//
            let secretKey = await keyModel.findOne({ key });
            if(!secretKey){
                return res.status(400).json({errors:{msg:'enter valid secret key', param:"key"}});
            }

            //check if user is allready exist//
            let user = await userModel.findOne({ email });
            if(user){
                return res.status(400).json({errors:{msg:'user already exists', param:"user"}});
            }
            
            const avatar = gravatar.url(email, {
                s:'200',
                r:'pg',
                d:'mm'
            });
            
            const type = secretKey.type;

            let date = new Date();//new Date(2021, 0, 1);
            let data = {
                [date.getFullYear()]:(function(){
                    let arr = [];
                    let month = date.getMonth();
                    month = month==0?1:month;
                    arr[Math.floor(month/3)] = {"quarter":"Q"+Math.ceil(month/3)};
                    return arr;
                })()
            };
            
            const created = date.getTime();
            user = new userModel({ name, email, password, avatar, type, designation, created, data:data, secretQst });

            //hash password and then save user to database//
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();

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
            res.status(400).json({errors:{msg:'something went wrong', param:"server"}});
        }
    }
)

router.post('/initilize_year', auth, async(req, res) => {
    try{
        let index = 0;
        const { year } = req.body;
        const managers = await userModel.find({});

        const intiValue = async() => {
            if(managers[index].data[year] === undefined){
                let fdata = { ...managers[index].data };
                fdata[year] = [null,null,null,null];
                await managers[index].updateOne({data:fdata});
            }
            
            index++;
            if(index<managers.length){  intiValue(); }
        }
        
        intiValue();

        res.status(200).json({msg:'year data added successfully'});
    }catch(err){
        res.status(400).json({msg:error});
    }
});


router.get('/', auth, async(req, res)=>{
    try{
        const managers = await userModel.find({});
        let arrManagers= [];
        managers.forEach((obj)=>{
            arrManagers.push(obj);
        })
        res.send(arrManagers);
    }catch(err){
        res.status(500).send('server error');
    }
});

router.post('/data', auth, async(req, res)=>{
    try{
        const {email, data} = req.body;
        let user = await userModel.findOne({ email });
        await user.updateOne({data:data});
        res.status(200).json({msg:'success'});
    }catch(err){
        res.status(400).json({msg:'fail'});
    }
})

router.post('/forgetPassword', async(req, res)=>{
    try{
        const {email, secretQst, password} = req.body;
        let user = await userModel.findOne({ email });

        if(user.secretQst.qst != secretQst.qst || user.secretQst.answer != secretQst.answer){
            return res.status(400).json({msg:'invalid question or answer'});
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password.value, salt);
        await user.save();
        res.status(200).json({msg:'password reset success'});
    }catch(err){
        res.status(400).json({msg:'something went wrong'});
    }
})

module.exports = router;