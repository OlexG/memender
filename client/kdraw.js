//init
var c;
var ctx;
var fill_color = [255,255,255,1];
var draw_stroke = true;
var stroke_color = [0,0,0];
var text_size = 12;
var text_font = "Ariel"
var frame_rate = 60;
var text_align = "left";
var rect_mode = "corner";
var ellipse_mode = "center"
var mouseX = 0;
var mouseY = 0;
var pmouseX = 0;
var pmouseY = 0;
var mouseButton = 0;
var frameCount = 0;
var height;
var width;
var keyIsPressed = false;
var mouseIsPressed = false;
var keyCode;
var key = {code:0};
var begunShape = false;
var start = new Date().getTime();

//random
const BLEND = "blend";
const JAVA2D = "";
//color mode
const HSB ="hsb";
const RGB = "rgb";
//filter
const BLUR = "blur";
//end shape thing
const CLOSE = "close";
//mode
const RADIUS = "radius";
//text align
const CENTER = "center";
const CORNER = "corner";
const TOP = "top";
//stroke strokeCap
const SQUARE = "square";
const ROUND = "round";
//keys
const UP = 38;
const DOWN = 40;
const LEFT = 37;
const RIGHT = 39;
const ENTER = 13;
const BACKSPACE = 8;
const ALT = 18;
//pointer change
const ARROW = "default";
const HAND = "pointer";

canvas=document.getElementById("canvas");
ctx=canvas.getContext("2d");
height=parseInt(canvas.height);
width=parseInt(canvas.width);

loop();

function mouseHover(x,y,w,h,callback){
  if(mouseX>x && mouseX<x+w && mouseY>y && mouseY<y+h){
    callback();
  }
}

//listeners
canvas.addEventListener ("mouseout", function(event){
  if(typeof mouseOut === 'function'){
    mouseOut();
  }
}, false);

canvas.addEventListener("mousemove", function(event){
  var rect = canvas.getBoundingClientRect();
  pmouseX=mouseX;
  pmouseY=mouseY;
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
});

canvas.addEventListener("mousedown", function(event){
  mouseIsPressed=true;
  mouseButton=event.button;
  if(typeof mousePressed === 'function'){
    mousePressed();
  }
});

canvas.addEventListener("mouseup", function(event){
  mouseIsPressed=false;
  if(typeof mouseReleased === 'function'){
    mouseReleased();
  }
  if(typeof mouseClicked === 'function'){
    mouseClicked();
  }
  mouseButton=event.button;
});

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x+r, y);
  this.arcTo(x+w, y,   x+w, y+h, r);
  this.arcTo(x+w, y+h, x,   y+h, r);
  this.arcTo(x,   y+h, x,   y,   r);
  this.arcTo(x,   y,   x+w, y,   r);
  this.closePath();
  return this;
}

//perlin noise (https://www.michaelbromley.co.uk/blog/simple-1d-noise-in-javascript/)
var Simple1DNoise = function() {
    var MAX_VERTICES = 256;
    var MAX_VERTICES_MASK = MAX_VERTICES -1;
    var amplitude = 1;
    var scale = 1;

    var r = [];

    for ( var i = 0; i < MAX_VERTICES; ++i ) {
        r.push(Math.random());
    }

    var getVal = function( x ){
        var scaledX = x * scale;
        var xFloor = Math.floor(scaledX);
        var t = scaledX - xFloor;
        var tRemapSmoothstep = t * t * ( 3 - 2 * t );

        /// Modulo using &#038;
        var xMin = xFloor & MAX_VERTICES_MASK;
        var xMax = ( xMin + 1 ) & MAX_VERTICES_MASK;

        var y = lerp( r[ xMin ], r[ xMax ], tRemapSmoothstep );

        return y * amplitude;
    };

    /**
    * Linear interpolation function.
    * @param a The lower integer value
    * @param b The upper integer value
    * @param t The value between the two
    * @returns {number}
    */
    var lerp = function(a, b, t ) {
        return a * ( 1 - t ) + b * t;
    };

    // return the API
    return {
        getVal: getVal,
        setAmplitude: function(newAmplitude) {
            amplitude = newAmplitude;
        },
        setScale: function(newScale) {
            scale = newScale;
        }
    };
};
var generator = new Simple1DNoise();

