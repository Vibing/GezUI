/**
 * Created by iLong on 2015/11/12.
 * 迷你提示
 */
;(function($){

    var isIE6 = !window.XMLHttpRequest;
    var tips = function(options){ return new Tips(options); }

    var Tips = function(options){
        var defaults = {
            renderTo: 'body',
            type : 0,
            autoClose : true,
            removeOthers : true,
            time : undefined,
            top :'40%',
            onClose : null,
            onShow : null
        }
        this.options = $.extend({},defaults,options);
        this._init();

        !Tips._collection ?  Tips._collection = [this] : Tips._collection.push(this);
    }

    Tips.removeAll = function(){
        try {
            for(var i=Tips._collection.length-1; i>=0; i--){
                Tips._collection[i].remove();
            }
        }catch(e){}
    }

    Tips.prototype = {
        _init : function(){
            var self = this,
                opts = this.options,
                time;
            if(opts.removeOthers){
                Tips.removeAll();
            }

            this._create();

            this.closeBtn.bind('click',function(){
                self.remove();
            });

            if(opts.autoClose){
                time = opts.time  ? opts.time : 2000;
                window.setTimeout(function(){
                    self.remove();
                },time);
            }

        },
        _create : function(){
            var opts = this.options;
            this.obj = $('<div class="ui-tips"><i></i><span class="close">×</span></div>').append(opts.content);
            this.closeBtn = this.obj.find('.close');

            switch(opts.type){
                case 0 :
                    this.obj.addClass('ui-tips-error');
                    break ;
                case 1 :
                    this.obj.addClass('ui-tips-success');
                    break ;
                case 2 :
                    this.obj.addClass('ui-tips-warning');
                    break ;
                default :
                    this.obj.addClass('ui-tips-success');
                    break ;
            }

            this.obj.appendTo('body').hide();
            this._setPos();
            if(opts.onShow){
                opts.onShow();
            }

        },
        _setPos : function(){
            var self = this, opts = this.options;
            if(opts.width){
                this.obj.css('width',opts.width);
            }
            var h =  this.obj.outerHeight(),
                winH = $(window).height(),
                scrollTop = $(window).scrollTop();

            //var top = parseInt(opts.top) + scrollTop;

            this.obj.css({
                position : 'fixed',/* isIE6 ? 'absolute' : 'fixed'*/
                left : '50%',
                top : opts.top,
                zIndex :99999999999,
                marginLeft : -self.obj.outerWidth()/2
            });
            window.setTimeout(function(){
                self.obj.show().css({
                    marginLeft : -self.obj.outerWidth()/2
                });
            },150);
            if(isIE6){
                $(window).bind('resize scroll',function(){
                    var top = $(window).scrollTop() + parseInt(opts.top);
                    self.obj.css('top',top);
                })
            }
        },
        remove : function(){
            var opts = this.options;
            this.obj.fadeOut(200,function(){
                $(this).remove();
                if(opts.onClose){
                    opts.onClose();
                }
            });
        }
    }

    $.extend({
        tips:function(options){
            new Tips(options);
        }
    })

})(jQuery);