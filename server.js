const fs = require("fs");
const http = require('http');
const express = require('express');
const socketio = require( 'socket.io');
var cloudinary = require('cloudinary');
const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);
const clientPath = `${__dirname}/../client`;
//config cloudinary
cloudinary.config({
  cloud_name: 'HIDDEN',
  api_key: 'HIDDEN',
  api_secret: 'HIDDEN'
});


app.use(express.static(clientPath));
var images = [];

fs.readFile('data.txt', 'utf8', (err, data) => {
    for(var x = 0; x < data.split("\n").length - 1; x++){
      images.push({name:data.split("\n")[x].split(" ")[0], rank:data.split("\n")[x].split(" ")[1]});
    }
})

//External JS
const vm = require("vm");
/*function execution_loop(){
    setTimeout(execution_loop,1000);
    images.sort((a, b) => (a.rank > b.rank) ? 1 : -1)
}
execution_loop();*/
io.on('connection', function (sock) {
  sock.on("uploadimage", (imagedata) => {
    console.log("image uploading...");
    let memename = "memes/" + Math.random().toString(36).slice(2);
    cloudinary.v2.uploader.upload(imagedata,
      { public_id: memename},
      function(error, result) {console.log(result, error); });

      images.push({ name:memename, rank:0});
      fs.writeFile('data.txt',memename + " 0" + "\n", { flag: "a" }, (err) => {
          if (err) throw err;
      })
  });
  for(var x = 0; x < images.length; x++){
      sock.emit("delivermeme", {url: cloudinary.url(images[x].name), name: images[x].name, rank: images[x].rank});
  }
  sock.on("HIDDEN", (curname) => {
    for(var x = 0; x < images.length; x++){
      if (images[x].name === curname){
        images[x].rank ++;
      }
    }
    images.sort(function(a, b) { return b.rank - a.rank});
    fs.truncate('data.txt', 0, function(){});
    for(var x = 0; x < images.length; x++){
      fs.writeFile('data.txt',images[x].name + " " + images[x].rank + "\n", { flag: "a" }, (err) => {
          if (err) throw err;
      })
    }
  });
  sock.on("HIDDEN", (curname) => {
    for(var x = 0; x < images.length; x++){
      if (images[x].name === curname){
        images[x].rank --;
      }
    }
    images.sort(function(a, b) { return b.rank - a.rank});
    fs.truncate('data.txt', 0, function(){});
    for(var x = 0; x < images.length; x++){
      fs.writeFile('data.txt',images[x].name + " " + images[x].rank + "\n", { flag: "a" }, (err) => {
          if (err) throw err;
      })
    }
  });
});
server.listen(8083, () =>{
  console.log('Game started on 8083');
});
server.on('error', (err) => {
  console.error('server error:', err);
});
