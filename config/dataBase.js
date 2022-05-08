const mongoose = require('mongoose');
const config = require('config');

const connectDB = (url) => {
    const db = mongoose.createConnection(url, {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex:true
    });
    return db;
}

const adminDB = connectDB(config.get("mongoURI1"));
const designerDB = connectDB(config.get("mongoURI2"));

exports.adminDB = adminDB,
exports.designerDB = designerDB;