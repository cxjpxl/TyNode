const nodemailer = require('nodemailer');
var transporter,User;
function initMail(user,pass,service){
    if(transporter){console.error("您已初始化");return;}
    User=user;
    transporter = nodemailer.createTransport({
        service: service,  
        auth: {  
            user: user,  
            pass: pass //授权码,通过QQ获取    
        } 
    });
}
// setup email data with unicode symbols
function makeOpt(to,tit,cont){
    return {  
        from: User, // 发送者  
        to: to, // 接受者,可以同时发送多个,以逗号隔开  
        subject: tit, // 标题  
        html: `<h2 ><div style="font-size:20px">${cont}</div><h2>`   
    }
}
// send mail with defined transport object
function sendMail(tit,cont,to) {
    return new Promise((resolve,reject)=>{
        transporter.sendMail(makeOpt(to,tit,cont), (error, info) => {
            if (error) {
                 console.log(error);
                return resolve({no:500});
            }
            resolve({no:200});
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    })
    
}
async function test(){
    initMail('522236495@qq.com','dybmjllzxpslbgid','qq');
    await sendMail("测试标题","测试内容",'522236495@qq.com')

}
exports.initMail=initMail;
exports.sendMail=sendMail;