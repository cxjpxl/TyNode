/**
 * Created by cxj on 17-11-13.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    userName:{type:String,index:true}, //用户名
    comId:{type:String,default:""}, //电脑唯一设备
    valueTime:{type:Number,index:true},//账户使用有效期
},{collection:'user'});
exports.User = global.cxjDbCon.model('user',UserSchema);