var memes = [];
var newurl = "";
var cururl = "";
var newname = "";
var curname = "";
var newrank = 0;
var currank = 0;
localStorage.setItem("memenum", 0);

sock.on("delivermeme", (url) => {
  memes.push(url);
  if (memes.length == 2){
    changememe(parseInt(localStorage.getItem("memenum")) % (memes.length));
    localStorage.setItem("memenum", parseInt(localStorage.getItem("memenum")) + 1);
    changememe(parseInt(localStorage.getItem("memenum")) % (memes.length));
  }
})

changememe = function(x){
  var request;
  if(window.XMLHttpRequest)
      request = new XMLHttpRequest();
  else
      request = new ActiveXObject("Microsoft.XMLHTTP");
      request.open('GET', memes[x].url + ".png", false);
      request.send();
  if (request.status !== 404) {
      curname = newname;
      cururl = newurl;
      currank = newrank;
      newrank = memes[x].rank;
      newname = memes[x].name;
      newurl = memes[x].url + ".png";

  }
  else{
    cururl = newurl;
    curname = newname;
    currank = newrank;
    newrank = memes[x].rank;
    newurl = memes[x].url;
    newname = memes[x].name;
  }
  image.held = false;
  image.x = 0;
  image.y = 0;
}
