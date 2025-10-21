let t = 0.0;
let vel = 0.02;
let num;
let paletteSelected;
let paletteSelected1;
let paletteSelected2;

function setup() {
  // 全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  // 使用較合理的 pixel density
  pixelDensity(min(2, window.devicePixelRatio || 1));
  angleMode(DEGREES);
  num = random(100000);
  paletteSelected = random(palettes);
  paletteSelected1 = random(palettes);
  paletteSelected2 = random(palettes);
}

function draw() {
  randomSeed(num);
  // background("#355070");
  background(bgCol())
  stroke("#355070");
  circlePacking() 
}

function circlePacking() {
  push();

  translate(width / 2, height / 2)
  let points = [];
  let count = 2000;
  for (let i = 0; i < count; i++) {
    let a = random(360);
    let d = random(width * 0.35);
    let s = random(200);
    let x = cos(a) * (d - s / 2);
    let y = sin(a) * (d - s / 2);
    let add = true;
    for (let j = 0; j < points.length; j++) {
      let p = points[j];
      if (dist(x, y, p.x, p.y) < (s + p.z) * 0.6) {
        add = false;
        break;
      }
    }
    if (add) points.push(createVector(x, y, s));
  }
  for (let i = 0; i < points.length; i++) {

    let p = points[i];
    let rot = random(360);
    push();
    translate(p.x, p.y);
    rotate(rot);
    blendMode(OVERLAY)
    let r = p.z - 5;
    gradient(r)
    shape(0, 0, r)
    pop();
  }
  pop();
 }

function shape(x, y, r) {
  push();
noStroke();
//fill(randomCol())
  translate(x, y);
  let radius = r; //半徑
  let nums = 8
  for (let i = 0; i < 360; i += 360 / nums) {
    let ex = radius * sin(i);
    let ey = radius * cos(i);
    push();
    translate(ex,ey)
    rotate(atan2(ey, ex))
    distortedCircle(0,0,r);
	
    pop();
    stroke(randomCol())
    strokeWeight(0.5)
    line(0,0,ex,ey)
    ellipse(ex,ey,2)
  }


  pop();
}

function distortedCircle(x, y, r) {
  push();
  translate(x, y)
  //points
  let p1 = createVector(0, -r / 2);
  let p2 = createVector(r / 2, 0);
  let p3 = createVector(0, r / 2);
  let p4 = createVector(-r / 2, 0)
  //anker
  let val = 0.3;
  let random_a8_1 = random(-r * val, r * val)
  let random_a2_3 = random(-r * val, r * val)
  let random_a4_5 = random(-r * val, r * val)
  let random_a6_7 = random(-r * val, r * val)
  let ran_anker_lenA = r * random(0.2, 0.5)
  let ran_anker_lenB = r * random(0.2, 0.5)
  let a1 = createVector(ran_anker_lenA, -r / 2 + random_a8_1);
  let a2 = createVector(r / 2 + random_a2_3, -ran_anker_lenB);
  let a3 = createVector(r / 2 - random_a2_3, ran_anker_lenA);
  let a4 = createVector(ran_anker_lenB, r / 2 + random_a4_5);
  let a5 = createVector(-ran_anker_lenA, r / 2 - random_a4_5);
  let a6 = createVector(-r / 2 + random_a6_7, ran_anker_lenB);
  let a7 = createVector(-r / 2 - random_a6_7, -ran_anker_lenA);
  let a8 = createVector(-ran_anker_lenB, -r / 2 - random_a8_1);
  beginShape();
  vertex(p1.x, p1.y);
  bezierVertex(a1.x, a1.y, a2.x, a2.y, p2.x, p2.y)
  bezierVertex(a3.x, a3.y, a4.x, a4.y, p3.x, p3.y)
  bezierVertex(a5.x, a5.y, a6.x, a6.y, p4.x, p4.y)
  bezierVertex(a7.x, a7.y, a8.x, a8.y, p1.x, p1.y)
  endShape();
  pop();
}

// 新增：左側選單互動（滑鼠移到距左側 <= 100px 顯示）
(function(){
  const THRESHOLD = 100; // px
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;
  let visible = false;

  function show() {
    sidebar.classList.add('visible');
    visible = true;
  }
  function hide() {
    sidebar.classList.remove('visible');
    visible = false;
  }

  function onMove(e){
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    if (typeof x !== 'number') return;
    if (x <= THRESHOLD) {
      if (!visible) show();
    } else {
      const sbWidth = sidebar.getBoundingClientRect().width || 220;
      if (visible && x > sbWidth + 20) hide();
    }
  }

  function initMenu(){
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchstart', onMove, { passive: true });
    sidebar.addEventListener('mouseleave', hide);
    sidebar.addEventListener('mouseenter', show);

    // 將選單點擊行為移到此處，並支援 iframe 顯示外部網址
    const urlMap = {
      "1": "https://skilar0313-pixel.github.io/20251014/",
      "2": "https://hackmd.io/@ZnnkzZffSzSuGRRbEzKzjA/SkVxtdknxe"
    };

    function openIframe(url) {
      // 若已有 overlay，先移除
      const existing = document.querySelector('.iframe-overlay');
      if (existing) existing.remove();

      const overlay = document.createElement('div');
      overlay.className = 'iframe-overlay';

      const wrapper = document.createElement('div');
      wrapper.className = 'iframe-wrapper';

      const closeWrap = document.createElement('div');
      closeWrap.className = 'iframe-close';
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '關閉';
      closeBtn.addEventListener('click', () => overlay.remove());
      closeWrap.appendChild(closeBtn);

      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.referrerPolicy = 'no-referrer-when-downgrade';

      // 點擊 overlay 空白處關閉
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
      });

      // Esc 鍵關閉
      function onKey(e) {
        if (e.key === 'Escape') {
          overlay.remove();
          document.removeEventListener('keydown', onKey);
        }
      }
      document.addEventListener('keydown', onKey);

      wrapper.appendChild(closeWrap);
      wrapper.appendChild(iframe);
      overlay.appendChild(wrapper);
      document.body.appendChild(overlay);
    }

    document.querySelectorAll('.menu-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.menu-item').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const id = e.currentTarget.dataset.id;
        // 若有對應 URL，使用 iframe 開啟；否則呼叫全域 selectSketch（若存在）
        if (urlMap[id]) {
          openIframe(urlMap[id]);
        } else {
          if (window.selectSketch) window.selectSketch(id);
        }
      });
    });

    // 也提供全域函式以便其他程式呼叫
    window.selectSketch = function(id){
      if (urlMap[id]) openIframe(urlMap[id]);
      else {
        // 預設行為（可自訂）
        console.log('selectSketch:', id);
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMenu);
  } else {
    initMenu();
  }
})();