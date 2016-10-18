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
         tips:'正在提交...',
         async:true,
         formObj:$('#formId'),   //如果存在这个属性则说明是用ajaxSubmit提交 不存在则视为ajax提交
         url:'/xxxxx/xx',
         submitBtn:$('.save'),   //提交时，会将此按钮disabled防止多次提交，之后无论请求成功或失败都会解除disabled
         data:{name:'iLong',age:24},
         success:function(data){

         }
      })
     */
    space.myAjax = function (options) {
        var timeDistance = 0,timeStart = 0, timeEnd = 0;
        if(options && Object.prototype.toString.call(options).toLowerCase()=='[object object]'){
            var _this = this;
            var excu = {
                tips: options.tips,
                tipsContent: options.tipsContent || '正在提交...',
                submitBtn:options.submitBtn,
                url: options.url || '',
                type:options.type || 'POST',                    /*默认为POST提交*/
                async:options.async || 'true',                  /*默认异步*/
                dataType:options.dataType || 'JSON',            /*默认JSON格式*/
                data: options.data || {},                       /*默认空JSON*/
                beforeSend: function (XMLHttpRequest) {
                    timeStart = new Date().getTime();
                    if(this.tips == true || typeof this.tips == "undefined"){
                        dialog({
                            id:'najiuzheyangba',
                            content: '<img class="mr10" src="../image/loading.gif">'+this.tipsContent
                        }).showModal();
                    }
                    if(options.beforeSend){
                        options.beforeSend(XMLHttpRequest);
                    }
                },
                success: function (data) {
                    if(data.status == -1){
                        _this.tips({type:2,content:'您还未登录，请登录后再试'});
                    }
                    if(options.success){
                        options.success(data);
                    }
                },
                error: function (XMLHttpRequest) {
                    if(this.tips == true || typeof this.tips == "undefined"){
                        dialog.get('najiuzheyangba').remove();
                        dialog({
                            id:'tjsb',
                            content:'提交失败！',
                            ok:true
                        }).showModal();
                    }
                    if(options.error){
                        options.error(XMLHttpRequest);
                    }
                },
                complete:function () {
                    timeEnd = new Date().getTime();
                    timeDistance = timeStart - timeEnd;
                    if(this.tips == true || typeof this.tips == "undefined"){
                        dialog.get('najiuzheyangba').remove();
                    }
                    if(typeof options.submitBtn == 'object'){   /*去除disabled*/
                        options.submitBtn.removeClass('disabled');
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