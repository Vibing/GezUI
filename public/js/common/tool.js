;(function ($) {

    var tool = {

        /**
         * 全选 反选
         * @param mainkey 主选框selector
         * @param kids 子选框selector
         */
        setSelectAll : function (mainkey,kids){
            $('body').on('click',mainkey, function () {
                $(kids).prop('checked',$(this).prop('checked'));
            });

            $('body').on('click',kids, function () {
                for(var i= 0,max=$(kids).length; i<max; i++){
                    if(!$(kids).eq(i).prop('checked')){
                        $(mainkey).prop('checked',false);
                        return;
                    }
                }
                $(mainkey).prop('checked',true);
            });
        },

        /**
         * 迷你tips 用于纯提示
         * $.Tool.tips({
         *      type:1,                //提示类型： 0=错误 1=成功 2=警告
         *      content:'成功！',       //提示内容
         *      time:2000,             //提示显示时间 时间到后自动关闭
         *      onClose:function(){},  //显示时的回调
         *      onShow:function(){}    //关闭时的回调
         * })
         */
        tips:function(options){
            $.tips(options);
        },

        /**
         * 节流函数
         * @param delay 延时时间
         * @param action 回调
         * @returns {Function}
         */
        debounce : function(idle, action){
            var last;
            return function(){
                var ctx = this, args = arguments;
                clearTimeout(last);
                last = setTimeout(function(){
                    action.apply(ctx, args);
                }, idle);
            };
        },

        /**
         * 获取页面高度的正确姿势
         * @returns {Number|number}
         */
        getPageHeight:function(){
            return Math.max(document.body.scrollHeight,document.body.offsetHeight);
        },

        /**
         * 获取可视区高度
         * @returns {Number|number}
         */
        getClientHeight: function () {
            return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        },

        /**
         * 获取滚动高度
         * @returns {Number|number}
         */
        getScrollTop: function () {
            return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        },

        /**
         * 获取滚动条距离页面底部距离
         * @returns {number}
         */
        getScrollBottom: function () {
            return this.getPageHeight() - this.getClientHeight() - this.getScrollTop();
        },

        /**
         * 判断某元素是否在可视区内
         * @param $obj
         * @returns {boolean}
         */
        isInView: function ($obj) {
            var domTop = $($obj).get(0).offsetTop;
            var domHeight = $($obj).get(0).offsetHeight;
            return (domTop+domHeight >= this.getScrollTop() && domTop < (this.getScrollTop()+this.getClientHeight()));
        },

        /**
         * 图片预加载(请在需要预加载的img标签上添加data-src="需要预加载的图片路径")
         * 用途：一般可使大图片预加载，加载完成后显示
         * @param imgObj
         */
        preloadImages:function(imgObj){
            $(imgObj).each(function(){
                var src = $(this).attr('data-src');
                if(!src) return true;
                var imgObj = new Image();
                imgObj.src = src;
            });
        },

        /**
         * 图片懒加载 当图片出现在可视区时显示
         * 使用方法：<img data-src="img.jpg" >
         * @param imgBoxs
         */
        lazyLoad: function () {
            var _this = this;
            if(!$('img[data-src]').length || $('img[data-src]').length == $('img[data-loaded]').length) return;

            $('img[data-src]').each(function(){
                var src = $(this).attr('data-src');
                if(src=='') return true;

                if(_this.isInView($(this))){
                    $(this).attr({
                       "src":src,
                        "data-loaded":true
                    });
                }else{
                    var imgObj = new Image();
                    imgObj.src = src;
                }
            });
            $(window).scroll(this.debounce(100,function () {
                if(!$('img[data-src]').length || $('img[data-src]').length == $('img[data-loaded]').length) return;
                $('img[data-src]').each(function () {
                    var src = $(this).attr('data-src'),
                        hasLoaded = $(this).attr('data-loaded');
                    if(src=='' || hasLoaded=='true') return true;

                    if(_this.isInView($(this)) && $(this).attr('data-loaded')!="true"){
                        $(this).hide().attr({
                            "src":src,
                            "data-loaded":"true"
                        }).fadeIn();
                    }
                });
            }));
        },

        /**
         * 图片上传预览
         * UpBtn:选择文件控件ID;
         * DivShow:DIV控件ID;
         * ImgShow:图片控件ID;
         * Width:预览宽度;
         * Height:预览高度;
         * ImgType:支持文件类型 格式:["jpg","png"];
         * callback:选择文件后回调方法;
         * @param options
         */
        uploadPreview: function (options) {
            UploadPreview(options);
        },

        /**
         * 获取上传图片文件大小
         * @param $fileObj
         * 兼容IE、Chrome、火狐
         * 注意：请在file有值后再调用
         */
        getImgSize: function(fileObj){
          //IE
          if(window.ActiveXObject){
              var fso = new ActiveXObject("Scripting.FileSystemObject");
              var filepath = $(fileObj).val();
              var thefile = fso.getFile(filepath);
              var sizeinbytes = thefile.size;
          }else{
              var sizeinbytes = $(fileObj).get(0).files[0].size;
          }
          return (sizeinbytes/1024).toFixed(2);
        }
    };

    $.Tool = tool;

})(jQuery);
