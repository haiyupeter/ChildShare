// 王磊

function init() {
	// 若用户已登录，默认页面，展现列表
	// TODO: 后续将其隐藏起来
	showList();
	document.addEventListener("deviceready", onDeviceReady, true);
	
	var myScroll = new iScroll('wrapper', { hScrollbar: false, vScrollbar: false });

	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
};

var onDeviceReady = function() {
	// 文件上传对象初始化
	PictureUpload.init();
};

Date.prototype.pattern=function(fmt) {        
    var o = {        
    "M+" : this.getMonth()+1, //月份        
    "d+" : this.getDate(), //日        
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时        
    "H+" : this.getHours(), //小时        
    "m+" : this.getMinutes(), //分        
    "s+" : this.getSeconds(), //秒        
    "q+" : Math.floor((this.getMonth()+3)/3), //季度        
    "S" : this.getMilliseconds() //毫秒        
    };        
    var week = {        
    "0" : "\u65e5",        
    "1" : "\u4e00",        
    "2" : "\u4e8c",        
    "3" : "\u4e09",        
    "4" : "\u56db",        
    "5" : "\u4e94",        
    "6" : "\u516d"       
    };        
    if(/(y+)/.test(fmt)){        
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));        
    }        
    if(/(E+)/.test(fmt)){        
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[this.getDay()+""]);        
    }        
    for(var k in o){        
        if(new RegExp("("+ k +")").test(fmt)){        
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));        
        }        
    }        
    return fmt;        
}      


var item_length = 280;

function initScrollBar(data) {
	// set width
	$('#list_scroll').css('width', 2000);
	$('#time_line').css('width', 2000);
	// init the scrollIcon
	data = listData;
	var item_list = [];
	for (var i = 0; i < data.length; i ++) {
		left = i * item_length;
		//item_list.push('<i id="add_event_plus_' + data[i].id + '" class="spine_plus" style="left:' + left + 'px;"></i>');
		item_list.push('<i id="add_event_plus" class="spine_plus" style="left:' + left + 'px;"></i>');
		var upload_time = new Date(data[i].upload_time).pattern("MM月dd日");
		item_list.push('<div class="spine_date" style="left:' + left + 'px; top:16px;">' + upload_time + '</div>');
		
	}
	$("#time_line").append(item_list.join(''));
	
	$('#time_line .spine_plus').live('mouseover', function(e) {
		$('.spine_plus').removeClass('spine_current');
		$(this).addClass('spine_current');
	});
}

/*
function scrollCallback(x, y, data) {
	// set margin-left
	$('#list_scroll').css('margin-left', x);
}
*/

$("#time_line").bind('click', function(e){
	// $('#add_event_plus').css("left", e.offsetX);
	var offsetX = e.offsetX;
	var left = offsetX/item_length;
	alert(left);
	$('#time_line .spine_plus').removeClass('spine_current');
	$( $('#time_line .spine_plus').get(parseInt(left) + 1 )).addClass('spine_current');
});