//drawing
function style(){
  ctx.fillStyle = 'rgba('+fill_color[0]+','+fill_color[1]+','+fill_color[2]+','+fill_color[3]+')';
  if(draw_stroke){
    ctx.strokeStyle = 'rgb('+stroke_color[0]+','+stroke_color[1]+','+stroke_color[2]+','+stroke_color[3]+')';
  }else{
    ctx.strokeStyle = 'rgba(0,0,0,0)';
  }
}

function filter(input,num){
  if(input==="blur"){
    ctx.filter = "blur("+num+"px)";
  }
}

function fill(r,g,b,a){
  if(typeof r === 'object'){
    if(r.alpha===undefined){
      if(r.green===undefined || r.blue===undefined){
        fill_color=[r.red,r.red,r.red,1];
      }else{
        fill_color=[r.red,r.green,r.blue,1];
      }
    }else{
      if(r.alpha<0){
        fill_color=[r.red,r.green,r.blue,0];
      }else{
        fill_color=[r.red,r.green,r.blue,r.alpha/255];
      }
    }
  }else{
    if(a===undefined){
      if(g===undefined || b===undefined){
        fill_color=[r,r,r,1];
      }else{
        fill_color=[r,g,b,1];
      }
    }else{
      if(a<0){
        fill_color=[r,g,b,0];
      }else{
        fill_color=[r,g,b,a/255];
      }
    }
  }
}

function background(r,g,b){
  if(typeof r === 'object'){
    if(r.green===undefined || r.blue===undefined){
      ctx.fillStyle = 'rgb('+r.red+','+r.red+','+r.red+')';
    }else{
      ctx.fillStyle = 'rgb('+r.red+','+r.green+','+r.blue+')';
    }
  }else{
    if(g===undefined || b===undefined){
      ctx.fillStyle = 'rgb('+r+','+r+','+r+')';
    }else{
      ctx.fillStyle = 'rgb('+r+','+g+','+b+')';
    }
  }
  ctx.strokeRect(0,0,canvas.width,canvas.height);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function noFill(){
  fill_color=[0,0,0,0]
}

function strokeCap(input){
  ctx.lineCap = input;
}

function stroke(r,g,b,a){
  if(typeof r === 'object'){
    if(r.alpha===undefined){
      if(r.green===undefined || r.blue===undefined){
        stroke_color=[r.red,r.red,r.red,1];
      }else{
        stroke_color=[r.red,r.green,r.blue,1];
      }
    }else{
      if(r.alpha<0){
        stroke_color=[r.red,r.green,r.blue,0];
      }else{
        stroke_color=[r.red,r.green,r.blue,r.alpha/255];
      }
    }
  }else{
    if(a===undefined){
      if(g===undefined || b===undefined){
        stroke_color=[r,r,r,1];
      }else{
        stroke_color=[r,g,b,1];
      }
    }else{
      if(a<0){
        stroke_color=[r,g,b,0];
      }else{
        stroke_color=[r,g,b,a/255];
      }
    }
  }
  draw_stroke=true;
}

function noStroke(){
  draw_stroke=false;
}

function line(x1,y1,x2,y2){
  style();
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function rect(x,y,w,h){
  style();
  if(rect_mode==="corner"){
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);
  }else if(rect_mode==="center"){
    ctx.fillRect(x-(w/2), y-(h/2), w, h);
    ctx.strokeRect(x-(w/2), y-(h/2), w, h);
  }
}

function rectMode(input){
  rect_mode=input;
}

function triangle(x1,y1,x2,y2,x3,y3){
  style();
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.lineTo(x1, y1);
  ctx.fill();
  ctx.stroke();
}

function ellipse(x,y,w,h){
  style();
  ctx.beginPath();
  if(ellipse_mode==="center"){
    ctx.ellipse(x, y, Math.abs(w/2), Math.abs(h/2), 0, 0, Math.PI*2);
  }else if(ellipse_mode==="radius"){
    ctx.ellipse(x, y, Math.abs(w), Math.abs(h), 0, 0, Math.PI*2);
  }
  ctx.fill();
  ctx.stroke();
}

function ellipseMode(input){
}

function arc(x,y,w,h,startA,endA){
  style();
  ctx.beginPath();
  ctx.ellipse(x, y, Math.abs(w/2), Math.abs(h/2), 0, startA*(Math.PI/180), endA*(Math.PI/180));
  ctx.fill();
  ctx.stroke();
}

function quad(x1,y1,x2,y2,x3,y3,x4,y4){
  style();
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.lineTo(x4, y4);
  ctx.lineTo(x1, y1);
  ctx.fill();
  ctx.stroke();
}

function point(x,y){
  style();
  ctx.beginPath();
  ctx.ellipse(x, y, 1, 1, 0, 0, Math.PI*2);
  ctx.stroke();
  ctx.fillStyle = 'rgb('+stroke_color[0]+','+stroke_color[1]+','+stroke_color[2]+','+stroke_color[3]+')';
  ctx.fill();
}

function beginShape(){
  style();
  ctx.beginPath();
  begunShape=true;
}

function vertex(x,y){
  if(begunShape){
    ctx.moveTo(x,y);
    begunShape=false;
  }else{
    ctx.lineTo(x, y);
  }
}

function curveVertex(x,y){
  if(begunShape){
    ctx.moveTo(x,y);
    begunShape=false;
  }else{
    ctx.lineTo(x, y);
  }
}

function bezier(x1, y1, cx1, cy1, cx2, cy2, x2, y2){
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x2, y2);
  ctx.stroke();
}

