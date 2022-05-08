const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const mongoose = require('mongoose');
const config = require('config');
const Excel = require('exceljs');
const tempfile = require('tempfile');

const app = express();
app.use(express.json({ extended:false }));

const { sheetStyle, fillValues } = require('./src/routes/designersSheetStyle');

const connectDB = (url) => {
    return mongoose.createConnection(url, {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex:true
    });
}

var adminDB = connectDB(config.get("mongoURI1"));
var designerDB = connectDB(config.get("mongoURI2"));

const Schema = mongoose.Schema;
//***********************************************************************************//
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    avatar:{
        type:String
    },
    type:{
        type:String,
        required:true
    },
    designation:{
        type:String,
        required:true
    },
    create:{
        type:String
    },
    data:{
        type:Object
    },
    secretQst:{
        type:Object
    }
});
const UserModel = adminDB.model("users", UserSchema);

const KeySchema = new Schema({
    key: {
        type: String,
        required: true
    },
    type:{
        type:String,
        required:true
    }
});
const KeysModel = adminDB.model("keys", KeySchema);

const DesignerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    designation:{
        type:String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    activated:{
        type:Boolean
    },
    created:{
        type:Number
    },
    data:{
        type:Object
    }
});

const DesignerModel = adminDB.model("designer", DesignerSchema);


const ValueSchema = new Schema({ });
const ValuesModel = designerDB.model("values", ValueSchema);
//***********************************************************************************//

//*****************middle ware auth*************//
const Auth = function(req, res, next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).json({msg:'token not found'});

    try{
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    }catch(err){
        res.status(401).json({msg:'invalid token'});
    }
}
//*****************middle ware auth*************//

