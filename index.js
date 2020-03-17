var imgCon,dotUl,leftBn,rightBn,pre;
var rollImg=document.getElementsByClassName("banner")[0];
var imgList=[];
var bnList=[];
var position=0;
var direction="";
var imgMoveBool=false;
var speed=20;
var autoBool=false;
var time=250;
var imageSrcList = ["left.png", "right.png", "banner01.png", "banner02.png", "banner03.png", ];
const IMG_WIDTH=1800;
const IMG_HEIGHT=400;

function init(){
	loadImages();
}

function getImage(src){//预加载,一张一张加载所有图片
	return new Promise(function (res,rej){
		var img=new Image();
		img.src=src;
		img.onload=function (){
			res(img);
		}
	})
}

function loadImages(){//加载图片地址
	var list=[];
	for(var i=0;i<imageSrcList.length;i++){
		list.push(getImage("./imgs/"+imageSrcList[i]));
	}
	Promise.all(list).then(function (_imgList){
		imgList=_imgList;
		bnList=_imgList.splice(0,2);
		imgList=_imgList.splice(0);
		createRollImage();
		createRightLeft();
		createDotList();
		setDotStyle();
		rollImg.addEventListener("mouseenter",mouseHandler);//自动轮播的侦听
		rollImg.addEventListener("mouseout",mouseHandler);//自动轮播的侦听
		animation();
	})
}

function mouseHandler(e){//改变自动轮播的参数
	if(e.type==="mouseenter"){
		autoBool=false;
	}else if(e.type==="mouseout"){
		autoBool=true;
		time=150;
	}
}

function createRollImage(){
	imgCon=$c("div",{//创建小div 并放入图片
		width:1800+"px",
		height:IMG_HEIGHT+"px",
		position:"absolute",
		left: "-250px",
	},rollImg);
	for(i=0;i<imgList.length;i++){
		imgList[i].style.width=IMG_WIDTH+"px";
		imgList[i].style.height=IMG_HEIGHT+"px";
	}
	imgCon.appendChild(imgList[0]);
}

function createRightLeft(){//创建左右按钮 并设置点击事件
	for(var i=0;i<bnList.length;i++){
		rollImg.appendChild(bnList[i]);
		bnList[i].style.position="absolute";
		bnList[i].style.top=(IMG_HEIGHT-bnList[i].height)/2+"px";
		if(i===0){
			bnList[i].style.left="10px";
		}else{
			bnList[i].style.right="10px";
		}
		bnList[i].addEventListener("click",clickHandler);//设置点击事件
	}
}

function clickHandler(e){//点击事件
	if(imgMoveBool) return;
	time=150;
	if(this.src.indexOf("left")>-1){
		direction="right";
		position--;
		if(position<0) position=imgList.length-1;
	}else{
		direction="left";
		position++;
		if(position>imgList.length-1) position=0;
	}
	initNextImg();
}

function initNextImg(){//加载下一张图片
	if(direction!=="right" && direction!=="left") return;
	imgCon.style.width=IMG_WIDTH*2+"px";
	if(direction==="right"){
		imgCon.style.left=-IMG_WIDTH-250+"px";
		imgCon.insertBefore(imgList[position],imgCon.firstElementChild);
	}else if(direction==="left"){
		imgCon.appendChild(imgList[position]);
	}
	setDotStyle();
	imgMoveBool=true;
}

function moveImg(){//图片移动
	if(!imgMoveBool) return;
	if(direction==="left"){
		imgCon.style.left=imgCon.offsetLeft-speed+"px";
		if(imgCon.offsetLeft<=-IMG_WIDTH-250){
			imgMoveBool=false;
			imgCon.firstElementChild.remove();
			imgCon.style.left="-250px";
		}
	}else if(direction="right"){
		imgCon.style.left=imgCon.offsetLeft+speed+"px";
		if(imgCon.offsetLeft>=-250){
			imgMoveBool=false;
			imgCon.lastElementChild.remove();
		}
	}
}

function createDotList(){//创建ul li
	dotUl=$c("ul",{
		margin:"0",
		padding:"0",
		position:"absolute",
		bottom:"10px",
	},rollImg)
	for(var i=0;i<imgList.length;i++){
		$c("li",{
			width:"15px",
			height:"15px",
			borderRadius:"8px",
			border:"1px solid red",
			marginLeft:"10px",
			float:"left"
		},dotUl)
	}
	dotUl.style.left=(1300-dotUl.offsetWidth)/2+"px";
	dotUl.addEventListener("click",dotClickHandler);
	
}

function setDotStyle(){//设置ul li样式
	if(pre){
		pre.style.backgroundColor="rgba(255,0,0,0)";
	}
	pre=dotUl.children[position];
	pre.style.backgroundColor="rgba(255,0,0,1)";
}

function dotClickHandler(e){//li的点击事件
	if(imgMoveBool) return;
	time=150;
	if(e.target.constructor===HTMLUListElement) return;
	var arr=Array.from(dotUl.children);
	var index=arr.indexOf(e.target);
	if(index===position) return;
	if(index>position){
		direction="left";
	}else{
		direction="right";
	}
	position=index;
	initNextImg();
}

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

function animation(){//动画
	requestAnimationFrame(animation);
	moveImg();
	rollAuto();
}

function rollAuto(){//自动轮播参数
	if(!autoBool) return;
	time--;
	if(time>0) return;
	time=250;
	direction="left";
	position++;
	if(position>imgList.length-1) position=0;
	initNextImg();
}



// 页面返回顶部
function scrollToTop() {
	window.onscroll = function () {
		if(document.body.scrollTop > 10 || document.documentElement.scrollTop > 10) {
			document.getElementsByClassName("backtotop")[0].style.visibility = "visible";
		} else {
			document.getElementsByClassName("backtotop")[0].style.visibility = "hidden";
		}
	}
	document.getElementsByClassName("backtotop")[0].addEventListener("click", clickHandler);
	function clickHandler() {
		clearInterval();
		setInterval(function () {
			document.documentElement.scrollTop-=50;
			if(document.body.scrollTop <= 0) {
				clearInterval();
			}
		}, 50) 
	}
}