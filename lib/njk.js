
const nunjucks = require('nunjucks');
//初始化nunjuck的模板使用，以及调用方法
function createEnv(path, opts) {
    var
        autoescape = opts.autoescape === undefined ? true : opts.autoescape,
        noCache = opts.noCache || false,
        watch = opts.watch || false,
        throwOnUndefined = opts.throwOnUndefined || false,
        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader(path || 'views', {
                noCache: noCache,
                watch: watch,
            }), {
                autoescape: autoescape,
                throwOnUndefined: throwOnUndefined
            });
    if (opts.filters) {
        for (var f in opts.filters) {
            env.addFilter(f, opts.filters[f]);
        }
    }
    return env;
}

function format(D,fmt) {//Date转换为字串表达(D=Date或Date的字串,fmt=格式，目前只支持"yyyy,mm,dd,hh,nn,ss"几个符号)
    if(String==D.constructor || Number==D.constructor)
        D=new Date(D);
    var d=(100000000+10000*D.getFullYear()+100*(D.getMonth()+1)+D.getDate()).toString();
    var t=(1000000+10000*D.getHours()+100*D.getMinutes()+D.getSeconds()).toString();
    return fmt.replace("yyyy",d.substr(1,4)).replace("mm",d.substr(5,2)).replace("dd",d.substr(7,2)).replace(
        "hh",t.substr(1,2)).replace("nn",t.substr(3,2)).replace("ss",t.substr(5,2)).replace("yy",d.substr(3,2));
};

//创建模板
//noinspection JSAnnotator
let env = createEnv('views', {
    watch: true,
    noCache:false,//正式环境要使用true
    filters: {
        hex: function (n) {
            return '0x' + n.toString(16);
        },
        parseInt:function(num) {
        	return parseInt(num);
        },
        timeParse:function(d){
            let t = format(d,"yyyy-mm-dd hh:nn:ss")
            // let t = new Date(d).getTime();
            console.log(t);

            return t;
        }
    }
});
module.exports = env;