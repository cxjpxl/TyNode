/**
 * Created by cxj on 17-11-17.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MessageSchema = new Schema({
    message:{type:String,index:true},
    time:{type:Number,index:true}
},{collection:'message'});

exports.Message = global.cxjDbCon.model('message',MessageSchema);