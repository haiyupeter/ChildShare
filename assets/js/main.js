// 王磊

function init() {
	// 若用户已登录，默认页面，展现列表
	// TODO: 后续将其隐藏起来
	showList();
	document.addEventListener("deviceready", onDeviceReady, true);
}
var onDeviceReady = function() {
	// 文件上传对象初始化
	PictureUpload.init();
}