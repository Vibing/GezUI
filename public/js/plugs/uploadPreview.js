
/**
 * html:(img标签外必须拥有div 而且必须给予div控件id)
 * <div id="imgdiv"></div>
 * <input type="file" id="up_img" />
 * 调用代码:
 * new uploadPreview({ UpBtn: "up_img", DivShow: "imgdiv" });
 * 参数说明:
 * fileObj:选择文件控件ID;
 * imgBox:显示图片的div 注意：如果要兼容IE9 请在该元素上添加style="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale);";
 * Width:预览宽度;
 * Height:预览高度;
 * ImgType:支持文件类型 格式:["jpg","png"];
 * callback:选择文件后回调方法;
 */
;(function () {

    function UploadPreview(setting){
        this.Setting = {
            fileObj:    setting.fileObj || null,
            imgBox:     setting.imgBox || null,
            imgType:    setting.imgType || ["gif","jpg","jpeg","png"],
            error:      setting.error || "选择文件错误,图片类型必须是(gif,jpeg,jpg,bmp,png)中的一种",
            callback:   setting.callback || null
        };
    }

    UploadPreview.prototype = {
        constructor:UploadPreview,

        suffixCheck: function (url) {
            if (!RegExp("\.(" + this.Setting.imgType.join("|") + ")$", "i").test(url.toLowerCase())) {
                alert(this.Setting.error);
                this.Setting.fileObj.get(0).value = "";
                return false;
            }
            return true;
        },

        getURL: function () {
            var obj = this.Setting.fileObj.get(0);//dom对象
            if (obj) {
                //ie
                if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
                    obj.select();
                    // IE下取得图片的本地路径
                    return document.selection.createRange().text;
                }
                //firefox
                else if (window.navigator.userAgent.indexOf("Firefox") >= 1) {
                    if (obj.files) {
                        // Firefox下取得的是图片的数据
                        return obj.files.item(0).getAsDataURL();
                    }
                    return obj.value;
                }
                return obj.value;
            }
        },
        previewPhoto: function () {
            var picsrc=this.getURL();
            var picpreview = this.Setting.imgBox.get(0);
            if(!picsrc || !this.suffixCheck(picsrc)){
                return
            }
            if(window.navigator.userAgent.indexOf("MSIE") >= 1) {
                if(picpreview) {
                    try{
                        picpreview.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = picsrc;
                    }catch(ex){
                        alert("文件路径非法，请重新选择！") ;
                        return false;
                    }
                }else{
                    picpreview.innerHTML="<img src='"+picsrc+"' />";
                }
            }
        },

        changeEvent: function () {
            var _this = this;
            this.Setting.fileObj.change(function () {
                if(typeof FileReader == 'undefined'){   //IE9
                    var url = _this.getURL();
                    if( _this.suffixCheck(url) ){
                        //_this.Setting.imgObj.attr({src:url});
                        _this.previewPhoto();
                        _this.Setting.callback ? _this.Setting.callback() : '';
                    }
                }else{  //other
                    var reader = new FileReader();
                    var name = _this.Setting.fileObj.val();
                    if(!_this.suffixCheck(name)){
                        return
                    }
                    var picpreview = _this.Setting.imgBox.get(0);
                    reader.onload = function(e) {
                        picpreview.innerHTML="<img src='"+this.result+"' />";
                        _this.Setting.callback ? _this.Setting.callback() : '';
                    }
                    reader.readAsDataURL(_this.Setting.fileObj.get(0).files[0]);
                }

            });
        }

    }

    this.UploadPreview = function (options) {
        new UploadPreview(options).changeEvent();
    };
})();
