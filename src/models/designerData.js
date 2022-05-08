const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { designerDB } = require('../../config/dataBase');

const DesignerDataSchema = new Schema({
    values:Array,
    key:String
 });

module.exports = DesignerData = designerDB.model("designers", DesignerDataSchema);