/**
 * Created by cxj on 17-11-13.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    userName:{type:String,index:true}, //用户名
    comId:{type:String,default:""}, //电脑唯一设备
    valueTime:{type:Number,index:true},//账户使用有效期
    loginTime:{type:String,default:""},//账户登录时间
    fun:{type:Number,default:0},//账户功能   0点球   1是角球   2是点球+角球
    hasJinQiuFun:{type:Boolean,default:false},//是否有进球的功能 true是有   false没有
    has40Enbale:{type:Boolean,default:false},//是否有40分钟的角球功能
},{collection:'user'});

exports.User = global.cxjDbCon.model('user',UserSchema);