//xxxxxxxxxxxxxxxxxxxxxxxx GET SET PATH xxxxxxxxxxxxxxxxxxxx//
app.get('/api/auth/', Auth, async(req, res)=>{
    try{
        const user = await UserModel.findById(req.user.id).select('-password');
        res.send(user);
    }catch(err){
        res.status(500).send('server error');
    }
});
app.post('/api/auth/',async (req, res)=>{
    try {
        const {email, password} = req.body;
        let user = await UserModel.findOne({ email });
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
});

app.get('/api/user/', Auth, async(req, res)=>{
    try{
        const managers = await UserModel.find({});
        let arrManagers= [];
        managers.forEach((obj)=>{
            arrManagers.push(obj);
        })
        res.send(arrManagers);
    }catch(err){
        res.status(500).send('server error');
    }
} )

app.post('/api/user/', async (req, res)=>{
    try {
        const {name, email, password, key, designation, secretQst} = req.body;
        //check for the secret key//
        let secretKey = await KeyModel.findOne({ key });
        if(!secretKey){
            return res.status(400).json({errors:{msg:'enter valid secret key', param:"key"}});
        }

        //check if user is allready exist//
        let user = await UserModel.findOne({ email });
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
        console.log(secretQst)
        user = new UserModel({ name, email, password, avatar, type, designation, created, data:data, secretQst });

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
});

app.post('/api/user/data', auth, async(req, res)=>{
    try{
        const {email, data} = req.body;
        let user = await UserModel.findOne({ email });
        await user.updateOne({data:data});
        res.status(200).json({msg:'success'});
    }catch(err){
        res.status(400).json({msg:'fail'});
    }
})

app.post('/api/user/forgetPassword', async(req, res)=>{
    try{
        const {email, secretQst, password} = req.body;
        let user = await UserModel.findOne({ email });

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

app.get('/api/designer/', Auth, async(req, res)=>{
    try{
        const designers = await DesignerModel.find({});
        let arrDesigners = [];
        designers.forEach((obj)=>{
            arrDesigners.push(obj);
        })
        res.send(arrDesigners);
    }catch(err){
        res.status(500).send('server error');
    }
});

app.post('/api/designer/', Auth, async(req, res)=>{
    try{
        const {name, designation, email} = req.body;
        const activated = true;

        //check if designer is allready registered//
        let designer = await DesignerModel.findOne({ email });
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
        designer = new DesignerModel({name, designation, email, activated, created, data:data});
        await designer.save();
        res.status(200).json({msg:'designer added successfully'});
    }catch(err){
        res.status(400).json({msg:error});
    }
});

app.post('/api/designer/data', Auth, async(req, res)=>{
    try{
        const {email, data} = req.body;
        let designer = await designerModel.findOne({ email });
        await designer.updateOne({data:data});
        res.status(200).json({msg:'success'});
    }catch(err){
        res.status(400).json({msg:'fail'});
    }
});

app.post('/api/designer/remove', auth, async (req, res)=>{
    try{
        const {email} = req.body;
        let designer = await DesignerModel.findOne({ email });
        designer.activated = false;
        await designer.delete();
        res.status(200).json({msg:'designer deleted succesfully'});
    }catch(err){
        res.status(400).json({msg:'you are not authorized to delte the user'});
    }
});

app.post('/api/sheet/rotation', async (req, res)=>{
    const {data} = req.body;
    try {
        var workbook = new Excel.Workbook();
        var worksheet = workbook.addWorksheet('My Sheet');
        worksheet.mergeCells('A1:E1');
        worksheet.getCell('A1').value = data.quarter+" - "+data.year;

        let arrCells = ['A','B','C','D','E'];
        data.list.forEach((obj, index)=>{
            worksheet.getCell(arrCells[index]+'2').value = obj.zone;
            
            let clrTitle = 'ff00518e';
            if(obj.zone.search("EU") != -1){
                clrTitle = 'ff007a37';
                clrCol = 'ff92d050';
            }else if(obj.zone.search("US") != -1){
                clrTitle = 'ffff0000';
                clrCol = 'ffffcc66';
            }

            for(let j=3; j<=11; j++){
                worksheet.getCell(arrCells[index]+''+j).fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'fff2f2f2'} };
            }

            let tindex = 3;
            obj.list.forEach(tobj=>{
                let clrCol = tobj.designation.toLowerCase().search('manager')!=-1 ? 'ff0070c0' : 'ff00b0f0'
                let fontClr = tobj.designation.toLowerCase().search('developer')!=-1?'ffffffff':'ff000000';
                if(obj.zone.search("EU") != -1){
                    clrCol = tobj.designation.toLowerCase().search('manager')!=-1 ? 'ff00b050' : 'ff92d050';
                }else if(obj.zone.search("US") != -1){
                    clrCol = tobj.designation.toLowerCase().search('manager')!=-1 ? 'ffffc000' : 'ffffcc66';
                }
                clrCol = tobj.designation.toLowerCase().search('developer')!=-1 ? 'ff003760' : clrCol;
                
                worksheet.getCell(arrCells[index]+''+tindex).value = tobj.name;
                worksheet.getCell(arrCells[index]+''+tindex).fill = { type: 'pattern', pattern:'solid', fgColor:{argb:clrCol} };
                worksheet.getCell(arrCells[index]+''+tindex).font = { name: 'Arial', color: { argb: fontClr }, family: 1, size: 10 };
                worksheet.getCell(arrCells[index]+''+tindex).alignment = { vertical: 'middle', horizontal: 'center' };
                tindex++;
            });

            worksheet.getColumn(Number(index+1)).width = 40;
            worksheet.getCell(arrCells[index]+''+2).fill = { type: 'pattern', pattern:'solid', fgColor:{argb:clrTitle} };
            worksheet.getCell(arrCells[index]+''+2).font = { name: 'Arial', color: { argb: 'FFFFFFFF' }, family: 4, size: 12, bold:true };
            worksheet.getCell(arrCells[index]+''+3).font = { name: 'Arial', color: { argb: 'FFFFFFFF' }, family: 1, size: 11 };
            
            worksheet.getCell(arrCells[index]+'12').alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.getCell(arrCells[index]+'12').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'ffffcc99'} };
            worksheet.getCell(arrCells[index]+'12').value = obj.list.length;

            const border = {style:'medium', color: {argb:'FFFFFFFF'}};
            worksheet.getColumn(Number(index+1)).border = { top:border, left:border, bottom:border, right:border };
        })
        
        worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell('A1').fill = { type: 'pattern', pattern:'solid', bgColor:{argb:'FF000000'} };
        worksheet.getCell('A1').font = { name: 'Arial Black', color: { argb: 'FFFFFFFF' }, family: 1, size: 13 };

        var tempFilePath = tempfile('.xlsx');
        await workbook.xlsx.writeFile(tempFilePath)
        res.sendFile(tempFilePath, function(err){
            console.log('---------- error downloading file: ' + err);
        })
    } catch(err) {
        res.status(400).json({msg:'file not found'});
    }
})

app.post('/api/sheet/amFeedback/*', async(req, res)=>{
    let data = req.body.data;
    try{
        var workbook = new Excel.Workbook();
        var worksheet = workbook.addWorksheet(data[0].data.quarter);
        worksheet = sheetStyle(worksheet);

        let rowIndex = 2;
        data.forEach(obj=>{
            let tobj = fillValues(worksheet, {name:obj.name, designation:obj.designation, data:obj.data}, rowIndex);
            worksheet = tobj.worksheet;
            rowIndex = tobj.totalCell+1;
        })

        worksheet.mergeCells("'A2:A"+Number(rowIndex-1)+"'");
        
        var tempFilePath = tempfile('.xlsx');
       await workbook.xlsx.writeFile(tempFilePath);

        res.sendFile(tempFilePath, function(err){
            console.log('---------- error downloading file: ' + err);
        })
    }catch(err){
        res.status(400).json({msg:'file not found'});
    }
})

app.post('/api/sheet/teamFeedback/*', async(req, res)=>{
    let allData = req.body.data;
    try{
        var workbook = new Excel.Workbook();
        allData.forEach(obj => {
            if(obj.am.length >= 2){
                var worksheet = workbook.addWorksheet(obj.am);
                worksheet = sheetStyle(worksheet);
                let rowIndex = 2;
                obj.arr.forEach(dobj => {
                    let tobj = fillValues(worksheet, {name:dobj.name, designation:dobj.designation, data:dobj.data}, rowIndex);
                    worksheet = tobj.worksheet;
                    rowIndex = tobj.totalCell+1;
                });
                worksheet.mergeCells("'A2:A"+Number(rowIndex-1)+"'");
            }
        });
        
        var tempFilePath = tempfile('.xlsx');
        await workbook.xlsx.writeFile(tempFilePath);

        res.sendFile(tempFilePath, function(err){
            console.log('---------- error downloading file: ' + err);
        })
    }catch(err){
        res.status(400).json({msg:'file not found'});
    }
})

app.post('/api/sheet/feedback/*', async(req, res)=>{
    const {name, designation, data} = req.body.data;

    try {
        var workbook = new Excel.Workbook();
        var worksheet = workbook.addWorksheet(data.quarter);
        worksheet = sheetStyle(worksheet);
        let tobj = fillValues(worksheet, {name:name, designation:designation, data:data}, 2);
        worksheet = tobj.worksheet;
        worksheet.mergeCells("'A2:A"+Number(tobj.totalCell-1)+"'");

        var tempFilePath = tempfile('.xlsx');console.log(tempFilePath)
        await workbook.xlsx.writeFile(tempFilePath);

        res.sendFile(tempFilePath, function(err){
            console.log('---------- error downloading file: ' + err);
        })
    } catch(err) {
        res.status(400).json({msg:'file not found'});
    }
});


//xxxxxxxxxxxxxxxxxxxxxxxx GET SET PATH xxxxxxxxxxxxxxxxxxxx//

if(process.env.NODE_ENV == "production"){
	app.use(express.static('client/build'));
	app.get('*', (req, res)=>{
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
	})
}

//check the port if not found set it to '5000' then start the server//
const port = process.env.PORT || 5000;
app.listen(port, ()=>{
	console.log(`the server is running on port ${port}`);
});