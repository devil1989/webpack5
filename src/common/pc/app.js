import "ie8-hack";//如果想要比较完整的hack，得用ie8-hack文件
import './sass/app.scss';//pc所有页面公共的css

if(window.$&&window.$.ajaxSettings){
	window.$.ajaxSettings.xhrFields = {
		withCredentials: true
	};
}

if (!window.console) {//防止console报错导致页面出错
    window.console = {
        log: () => {},
        error: () => {},
        warn: () => {}
    };
}


//mock数据:url后面添加mock=1【会加载mock数据】，ajax请求参数中添加参数mock:true,即可两个条件都成立才会走mock；如果url后面没有添加mock，哪怕开发人员忘了在请求中注释掉mock=true，也没关系
window.mockData={};
if(/(\?mock$)|(\?mock(\&|\=))|(\&mock$)|(\&mock(\&|\=))/.test(location.search)){//是否mock
	require.ensure([],function(require){
		window.mockData=require('../../../mock/index.js').default;
	});
}

//上线前判断时候有yz或者qa的静态资源
function getWarn(){
	if(window&&document.querySelectorAll&&!/(qaclass\.|yzclass\.|local\.|localhost)/.test(location.href)){
		let hasQa=false,hasYz=false;
		let links=document.querySelectorAll("link[rel='stylesheet']")||[];
		let scripts=document.querySelectorAll("script[src]")||[];
		
		links.forEach(function(unit,idx){
			if(/qares\./.test(unit.href)){
				hasQa=true;
			}
			if(/yzres\./.test(unit.href)){
				hasYz=true;
			}
		});
		scripts.forEach(function(unit,idx){
			if(/qares\./.test(unit.src)){
				hasQa=true;
			}
			if(/yzres\./.test(unit.src)){
				hasYz=true;
			}
		});

		if(hasQa){
			console.error("线上环境页面包含qa环境的代码，请检查js和css链接是否正确");
		}
		if(hasYz){
			console.error("线上环境页面包含yz环境的代码，请检查js和css链接是否正确");
		}
	}
}

getWarn();

// module.exports = window