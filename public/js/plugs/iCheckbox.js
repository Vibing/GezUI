/**
 * Created by iLong on 2016/5/4.
 * 
 * 使用方法：
    html:    <div class="my-checkbox">
                <input type="checkbox" >
            </div>
 
    调用css: iCheckbox.css

    调用：$('.my-checkbox').checkbox(function(){
            console.log( $(this) )
        });
 */

;(function ($) {
    $.fn.extend({
        checkbox: function(fn){
            this.each(function () {
                Checkbox.init($(this),fn);
            });
        }
    });

    var Checkbox = {
        init: function (obj, fn) {
            var width = obj.outerWidth(),
                height = obj.outerHeight();
            obj.find('input:first').width(width).height(height);
            this.changeSate(obj);
            this.changeEvent(obj.find('input:first'), obj, fn);
        },

        changeSate: function (obj) {
            var checkbox = obj.find('input:first'),
                currState = checkbox.prop('checked'),
                disabled =  checkbox.prop('disabled');

            obj[ currState ? 'addClass' : 'removeClass']('checked');
            obj[ disabled ? 'addClass' : 'removeClass']('disabled');
        },

        changeEvent: function (obj,showObj,fn) {
            var _this = this;
            obj.change(function () {
                _this.changeSate(showObj);
                if(typeof fn == 'function'){
                    fn.call(this);
                }
            });
        }
    }


})(jQuery);