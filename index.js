const path = require('path');
const express = require('express');
const connectDB = require('./config/dataBase');

const userModel = require('./src/models/user');
const designerModel = require('./src/models/designer');
const designerDataModel = require('./src/models/designerData');
const JSZip = require("jszip");

const app = express();
app.use(express.json({ limit: '100mb', extended:true }));

/*app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, x-auth-token');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});*/

app.use('/api/user', require('./src/routes/users'));
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/designer', require('./src/routes/designer'));
app.use('/api/sheet', require('./src/routes/sheet'));
app.use('/api/key', require('./src/routes/key'));
app.use('/api/designer_data', require('./src/routes/designerData'));

app.use('/api/backup', async(req, res) => {
    let managers = await userModel.find({ });
    let designers = await designerModel.find({ });
    let designerData = await designerDataModel.find({ });

    const zip = new JSZip();
    zip.folder("database_backup").file(`managers.json`, JSON.stringify(managers));
    zip.folder("database_backup").file(`designers.json`, JSON.stringify(designers));
    zip.folder("database_backup").file(`designerData.json`, JSON.stringify(designerData));
    zip.file("README.md", "backup database data - "+new Date());
    
    zip.generateAsync({ type: "base64" }).then((base64) => {
        let tzip = Buffer.from(base64, "base64");
        res.send(tzip);
    })
});

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