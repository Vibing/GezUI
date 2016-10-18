/**
 * Created by iLong on 2015/5/28.
 */
;(function ($) {
    /**
     * global.js命名空间
     * @type {{}}
     */

    var space = {};
    /**
      默认为POST提交
      $.myAjax({
         formObj:$('#formId'),   //如果存在这个属性则说明是用ajaxSubmit提交 不存在则视为ajax提交
         url:'/xxxxx/xx',
         submitBtn:$('.save'),   //提交时，会将此按钮disabled防止多次提交，之后无论请求成功或失败都会解除disabled
         data:{name:'iLong',age:24},
         success:function(data){

         }
      })
     */
    space.myAjax = function (options) {
        if(options && Object.prototype.toString.call(options).toLowerCase()=='[object object]'){
            var _this = this;
            var excu = {
                url: options.url || '',
                type:options.type || 'POST',                    /*默认为POST提交*/
                async:options.async || 'true',                  /*默认异步*/
                dataType:options.dataType || 'JSON',            /*默认JSON格式*/
                data: options.data || {},                       /*默认空JSON*/
                beforeSend: function (XMLHttpRequest) {
                    if(options.beforeSend){
                        options.beforeSend(XMLHttpRequest);
                    }
                    if(typeof options.submitBtn == 'object'){   /*将提交按钮disabled*/
                        options.submitBtn.addClass('disabled');
						options.submitBtn.prop('disabled',false);
                    }
                },
                success: function (data) {
                    if(typeof options.submitBtn == 'object'){   /*去除disabled*/
                        options.submitBtn.removeClass('disabled');
						options.submitBtn.prop('disabled',false);
                    }
                    if(data.status == -1){
                        _this.tips({type:2,content:'您还未登录，请登录后再试'})
                        return false;
                    }
                    if(data.status == 0){
                        _this.tips({type:0,content:data.info,onClose:function(){
                            if(data.url) window.location.href=data.url;
                        }})
                        return false;
                    }
                    if(options.success){
                        options.success(data);
                    }

                },
                error: function (XMLHttpRequest) {
                    if(options.error){
                        options.error(XMLHttpRequest);
                    }
                    if(typeof options.submitBtn == 'object'){   /*去除disabled*/
                        options.submitBtn.prop('disabled',false);
                    }
                }
            };

            var isAjaxSubmit = (typeof options.formObj == 'object'); /*是否为ajaxSubmit提交 true为ajaxSubmit提交*/

            isAjaxSubmit ? options.formObj.ajaxSubmit(excu) : $.ajax(excu);
        }
    };


    $.extend({
        myAjax:space.myAjax
    });

})(jQuery);