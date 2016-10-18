/**
 * Created by iLong on 2015/10/20.
 *
 * html结构（样式可自己定义）：
 * <div class="cus_search j-like_query">
        <span class="iconfont mhdown">&#xe60f;</span><input type="text"  data-val="0">
        <div style="display:none">
            <ul>
                <li data-val="0">选项 1</li>
            </ul>
        </div>
    </div>
 *
 * 约定返回的数据格式（如果与该格式相违背 则使用dealLis:function(data){ 。。。 }自己手动处理）：
 * {
 *   data:[
 *      {name:'选项名称1',value:'0'},
 *      {name:'选项名称2',value:'1'}
 *   ]
 * }
 *
 * 调用：
 * $.iSelect({
        obj:$('.j-like_query'),       //最外层dom对象
        url:'www.baidu.com',        //接口
        hideIpt:obj                 //隐藏ipt 用于控制其value
        name:'name',                //接口传参的名称
        callback: function (dataItem) {  //点击选项后触发的回调 参数为当前点击的那条json数据
            console.log(obj.html())
        }
    })
 * */

;(function ($) {

    //节流
    var throttle = function (method,context) {
        clearTimeout(method.tId);
        method.tId = setTimeout(function () {
            method.call(context);
        },200);
    };

    var hideSelect = function () {
        $(window).click(function(event){
            var oEvent = event || window.event;
            $('.cus_list').hide();
            oEvent.stopPropagation();
        });
    };
    //构造函数
    function I(sets){
        if(!(sets && typeof sets == 'object')) return;

        var defSets = {obj:null,url:'',callback:null,focus:false};
        var sets = $.extend(defSets,sets);

        this.obj = sets.obj;            //最外面的dom对象
        this.url = sets.url;            //接口
        this.callback = sets.callback;  //点击后触发回调
        this.focus = sets.focus;        //暂不用
        this.name = sets.name;          //接口传参
        this.dealLis = sets.dealLis;    //自己处理返回过来的数据
        this.hideIpt = sets.hideIpt;    //对应的隐藏ipt 用于清空其value
		this.otherData = sets.otherData;
		this.itemsData = null;

    }

    I.prototype = {
        constructor:I,

        //初始化
        init: function () {
            var _this = this;
			$(this.obj).find('input:first').attr('autocomplete','off');			//移除文本框自动补全
			setTimeout(function(){
                $(_this.obj).find('.cus_list').width(_this.obj.get(0).offsetWidth-2+'px');//设置下拉宽度
            },500);
            this.keyup();
            this.clickLi();
            hideSelect();
        },

        //键盘事件
        keyup: function () {
            var _this = this;
            $(this.obj).find('input:first').on('keyup keydown', function () {
                throttle(_this.getLis,_this);
            });
        },

        //获取li
        getLis: function () {
            var data = {};
            var _this = this;

            data[this.name] = $(this.obj).find('input:first').val();//发送给服务端的参数

            if(data[this.name] == ''){
                $(this.obj).find('input:first').attr('data-val','');
                if (_this.hideIpt)
                    _this.hideIpt.val('');
            }

			if(this.otherData)
				$.each(this.otherData,function(i,item){
					data[item] = $("."+item).val();
				});

			$.ajax({
				url:this.url,
				data:data,
				type:'GET',
				async:false,
				success:function(data){
					_this.itemsData = data;
				}
			});
            
			if(_this.dealLis){
				_this.dealLis(_this.itemsData);
			}else{
				var data = _this.itemsData.data,
					li = '';
				if(!data.length) {
					$(_this.obj).find('ul:first').parent().hide();
					return false;
				}else{
					$.each(data, function (i,item) {
						li += '<li data-key="'+i+'" data-val="'+item.value+'" >'+item.name+'</li>'; 
					});
					$(_this.obj).find('ul:first').html(li);
					$(_this.obj).find('ul:first').parent().show();
				}
			}
         
        },

        //点击li
        clickLi: function () {
            var _this = this;
            $(this.obj).on('click','li', function () {
                $(_this.obj).find('input:first').val($(this).html());
                $(_this.obj).find('input:first').attr('data-val',$(this).attr('data-val'));
                if(_this.callback){
                    _this.callback(_this.itemsData.data[$(this).attr('data-key')]);
                }
                $(_this.obj).find('ul:first').parent().hide();
            })
        }

    };

    $.extend({
        iSelect: function (sets) {
            new I(sets).init();
        }
    });

})(jQuery);