// Các bạn có thể thay đổi giá trị các biến môi trường ở đây:
var radius = 240; // Độ rộng vòng xoay
var autoRotate = true; // Tự động xoay hay không
var rotateSpeed = -60; // đơn vị: giây/vòng. thời gian để xoay hết 1 vòng, dấu trừ để xoay ngược lại
var imgWidth = 120; // độ rộng ảnh (tính theo px)
var imgHeight = 170; // độ cao ảnh (tính theo px)




/*
     CHÚ Ý:
       + imgWidth, imgHeight sẽ dùng được cho cả video -> <video> cũng sẽ được thu nhỏ cho bằng <img>
       + nếu imgWidth, imgHeight đủ nhỏ, có thể <video> sẽ không hiện nút play/pause
       + Link nhạc lấy từ: https://hoangtran0410.github.io/Visualyze-design-your-own-/?theme=HoangTran&playlist=2&song=8&background=3
       + https://api.soundcloud.com/tracks/191576787/stream?client_id=587aa2d384f7333a886010d5f52f302a
       + Custom from code in tiktok video  https://www.facebook.com/J2TEAM.ManhTuan/videos/1353367338135935/
*/


// ===================== start =======================
setTimeout(init, 100);

var obox = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');
var aImg = ospin.getElementsByTagName('img');
var aVid = ospin.getElementsByTagName('video');
var aEle = [...aImg, ...aVid]; // gộp 2 mảng lại

// chỉnh độ lớn ảnh
ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";

// chỉnh độ lớn ground - theo radius
var ground = document.getElementById('ground');
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

function init(delayTime) {
  for (var i = 0; i < aEle.length; i++) {
    aEle[i].style.transform = "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";
    aEle[i].style.transition = "transform 1s";
    aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
  }
}

function applyTranform(obj) {
  // Không cho góc xoay phương Y ra ngoài khoảng 0-180
  if(tY > 180) tY = 180;
  if(tY < 0) tY = 0;

  // Áp dụng góc xoay
  obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
}

function playSpin(yes) {
  ospin.style.animationPlayState = (yes?'running':'paused');
}

var sX, sY, nX, nY, desX = 0,
    desY = 0,
    tX = 0,
    tY = 10;

// tự động xoay
if (autoRotate) {
  var animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
  ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
}

// thêm nhạc nền


// cài đặt events
document.onpointerdown = function (e) {
  clearInterval(obox.timer);
  e = e || window.event;
  var sX = e.clientX,
      sY = e.clientY;

  this.onpointermove = function (e) {
    e = e || window.event;
    var nX = e.clientX,
        nY = e.clientY;
    desX = nX - sX;
    desY = nY - sY;
    tX += desX * 0.1;
    tY += desY * 0.1;
    applyTranform(obox);
    sX = nX;
    sY = nY;
  };

  this.onpointerup = function (e) {
    obox.timer = setInterval(function () {
      desX *= 0.95;
      desY *= 0.95;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTranform(obox);
      playSpin(false);
      if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
        clearInterval(obox.timer);
        playSpin(true);
      }
    }, 17);
    this.onpointermove = this.onpointerup = null;
  };

  return false;
};

document.onmousewheel = function(e) {
  e = e || window.event;
  var d = e.wheelDelta / 20 || -e.detail;
  radius += d;
  init(1);
};
