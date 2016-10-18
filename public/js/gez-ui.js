;(function($){

    init();

    window.onscroll = window.resize = function () {
        init();
    }

    function init(){
        var top = $(window).scrollTop();
        var left = $('.ui-nav').offset().left;
        if(top >= 385){
            $('.ui-nav').css({
                position:'fixed',
                top:0,
                left:left+'px'
            })
        }else{
            $('.ui-nav').removeAttr('style')
        }
    }

    $('menu li').click(function () {
        $(this).addClass('active').siblings().removeClass('active')
    });

})(jQuery);