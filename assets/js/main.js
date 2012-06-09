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