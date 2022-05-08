const express = require('express');
const auth = require('../middleware/auth');
const designerModel = require('../models/designer');

const router = express.Router();
router.get('/', auth, async(req, res)=>{
    try{
        const designers = await designerModel.find({});
        let arrDesigners = [];
        designers.forEach((obj)=>{
            arrDesigners.push(obj);
        })
        res.send(arrDesigners);
    }catch(err){
        res.status(500).send('server error');
    }
});

router.post('/', auth, async(req, res)=>{
    try{
        const {name, designation, email, year, quarter} = req.body;
        const activated = true;

        //check if designer is allready registered//
        let designer = await designerModel.findOne({ email });
        let date = new Date(year, (Number(quarter.split('Q')[1])-1)*3, 1);//new Date(2021, 0, 1);//
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
        designer = new designerModel({name, designation, email, activated, created, data:data});
        await designer.save();
        res.status(200).json({msg:'designer added successfully'});
    }catch(err){
        res.status(400).json({msg:error});
    }
});

router.post('/initilize_year', auth, async(req, res) => {
    try{
        let index = 0;
        const { year } = req.body;

        const intiValue = async() => {
            if(designers[index].data[year] === undefined){
                let fdata = { ...designers[index].data };
                fdata[year] = [null,null,null,null];
                //designers[index].data[year] = [null];
                await designers[index].updateOne({data:fdata});
            }
            
            index++;
            if(index<designers.length){  intiValue(); }
        }
        
        const designers = await designerModel.find({});
        intiValue();

        res.status(200).json({msg:'year data added successfully'});
    }catch(err){
        res.status(400).json({msg:error});
    }
});

router.post('/data', auth, async(req, res)=>{
    try{
        const {key, email, data} = req.body;
        let designer = await designerModel.findOne({ email });
        let finalData = {...designer.data };
        finalData[Number(key.split('_')[1])][Number(key.split('_')[2].split('Q')[1])-1] = {...data, values:[]};
        await designer.updateOne({data:finalData});
        res.status(200).json({msg:'success'});
    }catch(err){
        console.log('something went wrong');
        res.status(400).json({msg:'fail'});
    }
});

router.post('/remove', auth, async (req, res)=>{
    try{
        const {email, year, quarter} = req.body;
        let designer = await designerModel.findOne({ email });
        //await designer.delete();
        await designer.updateOne({deactivated:new Date(year, (Number(quarter.split('Q')[1])-1)*3, 1).getTime()});
        //await designer.updateOne({deactivated:new Date('2021', 9, 5).getTime()});
        res.status(200).json({msg:'designer deleted succesfully'});
    }catch(err){
        res.status(400).json({msg:'you are not authorized to delte the user'});
    }
});

router.post('/change_name', auth, async(req, res) => {
    try{
        const {email, newName} = req.body;
        let designer = await designerModel.findOne({ email });
        await designer.updateOne({name:newName.split('(')[0]});
        res.status(200).json({msg:'designer\' name changed succesfully'});
    }catch(err){
        res.status(400).json({msg:'you are not authorized to change the name of the designer'});
    }
})

module.exports = router;