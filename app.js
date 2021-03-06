const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const websockify = require("koa-websocket");
/********************连接数据库*****************/
const mongodb = require('./config/mongodb');
const mongoose = require('mongoose');
const AddData = require('./utlis/AddSai');
const initMail = require('./utlis/mail').initMail;
const xls = require('koa-router-xls');
//const acheck = require('./utlis/Acheck/Acheckutil');
const TXinit = require('tx-ai-utils').TXinit;

//初始化邮箱
initMail('3036518614@qq.com','bmuakgawcusqdffa','qq');

global.lianSaiData = AddData.getSaiList();
mongoose.Promise = global.Promise;
let cxjDbCon = mongoose.createConnection(mongodb.url,{
        useMongoClient: true,
    }
);
global.ws = null;
global.cxjDbCon = cxjDbCon;
console.log("mongo connected");
/*********************链接webSocket*************************/
const appWebSocket = websockify(new Koa());
appWebSocket.ws.use((ctx) => {
    ctx.websocket.on('message', function(message) {
      if(!ctx.websocket.myTag){
          try{
              let data  = JSON.parse(message.toString());
              if(data&&data.user&&data.version){
                  ctx.websocket.myTag = data.user;
                  console.log("当前连接:"+ctx.websocket.myTag+",版本:"+data.version);
              }else{
                  ctx.websocket.myTag = "guest";
                  console.log("当前连接使用旧版本:" + message.toString());
              }
          }catch (e){
              ctx.websocket.myTag = "guest";
              console.log("当前连接使用旧版本:" + message.toString());
          }
      }
       ctx.websocket.send("11");
    });
});
global.ws = appWebSocket.ws;
appWebSocket.listen(8600); //webSocket端口
console.log("webSocket on 8600");

const cors = require('koa2-cors'); //跨域处理
app.use(cors());
/*****************session的处理******************/
/*const Store = require('./lib/store');
const session = require("koa-session2");

app.use(session({
    key: "SESSIONID",   //default "koa:sess"
    store: new Store(),
    maxAge:1000*60*60*24,//一个小时有效
    httpOnly:true,
    prefix:'cxj-sess', // 存储sessoin时的前缀
}));*/
/****************楚明代码****************************/
TXinit("1106845374","hCcpXobCTUgSEDz0"); //识别码处理
// 联赛名字，{1:主队进球,0:客队进球},主队比分,客队比分,主队名字,客队名字,比赛进行的时间
/*acheck(1,100,(league,state,score1,score2,tm1,tm2,gametime)=>{


    try {
        state = parseInt(state);
        score1 = parseInt(score1);
        score2 = parseInt(score2);
        gametime = parseInt(gametime);
    }catch (error){
        console.log("error data",error);
        return ;
    }

    let data = {
        cmd:2,//表示进球的处理
        league,state,score1,score2,tm1,tm2,gametime
    };
    console.log('cxj--------',league,state,score1,score2,tm1,tm2,gametime);
    if(global.ws&& global.ws.server&& global.ws.server.clients){
        try {
            global.ws.server.clients.forEach(ws=>{
                try {
                    if(ws&&ws.myTag){
                        ws.send(JSON.stringify(data));
                    }
                }catch (e1){
                    //console.log(e1.toString());
                }
            });
        }catch (e){
            //console.log(e.toString());
        }
    }
});
*/
/*******************路由*********************/
const index = require('./routes/index');
// error handler
onerror(app);

// middlewares
app.use(bodyparser({}));//对所有类型开放
app.use(json());
app.use(logger());
app.use(xls());

/*******************公共模块*************************/
app.use(require('koa-static')(__dirname + '/public'));
/*******************模板渲染*********************/
let nunjucks = require('./lib/njk');
global.nunjucks = nunjucks;

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

/********************路由的注册****************************/
app.use(index.routes(), index.allowedMethods());

module.exports = app;
