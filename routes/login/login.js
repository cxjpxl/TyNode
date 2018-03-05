/**
 * Created by cxj on 17-8-1.
 */
const router = require('koa-router')();
const User = require('../../models/User').User;


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
    if(!userName||!comId){
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

    console.log("userName:"+userName);

    if(user.comId.length==0){
        //用户第一次注册后的登录
        await  update(User,{userName : userName},{$set:{
            comId:comId,
        }});
    }else  if(user.comId != comId){
       ctx.body = {
           no:201,
           msg:"只能在"+user.userName+"电脑上面使用!",
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

    ctx.body = {
        no:200,
        time:user.valueTime,
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


module.exports = router;
