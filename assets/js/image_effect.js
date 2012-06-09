//ip
// editor tool functions
;(function(){
	"use strict";
	var tmpCanvas = document.createElement('canvas');
	var tmpContext = tmpCanvas.getContext('2d');
	
	function exportTo(objects,toObject,overRide){
		if(!toObject){
			toObject = window;
		}
		for(var i in objects){
			if(objects.hasOwnProperty(i)){
				if(toObject.hasOwnProperty(i) && !overRide){
					continue;
				}else{
					toObject[i] = objects[i];
				}
			}
		}
	}
	
	
	/*********************************
	 * getDataURL
	 **********************************/
	function getDataURL(imageData,effectFn,modifySource,effectFnThisPoint,effectFnArguments){
		// effectFn sample:
		//       
		//
		//
		tmpCanvas.width = imageData.width;
		tmpCanvas.height = imageData.height;
		var destImageData = imageData;;
		if(effectFn && effectFn.apply){
			//using Array.prototype.map
			var d = imageData;
			if(!modifySource){
				d = tmpContext.createImageData(imageData.width,imageData.height);
				d.length = 0;
				Array.prototype.map.call(d.data,function(item,i,arr){
					arr[i] = imageData.data[i];
				});
			}
			if(arguments.length > 4){
				var thisObj = effectFnThisPoint;
				var effectFnArgs = Array.prototype.splice.apply(arguments,[4]);
				effectFnArgs.unshift(d);
				effectFn.apply(thisObj,effectFnArgs);
			}else{
				effectFn(d);
			}
			destImageData = d;
		}
		tmpContext.putImageData(destImageData,0,0);
		return tmpCanvas.toDataURL();
	}
	
	function getClipImageURL(img,x,y,w,h){
		_setImageToCanvas(tmpCanvas,img,x,y,w,h);
		return tmpCanvas.toDataURL();
	}
	function getClipDataImage(img,x,y,w,h){
		if(arguments.length==1){
			x = y = 0;
			w = img.width;
			h = img.height;
		}
		_setImageToCanvas(tmpCanvas,img,x,y,w,h);
		return tmpContext.getImageData(0,0,w,h);
	}
	function _setImageToCanvas(canvas,img,x,y,w,h){
		if(x === undefined)x = 0;
		if(y === undefined)y = 0;
		if(w === undefined)w = img.width;
		if(h === undefined)h = img.height;
		canvas.width = w;
		canvas.height = h;
		canvas.getContext('2d').clearRect(0,0,w,w);
		canvas.getContext('2d').drawImage(img,x,y,w,h,0,0,w,h);
	}
	
	/*
	example:
	getDataURL(data,defaultEffectFns.gray,false,null,{r:.1,g:.4,b:.3});
	*/
	var defaultEffectFns = {
		'gray':function(imageData,args){
			if(!args){
				args = {
					'r':0.299,
					'g':0.587,
					'b':0.114
				};
			}
			//console.info('gray',args)
			var dd = imageData.data;
			for(var i=0;i<dd.length/4;++i){
				var gray = args.r*dd[i*4] + args.g*dd[i*4+1] + args.b*dd[i*4+2];
				dd[i*4] =gray;
				dd[i*4+1]=gray;
				dd[i*4+2]=gray;
			}
		},
		'alpha':function(imageData,alpha){
			if(!alpha){
				alpha = 0.5;
			}
			var dd = imageData.data;
			for(var i=0;i<dd.length/4;++i){
				dd[i*4+3] *=alpha;
			}
		}
	}
	
	/*
	exportTo({
		'getDataURL':getDataURL,
		'getClipDataImage':getClipDataImage,
		'defaultEffectFns':defaultEffectFns
	},window);
	*/
	
	var ImageEffector = function(el){
		this.el = el;
	}
	ImageEffector.prototype = {
		process:function(el,callback){
			callback(getDataURL(getClipDataImage(el),defaultEffectFns['alpha']),el);
		}
	};
	window.ImageEffector = ImageEffector;
}());

