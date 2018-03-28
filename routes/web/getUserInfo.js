/**
 * Created by cxj on 17-11-15.
 */
const router = require('koa-router')();
const Web = require('../../models/Web').Web;
//参数message   参数  user   pwd   all
router.get('/getUserInfo', async (ctx, next) => {
    let ctx_query = ctx.query;
    let user = [
        {userName:"admin1"}, {userName:"admin2"}, {userName:"admin3"},{userName:"admin4"},
        {userName:"admin5"}, {userName:"admin6"},{userName:"admin7"}, {userName:"admin8"},
        {userName:"admin1001"}, {userName:"admin1002"}, {userName:"admin1003"},{userName:"admin1004"},
        {userName:"admin2001"}, {userName:"admin2002"}, {userName:"admin2003"},{userName:"admin2004"},
        {userName:"admin3001"},
        {userName:"VIP4"},{userName:"VIP5"},
        ];
    if(ctx_query.user){
        user = [{userName:ctx_query.user}]
    }
    let data ;
    if(ctx_query.all){
         data = await Web.find({}).exec();
    }else {
         data = await Web.find({$or: user}).exec();
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
