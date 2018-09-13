const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let EUserSchema = new Schema({
    userName:{type:String,index:true}, //用户名
    comId:{type:String,default:""}, //电脑唯一设备
    valueTime:{type:Number,index:true},//账户使用有效期
    loginTime:{type:String,default:""},//账户登录时间
    fun:{type:Number,default:0},//0  1 2  0是上   1是中   2是下
},{collection:'euser'});

exports.EUser = global.cxjDbCon.model('euser',EUserSchema);