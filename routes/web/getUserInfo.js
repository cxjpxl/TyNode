/**
 * Created by cxj on 17-11-15.
 */
const router = require('koa-router')();
const Web = require('../../models/Web').Web;
//参数message
router.get('/getUserInfo', async (ctx, next) => {
    let user = [
        {userName:"admin1"}, {userName:"admin2"}, {userName:"admin3"},{userName:"admin4"},
        {userName:"admin5"}, {userName:"admin6"},{userName:"admin7"}, {userName:"admin8"},
        {userName:"admin1001"}, {userName:"admin1002"}, {userName:"admin1003"},{userName:"admin1004"},
        {userName:"admin2001"}, {userName:"admin2002"}, {userName:"admin2003"},{userName:"admin2004"},
        {userName:"VIP4"},{userName:"VIP5"}];

   /* let user = [
        {userName:"cxj"}, {userName:"admin-cxj"}];*/

    let webs = await Web.find({$or: user}).exec();



    ctx.body={
        no:200,
        webs,
        msg:'发送成功',
    }
});



module.exports = router;
