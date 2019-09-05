/**
 * Created by cxj on 17-11-15.
 */
const router = require('koa-router')();
const Web = require('../../models/Web').Web;
const User = require('../../models/User').User;

var request = require('request');
const getOCRContent = require('tx-ai-utils').getOCRContent;



//角球单独处理 jiaoQiu   noTime  角球接口就这两个参数
router.get('/getTime', async (ctx, next) => {
        ctx.body = {
            no:200,
            time:new Date(),
        };
});


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

//角球单独处理 jiaoQiu   noTime  角球接口就这两个参数
router.get('/getJiaoQiuInfo', async (ctx, next) => {
    let ctx_query = ctx.query;
    let data ;
    let time = new Date().getTime()- 20*24*60*60*1000;

    let myUsers = [
        {userName:"VIP11"}, {userName:"VIP10"},
        {userName:"VIP12"}, {userName:"VIP13"},
    ];
    //角球单独处理
    if(ctx_query.jiaoQiu){
        if(ctx_query.noTime){
            data = await Web.find({$or: myUsers}).sort({time:-1}).exec();
        }else {
            data = await Web.find({$or: myUsers,time:{$gte:time}}).sort({time:-1}).exec();
        }
        if(!data || data.length == 0){
            ctx.body = {
                msg:"暂无数据",
            };
            return ;
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
        return ;
    }else {
        ctx.body = {
            msg:"参数错误",
        };
    }
});


//参数message   参数  user   pwd   all  sys

router.get('/getUserInfo', async (ctx, next) => {
    let ctx_query = ctx.query;
    let data ;
    let time = new Date().getTime()- 20*24*60*60*1000;

    let user = [
        {userName:"admin1"}, {userName:"admin2"}, {userName:"admin3"},
        {userName:"admin5"}, {userName:"admin6"},{userName:"admin7"}, {userName:"admin8"},
        {userName:"admin9"}, {userName:"admin10"},{userName:"admin11"},{userName:"admin12"},
        {userName:"admin13"}, {userName:"admin14"},{userName:"admin15"},{userName:"admin16"},
        {userName:"admin20"},{userName:"admin21"},
        {userName:"admin31"},{userName:"admin32"},{userName:"admin33"},
        {userName:"admin99"},{userName:"admin100"},
        {userName:"admin1001"}, {userName:"admin1002"}, {userName:"admin1003"},{userName:"admin1004"},
        {userName:"admin4001"},{userName:"admin4002"},{userName:"admin4003"},
        {userName:"admin4004"}, {userName:"admin4005"}, {userName:"admin4006"},
        {userName:"admin4007"}, {userName:"admin4008"}, {userName:"admin4009"},
        {userName:"admin4010"},  {userName:"admin4011"},
        {userName:"admin5002"},{userName:"admin5003"},
        {userName:"admin6001"},  {userName:"admin6002"},
        {userName:"admin_wa001"},  {userName:"admin_wa002"},
        {userName:"admin_pai001"},  {userName:"admin_pai002"},
        {userName:"admin_shi001"},
        {userName:"admin_bin001"},{userName:"admin_xi001"},{userName:"admin_min001"},
        {userName:"admin_xiong001"},{userName:"admin_xiong002"},{userName:"admin_xiong003"},
        {userName:"admin_xiong004"},{userName:"admin_xiong005"},
        {userName:"admin_shui001"},{userName:"admin_chu001"},{userName:"admin_jin001"},
        {userName:"admin_min001"},{userName:"admin_zheng001"},{userName:"admin_lu001"},
        {userName:"admin_zhu001"}, {userName:"admin_lin001"},
        {userName:"admin_wen001"}, {userName:"admin_long001"}, {userName:"admin_bao001"},
        {userName:"admin_bull001"}, {userName:"admin_bull002"}, {userName:"admin_bull003"},
        {userName:"admin_bull004"}, {userName:"admin_bull005"}, {userName:"admin_bull006"},
        {userName:"admin_bull007"}, {userName:"admin_bull008"}, {userName:"admin_bull009"},
        {userName:"admin_bull010"},
        {userName:"admin_gui1"},{userName:"admin_gui2"},{userName:"admin_gui3"},
        {userName:"VIP1"},{userName:"VIP4"},{userName:"VIP5"},{userName:"VIP9"},
        {userName:"VIP14"},
        {userName:"VIP21"},{userName:"VIP22"},{userName:"VIP23"},{userName:"VIP24"},{userName:"VIP25"},
        ];
    if(ctx_query.user){
        user = [{userName:ctx_query.user}]
    }

    if(ctx_query.sys){  //查系统
        if(ctx_query.all){
            data = await Web.find({sys:ctx_query.sys}).sort({url:-1}).exec();
        }else {
            data = await Web.find({sys:ctx_query.sys,$or: user}).sort({time:-1}).exec();
        }
    }else{
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
    }
    let doc = [];
    let num  = 0 ;
    console.log("data.len = "+ data.length);
    for(let i = 0 ; i < data.length ; i ++){
        if(!doc[num]) {
            doc[num]={}
        }else{
            doc[num]["用户"] = data[i].userName?data[i].userName:"未知";
            doc[num]["网址"] = data[i].url?data[i].url:"未知";
            doc[num]["系统"] = data[i].sys?data[i].sys:"未知";
            doc[num]["金额"] = data[i].money?data[i].money:"未知";
            doc[num]["账户"] = data[i].webUser?data[i].webUser:"未知";
            if(ctx_query.pwd){
                doc[num]["密码"] = data[i].webPwd?data[i].webPwd:"未知";
            }
            doc[num]["时间"]=data[i].timeChina?data[i].timeChina:"未知";
            num  ++;
        }
    }
    console.log("doc.len = "+ doc.length);
    ctx.downloadXLS(doc,'web');
});



module.exports = router;
