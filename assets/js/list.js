// 德模,haiyu

function getPhotos(result) {
	if (result.ret === -1) {
		alert("用户不存在");
		return;
	}
	if (result.ret != 0) {
		alert("服务器繁忙，请稍后重试");
		return;
	}
	var listHtml = [];
	var data = result.data;
	if (data.length == 0) {
		$("#list").html("暂时没有数据，上传照片？<a href='#photo'>上传<a>");
		return;				
	}
	for (var i = 0; i < data.length; i++) {
		var itemHtml = "";
		var desc = data[i].description;
		var src = data[i].path;
		var upload_time = data[i].upload_time;
		if ( i % 2 == 0) {
			itemHtml = '<div class="item_even"><ul><li><img src="' + src + '"></img></li><li class="text">' + upload_time + '<br/>' + desc + '</li></ul></div>';
		} else {
    		itemHtml = '<div class="item_odd"><ul><li class="text">' + upload_time + '<br/>' + desc + '</li><li><img src="' + src + '"></img></li></ul></div>';
		}
	    listHtml.push(itemHtml);
	}
	$("#list").html(listHtml.join(''));
}

var showList = function() {
	//$("#content div").hide();
	//$("#list").show();
	window.location.hash="#main";
	var userId = CookieUtil.get("userid");
	// 展现
	ChildObj.getPhotoList(userId);
	/*
	var userId = CookieUtil.get("userid");
	$.getScript(webContext + "/ImageServlet?cmd=query&userId=" + userId).error(function(){
		$("#list").html("服务器繁忙，请稍后重试！");
	});
	*/
}