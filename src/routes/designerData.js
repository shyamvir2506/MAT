const express = require('express');
const auth = require('../middleware/auth');
const designerDataModel = require('../models/designerData');

const router = express.Router();

router.get('/*', auth, async(req, res)=>{
    try{
        const key = req.query.key;
        let data = await designerDataModel.findOne({ key });
        res.send(data.values);
    }catch(err){
        res.status(400).json({msg:'designer data not found'});
    }
});

router.post('/', auth, async(req, res)=>{
    try{
        const { key, data } = req.body;
        let designer = await designerDataModel.findOne({ key });
        if(designer==null){
            designer = new designerDataModel({ key });
        }
        
        designer.values = data ? data.values : { };
        designer.key = key;
        
        await designer.save();
        res.status(200).json({msg:'success'});
    }catch(err){
        console.log('something went wrong');
        res.status(400).json({msg:'fail'});
    }
});

module.exports = router;