function bezierVertex(cx1, cy1, cx2, cy2, x2, y2){
  ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x2, y2);
}

function endShape(input){
  if(input==="close"){
    ctx.closePath();
  }
  ctx.fill();
  ctx.stroke();
}

function text(txt,x,y){
  style();
  var text = txt.toString().split("\n");
  ctx.textAlign = text_align;
  ctx.textBaseline = "middle";
  for(var i = 0;i<text.length;i++){
    ctx.font = text_size+'px '+text_font+',sans-serif';
    ctx.fillText(text[i], x, y+(i*text_size));
  }
}

function textSize(s){
  text_size=s;
}

function textWidth(txt){
  return ctx.measureText(txt).width;
}

//keyboard

document.onkeydown = function (e) {
  key.code=e.which;
  keyCode=e.which;
  keyIsPressed=true;
  if(typeof keyPressed === 'function'){
    keyPressed();
  }
};

document.onkeyup = function (e) {
  key.code=e.which;
  keyCode=e.which;
  keyIsPressed=false;
  if(typeof keyReleased === 'function'){
    keyReleased();
  }
};

document.onkeypress = function (e) {
  key.code=e.which;
  keyCode=e.which;
  if(typeof keyTyped === 'function'){
    keyTyped();
  }
};

//math
function random(min,max){
  return (Math.random()*(max-min))+min;
}

function constrain(num,min,max){
  if(num>max){
    return max;
  }else if(num<min){
    return min;
  }else{
    return num;
  }
}

function max(num1,num2){
  if(num1>num2){
    return num1;
  }else{
    return num2;
  }
}

function log(num){
  return Math.log(num);
}

function sq(num){
  return Math.pow(num,2);
}

function round(num){
  return Math.round(num);
}

function floor(num){
  return Math.floor(num);
}

function dist(x1,y1,x2,y2){
  return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
}

function min(num1,num2){
  if(num1<num2){
    return num1;
  }else{
    return num2;
  }
}

function abs(num){
  return Math.abs(num);
}

function pow(num, exponent){
  return Math.pow(num,exponent);
}

function sqrt(num){
  return Math.sqrt(num);
}

