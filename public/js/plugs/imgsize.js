/*
 * 判断图片类型 
 *  
 * @param ths  
 *          type="file"的javascript对象 
 * @return true-符合要求,false-不符合 
 */
function checkImgType(ths){
    if (ths.value == "") {
        alert("请上传图片");
        return false;
    } else {
        if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(ths.value)) {
            alert("图片类型必须是.gif,jpeg,jpg,png中的一种");
            ths.value = "";
            return false;
        }else{
            var img=new Image();
            img.src=filepath;
            while(true){
                if(img.fileSize>0){
                    if(img.fileSize>10*1024){
                        alert("图片不大于10M。");
                        return false;
                    }
                    break;
                }

            }
        }
    }
    return true;
}

/* 
 * 判断图片大小 
 *  
 * @param ths  
 *          type="file"的javascript对象 
 * @param width 
 *          需要符合的宽  
 * @param height 
 *          需要符合的高 
 * @return true-符合要求,false-不符合 
 */
function checkImgPX(ths, width, height) {
    var img = null;
    img = document.createElement("img");
    document.body.insertAdjacentElement("beforeEnd", img); // firefox不行  
    img.style.visibility = "hidden";
    img.src = ths.value;
    var imgwidth = img.offsetWidth;
    var imgheight = img.offsetHeight;

    alert(imgwidth + "," + imgheight);

    if(imgwidth != width || imgheight != height) {
        alert("图的尺寸应该是" + width + "x"+ height);
        ths.value = "";
        return false;
    }
    return true;
}  
