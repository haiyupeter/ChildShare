// 王磊

function init() {
	// 默认页面，展现列表
	showList();
	document.addEventListener("deviceready", onDeviceReady, true);
}
var onDeviceReady = function() {
	// 文件上传对象初始化
	PictureUpload.init();
}