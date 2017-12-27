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

var findNet = require('find-net');
findNet.init(/皇冠体育|体育投注|真人娱乐|AG视讯|MG电子|电子游艺|电子娱乐|体育赛事|彩票游戏|百家乐|赌博|新葡京|威尼斯|金沙|波音/,2,8);


global.lianSaiData = AddData.getSaiList();
mongoose.Promise = global.Promise;
let cxjDbCon = mongoose.createConnection(mongodb.url,{
        useMongoClient: true,
    }
);
global.cxjDbCon = cxjDbCon;
console.log("mongo connected");
/*********************链接webSocket*************************/
const appWebSocket = websockify(new Koa());
global.ctxs = [];
appWebSocket.ws.use((ctx) => {


    ctx.websocket.on('message', function(message) {
      //  console.log("收到消息:"+message+"\n当前连接个数:"+global.ctxs.length);
        if(ctx&&!ctx.tag){
            ctx.tag = new Date().getTime();
            global.ctxs .push(ctx);
            console.log("有连接,当前连接个数"+global.ctxs.length);
        }
        ctx.websocket.send("11");
    });
    ctx.websocket.on('close', function(){
        for(let i= 0 ; i < global.ctxs.length ; i ++){
            if(global.ctxs [i]&&ctx&&ctx.tag&&global.ctxs [i].tag == ctx.tag){
                global.ctxs.splice(i, 1);
                console.log("有断开,当前连接个数"+global.ctxs.length);
                break;
            }
        }
    });
});
appWebSocket.listen(8600); //webSocket端口
console.log("webSocket on 8600");
/*****************session的处理******************/
const Store = require('./lib/store');
const session = require("koa-session2");
const cors = require('koa2-cors'); //跨域处理
app.use(cors());
app.use(session({
    key: "SESSIONID",   //default "koa:sess"
    store: new Store(),
    maxAge:1000*60*60*24,//一个小时有效
    httpOnly:true,
    prefix:'cxj-sess', // 存储sessoin时的前缀
}));

/*******************路由*********************/
const index = require('./routes/index');
// error handler
onerror(app);

// middlewares
app.use(bodyparser({}));//对所有类型开放
app.use(json());
app.use(logger());

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
