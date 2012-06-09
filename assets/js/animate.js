/*******************************************************
 * Copyright (c) 2012, TENCENT.COM All rights reserved *
 *******************************************************/

/**
 * 效果
 * @author carlli
 * @encode utf-8
 * @version 1.0
 * @data 2012.6.9
 * @modify
 * -------------------------------------------------------------------
 * 2012.6.9  carlli  v1.0  create
 * -------------------------------------------------------------------
 * @usage
 * -------------------------------------------------------------------
 * + Animation getAnimation(String name)
 *      + Object Types
 *      + Boolean start(String type, String selector String property, int speed, int begin, int change, int duration)
 *      + void stop()
 *      + Boolean stopped()
 *      + void set(String type, Function callback, Array args, Object context)
 *      + void remove(String type)
 *      + void transform(String selector, String newClassName, Object styles)
 *      + void transition(String selector, String newClassName, Object styles)
 *      + void bind(String selector, Boolean multi)
 *      + int fixedDuration(int duration, int offset)
 *      + Object get(String type)
 *      + void destory()
 * + Object UA 
 * + void destory();
 * + void removeClass(Node|String node, String className)
 * + void addClass(Node|String node, String className)
 * + void replaceClass(Node|String node, String replaceClassName, String newClassName)
 * + Boolean checkUA(String key) 
 * -------------------------------------------------------------------
 */
 
