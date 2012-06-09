// 王磊

function init() {
	// 若用户已登录，默认页面，展现列表
	// TODO: 后续将其隐藏起来
	showList();
	document.addEventListener("deviceready", onDeviceReady, true);
	
	var myScroll = new iScroll('wrapper', {
		hScrollbar: false, 
		vScrollbar: false, 
		snap: true,
		onScrollMove: function(that, e){
			if (scrollTimeBar && typeof scrollTimeBar == 'function') {
				scrollTimeBar(that, e);
			}
		}
	});

	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
};

var onDeviceReady = function() {
	// 文件上传对象初始化
	PictureUpload.init();
};

(function(){
	if(document.querySelector(".pub-menus")){
	    var animation = E4M.getAnimation("push");
	    animation.set("stop", function(node, newClassName, styles){
	        var pub = document.querySelector(".pub-menus");
	        var opend = pub.getAttribute("data-opened");
	        
	        if("1" != opend){
	            E4M.removeClass(".pub-menus-entry", "on");
	        }
	        
	    });
	    document.querySelector(".pub-menus").addEventListener("click", function(e){
	        e.preventDefault();
	        var opend = this.getAttribute("data-opened");
	        
	        if(opend && "1" == opend){        
	            animation.transition(".pub-menus", "push-menus", {width:"70px", right:"10px"});
	            animation.transition(".pub-menus-main", "push-menus-main", {marginLeft:"-250px"});
	            this.setAttribute("data-opened", 0);
	        }else{
	            E4M.addClass(".pub-menus-entry", "on");
	            animation.transition(".pub-menus", "push-menus", {width:"320px", right:"-52px"});
	            animation.transition(".pub-menus-main", "push-menus-main", {marginLeft:"0"});
	            this.setAttribute("data-opened", 1);
	        }
	    }, false);

	    document.querySelector(".pub-menus-other").addEventListener("click", function(e){
	        e.preventDefault();
	        e.stopPropagation();
	    }, false);  
	} 
})();