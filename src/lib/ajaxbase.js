let config={
    classHost:'127.0.0.1'//api的基础地址
    //classHost:'192.168.197.144'
};

//ajax基础model，用于集成mock数据,后续其他全局ajax封装都可以写在这里面
export class BaseModel{
    constructor(opts){
        this.opts=opts;
        this.init();
    }

    init(){
        var opts=this.opts;
        if(this.opts.mock&&window.mockData){//url后有mock参数，且ajax手动添加了mock参数，才会走mock，正常url请求都是走线上数据
            this.promise=new Promise(function(resolve,reject){
                setTimeout(function(){
                    resolve(window.mockData[opts.mockUrl||opts.url]);
                },1000);//settimeout模仿ajax；虽然不是很完美，但却非常简单，暂时这么用
            });
        }else{
            this.promise=new Promise(function(resolve,reject){
                var host=getClassWebapiHost();
                if(opts.type=="get"){
                    $.ajax({
                        type:(opts&&opts.type)?opts.type:"get",
                        url:host+opts.url,
                        data:opts.data,
                        success:function(data){
                            if(data.status==0){//成功
                                resolve(data)//在异步操作成功时调用
                            }else{//status不为0表示失败
                                reject(data);//在异步操作失败时调用
                            }
                        },
                        //异常error
                        error:function(e){//通用网络错误不作处理
                            console.log(e);
                        }
                    });
                }else{
                    $.ajax({
                        type:(opts&&opts.type)?opts.type:"get",
                        url:host+opts.url,
                        data:JSON.stringify(opts.data),
                        dataType: 'json',//如果不用dataType，默认传的是form数据，数据只能传一层，多层的数据会按照属性遍历分开传
                        contentType: 'application/json',
                        success:function(response){
                            if(response.status==0){//成功
                                resolve(response)//在异步操作成功时调用
                            }else{//status不为0表示请求失败
                                reject(response);//在异步操作失败时调用
                            }
                        },
                        //异常error
                        error:function(e){
                            console.log(e);
                        }
                    });
                    
                }
                
            })
        }
    }
}

export function getClassWebapiHost() {
    let webapiHost,
        host = location.host;
    if (/^local/i.test(host)) {
        //debugger
        //接口发布到哪个分支环境就配成哪个分支环境
        //webapiHost = `//${config.classHost}`;
        webapiHost = '/webapi';
        
    } else if (/^qa\d/i.test(host)) {
        let mstrs = location.host.match(/^qa\d/i);
        let qa=mstrs?mstrs[0]:'qa1';
        webapiHost = `//${qa}${config.classHost}/crmapi/promotion`;
    } else if (/^qa/i.test(host)) {
        webapiHost = `//qa${config.classHost}/crmapi/promotion`;
    } else if (/^yz/i.test(host)) {
        webapiHost = `//yz${config.classHost}/crmapi/promotion`;
    } else {
        webapiHost = `//${config.classHost}/crmapi/promotion`;
    }
    return webapiHost;
}

//获取环境
export function getENV() {
    let host = location.host;
    if (/^local/i.test(host)) {
        return 'local';
    } else if (/^qa\d?/i.test(host)) {
        return 'qa';
    } else if (/^yz/i.test(host)) {
        return 'yz';
    } else {
        return '';
    }
}
