/**
 * Created by cxj on 17-11-13.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UrlsSchema = new Schema({
    userName:{type:String,index:true}, //用户名
    urls:{type:String},
},{collection:'urls'});
exports.Urls = global.cxjDbCon.model('urls',UrlsSchema);