var E4M = (function(){  
    var G_ANIMATION_MAP = null;   // Animation实例MAP
    //----------------------------------------------------------------
    /**
     * 获取Animation实例
     * @param String name 实例名称
     * @param Boolean create 在不存在时是否创建新的一个新的实例
     * @return Animation animation 
     */
    function GetAnimation(name, create){
        var instance = null;
        G_ANIMATION_MAP = G_ANIMATION_MAP || {};
        if(true === create){            
            if(!G_ANIMATION_MAP[name]){
                instance = G_ANIMATION_MAP[name] = new _Animation(name);                     
            }else{
                instance = G_ANIMATION_MAP[name];
            }
        }else{
            instance = (G_ANIMATION_MAP[name] || null);
        }
        return instance;
    };
    /**
     * 获取节点对象
     * @param Node|String node
     * @return node n
     */ 
    function GetNode(node){        
        if(typeof(node) == "string"){
            return document.querySelector(node);
        }
        return node;
    };
    /**
     * 移除指定的class
     * @param Node|String node
     * @param String className
     */ 
    function RemoveClass(node, className){
        node = GetNode(node);
        if(null != node && className){
            var cls = node.className;
            var regExp = new RegExp("[\\s ]*" + className, "g");
            cls = cls.replace(regExp, "");
            node.className = cls;
        }
        node = null;
        regExp = null;
    };
    /**
     * 添加指定的class
     * @param Node|String node
     * @param String className
     */ 
    function AddClass(node, className){
        node = GetNode(node);
        if(null != node && className){
            RemoveClass(node, className);
            node.className += " " + className;
        }
        node = null;
    };
    /**
     * 替换指定的class
     * @param Node|String node
     * @param String replaceClassName
     * @param String newClassName
     */ 
    function ReplaceClass(node, replaceClassName, newClassName){
        node = GetNode(node);
        if(null != node && replaceClassName){
            var cls = node.className;
            cls = cls.replace(replaceClassName, newClassName||"");
            node.className = cls;
        }
        node = null;
    };
    /**
     * 获取UA
     * @return Object {String ua, Boolean ios, Boolean android}
     */
    function GetUA(){
        var ua = navigator.userAgent;
        
        return {
            "ua" : ua,
            "ios" : CheckUA("iPhone|iPad|iPod|iOS|Mac OS"),
            "android" : CheckUA("Android")
        };
    };
    /**
     * 检测UA
     * @param String key 关键字
     * @return Boolean true/false
     */
    function CheckUA(key){
        var ua = navigator.userAgent;
        var r = false;
        var p = new RegExp("("+ key + ")", "i");
        
        r = p.test(ua);
        
        p = null;
        return r;
    };
    //----------------------------------------------------------------
    /**
     * 动画效果（构造函数）
     * JS动画：三次缓动效果 p(t) = t^3
     * @param String name
     */     
    var _Animation = function(name){
        this.name = name;       // 名称，唯一标识
        this.timer = null;      // 定时器
        this.Types = {          
            "IN" : "easeIn",        //in
            "OUT" : "easeOut",      //out
            "IN_OUT" : "easeInOut"  //in-out
        };
        this.on = {
            onstart : null,     //开始时的回调，{Function callback, Array args, Object context}
            onstop : null,      //停止时的回调，{Function callback, Array args, Object context}
            onprogress : null   //处理过程中的回调，{Function callback, Array args, Object context}
        };
    };
    _Animation.prototype = {
        /**
         * 执行回调函数
         * @param String type 类型
         * @param Array args 消息
         */
        execCallback : function(type, args){            
            var o = this.get(type);
            var m = args || [];
            var a = [].concat(m);
            
            if(o && o.callback){
                a = a.concat(o.args||[]);
                o.callback.apply((o.context||this), a);
            }
            
            m = null; a = null;
        },
        /**
         * 设置回调
         * @param String type 类型
         * @param Function callback 回调
         * @param Array args 参数
         * @param Object context 上下文
         */
        set : function(type, callback, args, context){
            var key = "on" + type;
            if(key in this.on){
                this.on[key] = {
                    "callback" : callback || null,
                    "args" : args || [],
                    "context" : context || this
                };
            }
        },
        /**
         * 移除回调
         * @param String type 类型
         */
        remove : function(type){
            this.on["on" + type] = null;
        },
        /**
         * 获取回调
         * @param String type 类型
         * @return Object on
         */
        get : function(type){
            return this.on["on" + type] || null;
        },
        /**
         * 渐进（由慢到快）
         * @param time 时间点
         * @param begin 起始位置
         * @param change 区间改变量（结束位置 - 起始位置）
         * @param duration 持续的时间
         */
        easeIn : function(time, begin, change, duration){
            return change * (1 - Math.cos(time / duration * (Math.PI / 2))) + begin;
        },
        /**
         * 渐出（由快到慢）
         * @param time 时间点
         * @param begin 起始位置
         * @param change 区间改变量（结束位置 - 起始位置）
         * @param duration 持续的时间
         */
        easeOut : function(time, begin, change, duration){
            return change * Math.sin(time / duration * (Math.PI / 2)) + begin;
        },
        /**
         * 渐进渐出
         * @param time 时间点
         * @param begin 起始位置
         * @param change 区间改变量（结束位置 - 起始位置）
         * @param duration 持续的时间
         */
        easeInOut : function(time, begin, change, duration){
            return change / 2 * (1 - Math.cos(Math.PI * time / duration)) + begin;
        },
        /**
         * JS自定义动画开始
         * @param String type 类型
         * @param String selector CSS选择器
         * @param String property CSS属性
         * @param int speed 速度
         * @param int begin 起始位置
         * @param int change 区间改变量（结束位置 - 起始位置）
         * @param int duration 持续的时间
         * @return Boolean true/false
         */
        start : function(type, selector, property, speed, begin, change, duration){
            var animation = this;
            var time = 0;
            var ease = this[type];
            var node = document.querySelector(selector);
            if(ease && node){
                animation.execCallback("start");
                animation.timer = setTimeout(function(){
                    var shift = ease(time, begin, change, duration);
                    
                    animation.execCallback("progress", [shift]);
                    if(time < duration){                    
                        animation.timer = setTimeout(arguments.callee, speed);
                    }else{
                        animation.stop();
                    }
                    
                    node.style[property] = shift + "px";
                    time++;                    
                }, speed);
                
                return true;
            }
            return false;
        },        
        /**
         * JS自定义动画停上
         */
        stop : function(){        
            if(null != this.timer){                
                clearTimeout(this.timer);
                this.timer = null;                
            }
            this.execCallback("stop");
        },
        /**
         * JS自定义动画是否已经停止
         * @return Boolean true/false
         */
        stopped : function(){
            return (null == this.timer);
        },
        /**
         * CSS动画
         * @param String selector CSS选择器
         * @param String newClassName 目标class
         * @param Object styles 样式集        
         */
        css : function(selector, newClassName, styles){
            var node = document.querySelector(selector);
            var ncn = newClassName || "";
            var rcn = styles || null;
            
            if(null != node){
                AddClass(node, ncn);
                
                for(var p in styles){
                    if(styles.hasOwnProperty(p)){
                        node.style[p] = styles[p];
                    }
                }
            }
            node = null;
        },
        /**
         * CSS动画(transform)
         * @param String selector CSS选择器
         * @param String newClassName 目标class
         * @param Object styles 样式集        
         */
        transform : function(selector, newClassName, styles){
            var node = document.querySelector(selector);
            if(null != node){
                var animation = this;                
                node.addEventListener("webkitAnimationEnd", function(e){
                    animation.execCallback("stop", [node, newClassName, styles]);
                    
                    this.removeEventListener("webkitAnimationEnd", arguments.callee, true);
                }, true);
                
                animation.execCallback("start");
                this.css(selector, newClassName, styles);
            }
        },
        /**
         * CSS动画(transition)
         * @param String selector CSS选择器
         * @param String newClassName 目标class
         * @param Object styles 样式集        
         */
        transition : function(selector, newClassName, styles){
            var node = document.querySelector(selector);
            if(null != node){
                var animation = this;
                node.addEventListener("webkitTransitionEnd", function(e){
                    animation.execCallback("stop", [node, newClassName, styles]);
                    
                    this.removeEventListener("webkitTransitionEnd", arguments.callee, true);
                }, true);
                
                animation.execCallback("start");
                this.css(selector, newClassName, styles);                
            }
        },
        /**
         * 绑定效果
         * @param Event e
         */
        bindEffect : function(e){
            e.preventDefault();
            
            var effect = this.getAttribute("data-effect");
            var animation = this.getAttribute("data-" + effect);
            var end = null;
            var property = null;
            var instance = GetAnimation(this.getAttribute("data-animation"));
            
            if(null != effect && null != animation && null != instance){                
                if("transition" == effect){
                    end = "webkitTransitionEnd"; 
                    property = "transition";
                }else if("transform" == effect){
                    end = "webkitAnimationEnd";
                    property = "transform";
                }else{
                    throw new Error("Unknown Animation! effect = " + effect);
                }
                
                this.addEventListener(end, function(e){
                    instance.execCallback("stop", [this]);
                    
                    this.removeEventListener(end, arguments.callee, true);
                }, false);
                
                instance.execCallback("start", [this]);
                this.style[property] = animation;
            }
        },
        /**
         * 绑定所有的
         * @param String selector CSS选择器
         */
        bindAll : function(selector){
            var list = document.querySelectorAll(selector);
            var size = list.length;
            
            for(var i = 0; i < size; i++){
                this.bindSingle(list[i]);
            }
            
            list = null;
        },
        /**
         * 绑定所有的
         * @param String selector CSS选择器
         */
        bindSingle : function(selector){
            var o = GetNode(selector);
            var eventType = null;
            if(null != o){
                o.setAttribute("data-animation", this.name);
                eventType = o.getAttribute("data-event");
                o.addEventListener(eventType, this.bindEffect, false);
            }
            
            o = null;
        },
        /**
         * 绑定
         * @param String selector CSS选择器
         * @param Boolean multi
         */
        bind : function(selector, multi){
            if(true === multi){
                this.bindAll(selector);
            }else{
                this.bindSingle(selector);
            }
        },
        /**
         * 修正持续时长，以iOS为基准
         * @param int duration 持续的时间
         * @param int offset 偏移值
         * @return int d
         */
        fixedDuration : function(duration, offset){
            var ua = GetUA();
            return (ua.ios ? duration : (duration + offset));
        },
        /**
         * 销毁
         */
        destory : function(){
            G_ANIMATION_MAP[this.name] = null;
        }
    }; // end _Animation
    
    //----------------------------------------------------------------
    (function main(){
        var animation = GetAnimation("common_animation_bind", true);
        animation.bind(".js-bind-animtions", true);
    })();
    //----------------------------------------------------------------
    //对外注册方法和属性
    return { 
        //------------------------------------------------------------------------------
        /**
         * 动画效果
         * @see _Animation
         */
        "getAnimation" : function(name){
            var instance = null;
            
            if(!name || typeof(name) != "string"){
                throw new Error("Illegal parameter! E4M.getAnimation(name)::name = " + name);
            }else{
                instance = GetAnimation(name, true);

                //方法注册
                return {
                    // 类弄[IN/OUT]
                    "Types" : instance.Types,
                    /**
                     * 设置回调
                     * @see _Animation.set(type, callback, args, context)
                     */
                    "set" : function(type, callback, args, context){instance.set(type, callback, args, context);},
                    /**
                     * 获取回调
                     * @see _Animation.get(type)
                     */
                    "get" : function(type){return instance.get(type);},
                    /**
                     * 移除回调
                     * @see _Animation.remove(type)
                     */
                    "remove" : function(type){instance.remove(type);},
                    /**
                     * JS自定义动画开始 
                     * @see _Animation.start(type, selector, property, speed, begin, change, duration)
                     */
                    "start" : function(type, selector, property, speed, begin, change, duration){return instance.start(type, selector, property, speed, begin, change, duration);},
                    /**
                     * JS自定义动画停上
                     * @see _Animation.stop()
                     */
                    "stop" : function(){instance.stop();},
                    /**
                     * JS自定义动画是否已经停止
                     * @see _Animation.stopped()
                     */
                    "stopped" : function(){instance.stopped();},
                    /**
                     * CSS动画(transform)
                     * @see _Animation.transform(selector, newClassName, styles)
                     */
                    "transform" : function(selector, newClassName, styles){instance.transform(selector, newClassName, styles);},
                    /**
                     * CSS动画(transition)
                     * @see _Animation.transition(selector, newClassName, styles)
                     */
                    "transition" : function(selector, newClassName, styles){instance.transition(selector, newClassName, styles);},
                    /**
                     * 绑定
                     * @see _Animation.bind(selector, multi)
                     */
                    "bind" : function(selector, multi){instance.bind(selector, multi);},
                    /**
                     * 修正持续时长，以iOS为基准
                     * @see _Animation.fixedDuration(duration, offset)
                     */
                    "fixedDuration" : function(duration, offset){return instance.fixedDuration(duration, offset);},
                    /**
                     * 销毁Sine实例
                     * @see _Animation.destory()
                     */
                    "destory" : function(){instance.destory();}
                };
            }
        },
        //------------------------------------------------------------------------------
        /**
         * 获取UA信息
         * @see GetUA()
         */
        "UA" : GetUA(),
        /**
         * 检测UA
         * @see CheckUA(key)
         */
        "checkUA" : CheckUA,
        /**
         * 移除指定的class
         * @see RemoveClass(node, className)
         */ 
        "removeClass" : RemoveClass,
        /**
         * 添加指定的class
         * @see AddClass(node, className)
         */ 
        "addClass" : AddClass,
        /**
         * 替换指定的class
         * @see ReplaceClass(node, replaceClassName, newClassName)
         */ 
        "replaceClass" : ReplaceClass,
        /**
         * 销毁所有PageLoader和TouchSlide实例
         */
        "destory" : function(){
            G_ANIMATION_MAP = null;
        }
    };
})();