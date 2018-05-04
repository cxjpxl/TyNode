/**
 * Created by cxj on 17-11-15.
 */
const router = require('koa-router')();
const Web = require('../../models/Web').Web;


var request = require('request');
const getOCRContent = require('tx-ai-utils').getOCRContent;




/**
 *  参数   base64:""
 * */
router.post('/getCode', async (ctx, next) => {
    let body  = ctx.request.body;
    let base64  = body.base64;
    let codeRlt = await  getOCRContent(base64);
    if(codeRlt === null) codeRlt = "";
    codeRlt = codeRlt.replace(" ","");
    //不能含有中文
    let reg = /^[0-9a-zA-Z]+$/
    if(!reg.test(codeRlt)){
        codeRlt = "";
    }
    //长度必须为4
    if(codeRlt.length!= 4){
        codeRlt = "";
    }
    ctx.body = {
        code:codeRlt,
    };
});


//参数message   参数  user   pwd   all
router.get('/getUserInfo', async (ctx, next) => {
    let ctx_query = ctx.query;
    let user = [
        {userName:"admin1"}, {userName:"admin2"}, {userName:"admin3"},{userName:"admin4"},
        {userName:"admin5"}, {userName:"admin6"},{userName:"admin7"}, {userName:"admin8"},
        {userName:"admin9"}, {userName:"admin10"},{userName:"admin11"},
        {userName:"admin1001"}, {userName:"admin1002"}, {userName:"admin1003"},{userName:"admin1004"},
        {userName:"admin2001"}, {userName:"admin2002"}, {userName:"admin2003"},{userName:"admin2004"},
        {userName:"admin3001"},
        {userName:"VIP1"},{userName:"VIP4"},{userName:"VIP5"},{userName:"VIP3"}
        ];
    if(ctx_query.user){
        user = [{userName:ctx_query.user}]
    }
    let time = new Date().getTime()- 10*24*60*60*1000;
    let data ;

    if(ctx_query.noTime){
        if(ctx_query.all){
            data = await Web.find({}).sort({time:-1}).exec();
        }else {
            data = await Web.find({$or: user}).sort({time:-1}).exec();
        }
    }else{
        if(ctx_query.all){
            data = await Web.find({time:{$gte:time}}).sort({time:-1}).exec();
        }else {
            data = await Web.find({$or: user,time:{$gte:time}}).sort({time:-1}).exec();
        }
    }



    let doc = [];
    for(let i = 0 ; i < data.length ; i ++){
        if(!doc[i]) doc[i]={};
        doc[i]["用户"] = data[i].userName;
        doc[i]["网址"] = data[i].url;
        doc[i]["系统"] = data[i].sys;
        doc[i]["金额"] = data[i].money;
        doc[i]["账户"] = data[i].webUser;
        if(ctx_query.pwd){
            doc[i]["密码"] = data[i].webPwd;
        }
        doc[i]["时间"]=data[i].timeChina;

    }
    ctx.downloadXLS(doc,'web');
});



module.exports = router;
