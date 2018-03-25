/**
 * Created by cxj on 17-8-1.
 */
const router = require('koa-router')();
const User = require('../../models/User').User;
const Urls = require('../../models/Urls').Urls;
router.get('/sl', async (ctx, next) => {
    let  data = "";
    if(global.ws&& global.ws.server&& global.ws.server.clients){
        try {
            global.ws.server.clients.forEach(ws=>{
                try {
                    if(ws && ws.myTag){
                        data = ws.myTag+","+data;
                    }
                }catch (e1){
                    console.log(e1.toString());
                }
            });
        }catch (e){
            console.log(e.toString());
        }
    }
    ctx.body = {
        no:200,
        length:global.ws?global.ws.server.clients.size:0,
        data:data,
    };
});


function  addSaiName(key,value,data) {
    if (!data[key])
    {
        data[key]= value;
    }
}



//注册接口和修改接口
//参数　userName　　　valueTime
router.post('/register',async (ctx,next)=>{
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
    let user = await User.findOne({userName: userName}).exec();
    if(user){
        msg = "时间修改成功";
    }
    console.log(msg);
    await update(User,{userName : userName},{$set:{valueTime:valueTime}});
    ctx.body = {
        no:200,
        time:valueTime,
        msg:msg,
    };

});

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


//登录接口　 参数userName　comId
router.post('/login',async (ctx,next)=>{
    let body  = ctx.request.body;
    let userName  = body.userName;
    let comId = body.comId;

    let version = body.version;
    let v = "V2.28"; //最新版本信息

    let v1 = "V2.28";

    //如果版本号不存在或者不是当前服务器对应的版本 不能使用
    if(!version ||(version!=v1 && version!=v) ){
        ctx.body = {
            no:201,
            msg:"请使用新版本"+v,
        };
        return ;
    }


    if(!userName||!comId || comId.length === 0){
        ctx.body = {
            no:201,
            msg:'参数错误!',
        };
        return ;
    }

    let user = await User.findOne({comId: comId}).exec();
    if(user && user.userName != userName){
        ctx.body = {
            no:201,
            msg:'同一台电脑只能登陆一个账户!',
        };
        return ;
    }

     user = await User.findOne({userName: userName}).exec();
    if(!user) {
        ctx.body = {
            no:201,
            msg:'用户不存在!',
        };
        return ;
    }

    console.log("userName:"+userName);

    if(user.comId.length==0){
        //用户第一次注册后的登录
        await  update(User,{userName : userName},{$set:{
            comId:comId,
        }});
    }else  if(user.comId != comId){
       ctx.body = {
           no:201,
           msg:"只能在一个电脑上面使用!",
       };
      return ;

    }


    let currentTime  = new Date().getTime();
    if(user.valueTime < currentTime){
        ctx.body = {
            no:201,
            msg:'已过期,请续费!',
        };
        return ;
    }


    await  update(User,{userName : userName},{$set:{
        loginTime:currentTime,
    }});


    //获取urls
    let urls = await Urls.findOne({userName: userName}).exec();

    ctx.body = {
        no:200,
        time:user.valueTime,
        urls:user.userName.indexOf("admin") == -1?urls.urls:"",
        msg:'登录成功!',
    };

});


//查询接口  参数userName
router.post('/queryUser',async (ctx,next)=>{
    let body  = ctx.request.body;
    let userName  = body.userName;
    if(!userName){
        ctx.body = {
            no:201,
            msg:'参数错误!',
        };
        return ;
    }

    let user = await User.findOne({userName: userName}).exec();
    if(!user) {
        ctx.body = {
            no:201,
            msg:'用户不存在!',
        };
        return ;
    }

    ctx.body = {
        no:200,
        msg:'成功!',
        user
    };

});


//修改配置权限
router.post('/addUrls',async (ctx,next)=>{
    let body  = ctx.request.body;
    let userName  = body.userName;
    if(!userName){
        ctx.body = {
            no:201,
            msg:'缺少用户名!',
        };
        return ;
    }

    if(userName.indexOf("admin")>=0){
        ctx.body = {
            no:201,
            msg:'该用户拥有多版本权限!',
        };
        return ;
    }

    let urls  = body.urls;
    // console.log(urls);
    if(!urls){
        ctx.body = {
            no:201,
            msg:'缺少配置网址!',
        };
        return ;
    }
    //
    console.log("urls",userName,typeof urls)
    console.log(await  update(Urls,{userName : userName},{$set:{
        urls :urls,
    }}))

    ctx.body = {
        no:200,
        msg:'成功!',
    };

});




module.exports = router;
