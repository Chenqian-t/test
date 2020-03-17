function $c(type,style,parent){//创建elem,并设置style,父元素
	var elem=document.createElement(type);
	if(style){
		for(var prop in style){
			elem.style[prop]=style[prop];
		}
	}
	if(!parent) parent=document.body;
	parent.appendChild(elem);
	return elem;//返回创建的elem
}