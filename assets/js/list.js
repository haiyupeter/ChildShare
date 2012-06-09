// dmyang, haiyu
var listData = {};

function template(str, obj) {
	return str.replace(/\{(\w+)\}/g, function(m) {
		return obj[m.replace(/[{}]/g, '')];
	});
};

function getPhotos(result) {
	if (result.ret === -1) {
		alert("用户不存在");
		return;
	}
	
	listData = result.data;
	
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
	var t = '\
		<li>\
			<img src="{img}"/>\
			<div class="img-info">\
				<span class="img-title">{title}</span>\
				<span class="img-comment">\
					<span class="comment-btn"></span>\
					<span class="comment-num">{comment}</span>\
				</span>\
			</div>\
		</li>';
		
	for (var i = 0; i < data.length; i++) {
		var d = data[i];
		listHtml.push(template(t, {
			img: d.path,
			title: d.description,
			comment: d.comment || 0
		}));
	}
	
	$("#list").append(listHtml.join(''));
};

var showList = function() {
	//$("#content div").hide();
	//$("#list").show();
	window.location.hash="#main";
	var userId = CookieUtil.get("userid");
	// 展现
	ChildObj.getPhotoList(userId);// $.getJSON('../data.json', function(d) {console.log(d)
	//getPhotos({'ret':'0', 'msg':'load success', 'data':[{'description':'出生了', 'path':'../img/591.jpg', 'comment':'10'},{'description':'很开心', 'path':'../img/588.jpg', 'comment':'10'},{'description':'今天小孩会坐起来玩玩具了', 'path':'../img/593.jpg', 'comment':'100'},{'description':'某一天，你也会很可爱，你是妈妈的幸福', 'path':'../img/595.jpg', 'comment':'5'},{'description':'开心开心', 'path':'../img/592.jpg', 'comment':'1200'},{'description':'开心了', 'path':'../img/599.jpg', 'comment':'15'}]});
	/*
	var userId = CookieUtil.get("userid");
	$.getScript(webContext + "/ImageServlet?cmd=query&userId=" + userId).error(function(){
		$("#list").html("服务器繁忙，请稍后重试！");
	});
	*/
};