function ceil(num){
  return Math.ceil(num);
}

function noise(num){
  return generator.getVal(num);
}

function atan2(x,y){
  return Math.atan2(x,y) * 180 / Math.PI;
}

function PVector(x,y){
  this.x=x;
  this.y=y;
}

PVector.prototype.add = function(vect){
  this.x=this.x+vect.x;
  this.y=this.y+vect.y;
}

PVector.prototype.set = function(vect){
  this.x=vect.x;
  this.y=vect.y;
}

PVector.prototype.mult = function(scale){
  this.x=this.x*scale;
  this.y=this.y*scale;
}

PVector.prototype.div = function(scale){
  this.x=this.x/scale;
  this.y=this.y/scale;
}

PVector.prototype.mag = function(){
  return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2));
}

//trigonometry
function cos(num){
  return Math.cos(num*(Math.PI/180));
}

function tan(num){
  return Math.tan(num*(Math.PI/180));
}

function sin(num){
  return Math.sin(num*(Math.PI/180));
}

//date & time
function day(){
  return new Date().getDate();
}

function month(){
  return new Date().getMonth();
}

function year(){
  return new Date().getFullYear();
}

function hour(){
  return new Date().getHours();
}

function minute(){
  return new Date().getMinutes();
}

function second(){
  return new Date().getSeconds();
}

function millis(){
  return new Date().getTime() - start;
}

//debugging
function println(txt){
  console.log(txt);
}

function print(txt){
  console.log(txt);
}

function debug(txt){
  console.log(txt);
}

//other
function get(){
  var img = new Image;
  img.src = canvas.toDataURL();
  return img;
};

function str(num){
  return num.toString();
};

function smooth(){

};

function getSound(){
  return "sound";
};

function playSound(sound){

};

function textLeading(){

};

function textAlign(type){
  text_align=type;
};

function createGraphics(w,h,type){
  return canvas.toDataURL();
};

function textFont(name){
  text_font=name;
};

function createFont(name){
  return name;
};

function cursor(type){
  if(type===undefined){
    canvas.style.cursor="default";
  }else{
    canvas.style.cursor=type;
  }
};

function noCursor(){
  canvas.style.cursor="none";
};

function image(img,x,y,w,h){

    ctx.drawImage(img, x, y, w, h);

};

function map(value, istart, istop, ostart, ostop) {
      return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

function color(r,g,b,a){
  return {red:r,green:g,blue:b,alpha:a};
}

function frameRate(num){
  frame_rate=num;
}

function strokeWeight(num){
  ctx.lineWidth = num;
}

function pushMatrix(){
  ctx.save();
}

function popMatrix(){
  ctx.restore();
}

function resetMatrix(){
  ctx.resetTransform();
}

function rotate(num){
  ctx.rotate(num * Math.PI / 180);
}

function scale(x,y){
  if(y===undefined){
    ctx.scale(x, x);
  }else{
    ctx.scale(x, y);
  }
}

function blendColor(color1,color2,mode){
  return [((color1[0]*((255-color2[3])/255))+(color2[0]*(color2[3]/255))),((color1[1]*((255-color2[3])/255))+(color2[1]*(color2[3]/255))),((color1[2]*((255-color2[3])/255))+(color2[2]*(color2[3]/255)))];
}

function lerpColor(color1,color2,amount){
  return [((color1[0]*(1-amount))+(color2[0]*amount)),((color1[1]*(1-amount))+(color2[1]*amount)),((color1[2]*(1-amount))+(color2[2]*amount))];
}

function translate(x,y){
  ctx.translate(x, y);
}

function red(color){
  return color.red;
}

function green(color){
  return color.green;
}

function blue(color){
  return color.blue;
}

function colorMode(){

}

function getImage(image){
  let tempImage = new Image();
  tempImage.src=image;
  return(tempImage);
}

function loop(){
  if(typeof draw === 'function'){
    draw();
  }
  frameCount++;
  setTimeout(loop,1000/frame_rate);
}
