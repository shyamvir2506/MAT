const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {adminDB} = require('../../config/dataBase');

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
    },
    deactivated:{
        type:String
    }
});


module.exports = Designer = adminDB.model("designer", DesignerSchema);