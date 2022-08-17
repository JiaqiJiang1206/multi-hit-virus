


let video;
let poseNet;
let pose;
let cha = 1;//药剂高度
let dan = 0;//子弹高度
let needleState = 0;//0：针管空的；1：针管满的，防止游戏开始直接发射子弹
let virusR = 0;//病毒大小
let ran ;
let x;//药剂底部与判定线的距离
let bulState = 0;//子弹存在的状态
let gameState = 0;//游戏运行状态


function preload(){
	evilVirus = loadImage('img/evilVirus.png');
	needle = loadImage('img/needle.png');
	boom = loadImage('img/boom.png');
  }

function setup() {

	video = createCapture(VIDEO);
	video.size(640, 480);
	video.hide();
	createCanvas(640, 480);
	poseNet = ml5.poseNet(video, modelLoaded);
	poseNet.on('pose', gotPoses);
	rectMode(CORNERS);// rect() 的前两个参数解读成形状其中一个角落的位置，而第三和第四个参数则被解读成对面角落的位置
	ran = random(380, 420);//判定线的位置
	x = ran+3-320;//计算药剂底部与判定线的距离
}

function gotPoses(poses){
	if(poses.length > 0){
	  pose = poses[0].pose;
	}
  }
  
function modelLoaded(){
console.log('poseNet ready');
}

function keyPressed(){
	if(key == 's'){  //按下s游戏开始
		gameState = 1;
	  	cha = 1;//药剂高度
		dan = 0;//子弹高度
		needleState = 0;//0：针管空的；1：针管满的，防止游戏开始直接发射子弹
		virusR = 0;//病毒大小
		ran = random(380, 420);//判定线的位置
		x = ran+3-320;//计算药剂底部与判定线的距离
		bulState = 0;//子弹存在的状态
	  }
}
	

function draw(){
	translate(video.width, 0);//视频左右翻转
	scale(-1, 1);
	image(video,0,0);//显示摄像头视频
	translate(video.width, 0);//视频左右翻转
	scale(-1, 1);
	fill('#03A9F4');
	noStroke();

	if(gameState){
		if(pose){
			let d = dist(pose.leftElbow.x, pose.leftElbow.y, pose.rightElbow.x, pose.rightElbow.y);//计算左右手肘的距离
			if(d>450){
				bulState = 0;
				x = 320+cha-ran-3;
				if( x < 10 & x > -10){
					bulState = 1;
				}
				dan = 0;
				
				if(cha<115){
					cha++;
					needleState = 1;
				}else{
					cha = 115;
					needleState = 1;//针管满了
				}
			}

			if(d<350){
				if(cha>0){
					cha = 0;
					needleState == 0;//针管空了
				}else{
					cha = 0;
					needleState == 0;//针管空了
				}
				if(cha == 0 & needleState == 1 & bulState == 1){
						dan += 2;
						ellipse(width/3+89, 305-dan, 10);//画子弹
					
				}
				
			}
			let d1 = dist(width/3+89, 305-dan, width/3+100, 180-virusR);//计算子弹和病毒的距离
			if(d1 < 30 & needleState == 1){
				ran = random(380, 420);
				needleState = 0;
				virusR += 10;
			}
			// console.log(d1);
			if(200-virusR > 165){
				image(evilVirus, width/3+virusR/2, 0, 200-virusR, 200-virusR);//显示正上方的病毒
			}else{
				image(boom, width/3+virusR/2, 0, 200-virusR, 200-virusR);//显示爆炸效果
				gameState = 0;
			}
			
			rect(width/3+77, 320, width/3+80+20, 320+cha);//画注射剂药剂,cha = 87则满
	
		}
		image(needle, width/3+25, 280, 130, 200);//显示正下方的注射器
		strokeWeight(3);
		fill('red');
		rect(width/3+77, ran, width/3+80+20, ran+3);//判定线
	}
	
	
}