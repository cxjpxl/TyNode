/**
 * Created by cxj on 17-8-1.
 */
const router = require('koa-router')();
const EUser = require('../../models/EUser').EUser;
let v = require('../../utlis/config').v;
let v1 = require('../../utlis/config').v1;

function update(model,query,update){
    return new Promise((resolve,reject)=>{
        model.update(query,update,{upsert: true},(err, data)=>{
            if(!err){
                resolve({no:200});
            }else{
                resolve(err);
            }
        });
    })
}
//注册接口和修改接口
//参数　userName　　　valueTime
router.post('/e_register',async (ctx,next)=>{
    let body  = ctx.request.body;
    let userName  = body.userName;
    let valueTime = body.valueTime;
    if(!userName || !valueTime){
        ctx.body = {
            no:201,
            msg:'参数错误!',
        };
        return ;
    }


    if(typeof (valueTime) != "number"){
        ctx.body = {
            no:201,
            msg:'时间格式错误',
        };
        return ;
    }

    let msg = "注册成功";
    let eUser = await EUser.findOne({userName: userName}).exec();
    if(eUser){
        msg = "时间修改成功";
    }
    if(body.fun==undefined || body.fun == null){
        await update(EUser,{userName : userName},{$set:{valueTime:valueTime}});
        msg = msg + "\n用户功能不变"
    }else{
        await update(EUser,{userName : userName},{$set:{valueTime:valueTime,fun:body.fun}});
        msg = msg + "\n用户功能为"+body.fun;
    }
    ctx.body = {
        no:200,
        time:valueTime,
        msg:msg,
    };

});

//登录接口　 参数userName　comId  version
router.post('/e_login',async (ctx,next)=>{
    let body  = ctx.request.body;
    let userName  = body.userName;
    let comId = body.comId;
    let version = body.version;

    //如果版本号不存在或者不是当前服务器对应的版本 不能使用
    if(!version ||(version!=v1 && version!=v) ){
        ctx.body = {
            no:201,
            msg:"请使用新版本"+v,
        };
        return ;
    }

    console.log("1");
    if(!userName||!comId || comId.length === 0){
        ctx.body = {
            no:201,
            msg:'参数错误!',
        };
        return ;
    }
    console.log("2");
    let eUser = await EUser.findOne({comId: comId}).exec();
    if(eUser && eUser.userName != userName){
        ctx.body = {
            no:201,
            msg:'同一台电脑只能登陆一个账户!',
        };
        return ;
    }

    eUser = await EUser.findOne({userName: userName}).exec();
    if(!eUser) {
        ctx.body = {
            no:201,
            msg:'用户不存在!',
        };
        return ;
    }
    console.log("3");
    if(eUser.comId.length==0){
        //用户第一次注册后的登录
        await  update(EUser,{userName : userName},{$set:{
            comId:comId,
        }});
    }else  if(eUser.comId != comId){
        ctx.body = {
            no:201,
            msg:"只能在一个电脑上面使用!",
        };
        return ;

    }

    console.log("4");
    let currentTime  = new Date().getTime();
    if(eUser.valueTime < currentTime){
        ctx.body = {
            no:201,
            msg:'已过期,请续费!',
        };
        return ;
    }
    console.log("5");
    currentTime = currentTime +"";
  /*  await  update(eUser,{userName : userName},{$set:{
        loginTime:currentTime,
    }});*/

    console.log("6");
    ctx.body = {
        no:200,
        time:eUser.valueTime,
        msg:'登录成功!',
        fun:eUser.fun?eUser.fun:0,
    };

});


//查询接口  参数userName
router.post('/e_queryUser',async (ctx,next)=>{

    let body  = ctx.request.body;
    let userName  = body.userName;
    if(!userName){
        ctx.body = {
            no:201,
            msg:'参数错误!',
        };
        return ;
    }

    let eUser = await EUser.findOne({userName: userName}).exec();
    if(!eUser) {
        ctx.body = {
            no:201,
            msg:'用户不存在!',
        };
        return ;
    }
    ctx.body = {
        no:200,
        msg:'成功!',
        eUser,
    };


});



module.exports = router;
