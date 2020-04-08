var myCanvas = document.getElementById('canvas');
var ctx = myCanvas.getContext('2d');
var img = new window.Image();
var newimg = new window.Image();
var image = {x:0, y:0, held:false};
var oldmx = mouseX;
var oldmy = mouseY;
var oldplayerx = 0;
var oldplayery = 0;


function execution_loop(){
  if (image.held){
    image.x += (mouseX - oldmx)/6;
    image.y += (mouseY - oldmy)/6;
  }
  else{
    oldmx = mouseX;
    oldmy = mouseY;
    image.x = 0;
    image.y = 0;
  }
  if (image.x < -canvas.width - 20){
    sock.emit("ratenegative", curname);
    localStorage.setItem("memenum", parseInt(localStorage.getItem("memenum")) + 1);
    changememe(localStorage.getItem("memenum") % (memes.length));
  }
  if (image.x > canvas.width + 20){
    sock.emit("ratepositive", curname);
    localStorage.setItem("memenum", parseInt(localStorage.getItem("memenum")) + 1);
    changememe(localStorage.getItem("memenum") % (memes.length));
  }
  //continue 60fps loop
  setTimeout(execution_loop,1000/60);
  img.src = cururl;
  newimg.src = newurl;
  if(img.width > 500){
    let ratio = 500/img.width;
    canvas.width = img.width * ratio;
    canvas.height = img.height * ratio;
    ctx.drawImage(newimg,0,0);
    ctx.drawImage(img,image.x,image.y, ratio * img.width, ratio * img.height);
  }
  else{
    ratio = 1;
    canvas.width = img.width * ratio;
    canvas.height = img.height * ratio;
    ctx.drawImage(newimg,0,0);
    ctx.drawImage(img,image.x,image.y);
  }
  document.getElementById("logo").innerHTML = "Rank: " + currank.toString();
  if (image.x > 0){
    fill(56, 211, 13,100);
    rect(0, 0, canvas.width, canvas.height);
  }
  if(image.x < 0){
    fill(235, 30, 30,100);
    rect(0, 0, canvas.width, canvas.height);
  }

}
execution_loop();
mousePressed = function() {
  image.held = true;
}
mouseReleased = function() {
  image.held = false;
}
