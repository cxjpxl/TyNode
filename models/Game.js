
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let GameSchema = new Schema({
    nameH:{type:String,index:true}, //主队名字
    nameG:{type:String,index:true},//客队名字
    leagueName:{type:String,index:true},//联赛
    mid:{type:String,index:true},//比赛id
    time:{type:String,index:true},//比赛时间
},{collection:'game'});

exports.Game = global.cxjDbCon.model('game',GameSchema);