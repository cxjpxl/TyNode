/**
 * Created by cxj on 17-8-1.
 */
var config = require("./config");

let mongodb = {
    url:'mongodb://localhost/'+config.cxjDb,
};
module.exports = mongodb;