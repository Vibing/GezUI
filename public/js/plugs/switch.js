/**
 * switch
 * author: chenlong
 * 使用方法：
 *
 * cnd引用:
 * <script src="http://cdn.gezlife.net/common/js/switch-min.js" ></script>
 * <link rel="stylesheet" href="switch.css">
 *
 * html: <input class="j-switch" type="checkbox" />
 *
 * js:
 *      //初始化
 *      $('.j-switch').switch({
 *          beforeChange:function(obj, state, next){
 *              //obj: 当前checkbox对象
 *              //state: true=启用 false=停用
 *              //next: 只有调用next();时，才会继续执行afterChange和change
 *          },
 *          afterChange:function(obj, state){
 *
 *          },
 *          change:function(obj, state){
 *
 *          }
 *      });
 *
 *      //注意，当checked属性发生改变时，仍然会触发beforeChange、afterChange和change回调
 *      $('.j-switch').setSwitch({
 *          disabled: true,
 *          checked: false
 *      });
 */
;(function($) {
    $.fn.extend({
        switch: function(arg) {
            var arg = arg || {},
                defaluts = {
                    beforeChange: null,
                    afterChange: null,
                    change: null
                };

            sets = $.extend(defaluts, arg);

            this.each(function(index, el) {
                if($(el).data('_obj_serial_')) return true;
                var arg = $.extend({
                    obj: $(el)
                }, sets);
                
                $(el).data('_obj_serial_',true);
                new Switch(arg).init();
            });
        },

        setSwitch: function(arg) {
            this.each(function(index, el) {
                var currChecked = $(this).prop('checked'),
                    currDisabled = $(this).prop('disabled');
                var isChecked = arg.checked == undefined ? currChecked : arg.checked,
                    isDisabled = arg.disabled == undefined ? currDisabled : arg.disabled;

                if (isChecked == currChecked && isDisabled == currDisabled)
                    return true;

                if (isChecked == currChecked && isDisabled !== currDisabled) {
                    staticFn.setState($(el), isChecked, isDisabled);
                } else {
                    $(this).parent().trigger('changeEvent', [false, function() {
                        staticFn.setState($(el), isChecked, isDisabled);
                    }]);
                }
            });
        }
    });

    function Switch(config) {
        this.obj = config.obj;
        this.beforeChange = config.beforeChange;
        this.afterChange = config.afterChange;
        this.change = config.change;
    };

    var staticFn = {
        setState: function($obj, isChecked, isDisabled) {
            var $parent = $obj.parent(),
                className = 'switch',
                checkedClass = isChecked ? ' switch-on' : ' switch-off',
                disabledClass = isDisabled ? ' disabled' : '',
                textOn = $obj.attr('text-on') || '启用',
                textOff = $obj.attr('text-off') || '停用';

            $obj.prop({
                checked: isChecked,
                disabled: isDisabled
            });

            $parent[0].className = className + checkedClass + disabledClass;
            $parent.find('.s-witch:first').html(textOff);
            $parent.find('.s-witch:last').html(textOn);
        }
    };

    Switch.prototype = {
        constructor: Switch,

        init: function() {
            var $obj = this.obj,
                checked = $obj.prop('checked'),
                disabled = $obj.prop('disabled');
            this.buildDom();
            this.setState($obj, checked, disabled);
            this.events();
        },

        setState: staticFn.setState,

        buildDom: function() {
            var $obj = this.obj;
            $obj.wrap('<div class="switch"></div>');
            $obj.before('<div class="switch-slid"></div><span class="s-witch">停用</span>');
            $obj.after('<span class="s-witch">启用</span>');
            $obj.hide();
        },

        events: function() {
            var _this = this,
                $obj = this.obj,
                $parent = $obj.parent();
            $parent.click(function() {
                $(this).trigger('changeEvent', [true]);
            });

            $parent.on('changeEvent', function(e, isInitiative, setFn) {
                var $obj = $(this).find(':checkbox'),
                    isChecked = $obj.prop('checked'),
                    isDisabled = $obj.prop('disabled'),
                    changeHandle = function() {
                        if (isInitiative) {
                            _this.setState($obj, !isChecked, false);
                        } else {
                            setFn();
                        }
                        if (_this.afterChange !== null) {
                            _this.afterChange($obj, !isChecked);
                        }
                        if (_this.change !== null) {
                            _this.change($obj, !isChecked);
                        }
                    };

                if (isDisabled && !!isInitiative) return;

                _this.beforeChange !== null ? _this.beforeChange($obj, isChecked, changeHandle) : changeHandle();
            });
        }
    };
})(jQuery);
