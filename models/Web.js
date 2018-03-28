/**
 * Created by cxj on 17-11-13.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let WebSchema = new Schema({
    userName:{type:String,index:true}, //用户名
    url:{type:String,default:""}, //网址
    sys:{type:String,default:""},//系统
    money:{type:String,default:""},//金额
    webUser:{type:String,default:""},//网址的账户
    webPwd:{type:String,default:""},//网址密码
    time:{type:Number,default:0},//时间
    timeChina:{type:String,default:""},//中文时间
},{collection:'web'});
exports.Web = global.cxjDbCon.model('web',WebSchema);