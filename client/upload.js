const sock = io();
let dropArea = document.getElementById('drop-area')


;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}
;['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false)
})

;['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false)
})
function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('highlight')
}
dropArea.addEventListener('drop', handleDrop, false)

function handleDrop(e) {
  let dt = e.dataTransfer
  let files = dt.files
  if (dt.items[0].kind === 'file') {
    var url = URL.createObjectURL(files[0]);
    img = new Image();
    img.src = url;
    img.onload = function() {
      var canvas = document.getElementById('canvas');
      var ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      imgw = img.width;
      imgh = img.height;
      ctx.drawImage(img, 0, 0);
      loaded = true;
    };
  }
}

var anim = false;
var loaded = false;
var imgx = 0;
var imgy = 0;
var imgw;
var imgh;
document.getElementById("img").onchange = function(event) {
   var url = URL.createObjectURL(this.files[0]);
   img = new Image();
   img.src = url;
   img.onload = function() {
     var canvas = document.getElementById('canvas');
     var ctx = canvas.getContext('2d');
     canvas.width = img.width;
     canvas.height = img.height;
     imgw = img.width;
     imgh = img.height;
     ctx.drawImage(img, 0, 0);
     loaded = true;
   };
}
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
function execution_loop(){
  setTimeout(execution_loop,1000/60);
  if (anim && loaded && imgx < canvas.width + 10){
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 10000, 10000);
    imgx += 10;
    imgy -= 10;
    imgw -= 30;
    imgh -= 30;
    ctx.drawImage(img, imgx, imgy, imgw, imgh);
  }
  else{
    imgx = 0;
    imgy = 0;
    anim = false;
    loaded = false;
  }
}
execution_loop();
document.getElementById("uploadButton").addEventListener("click", function(){
  anim = true;
  loaded = true;
  imgx = 0;
  imgy = 0;
  sock.emit("uploadimage",  canvas.toDataURL());

});
