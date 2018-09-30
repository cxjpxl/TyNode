/**
 * Created by cxj on 17-11-17.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let OrderSchema = new Schema({
    message:{type:String,index:true},
    time:{type:Number,index:true}
},{collection:'order'});

exports.Order = global.cxjDbCon.model('order',OrderSchema);