(function(){
  "use strict";

  /* ── Curseur ── */
  var cur = document.getElementById('cursor');
  var ring = document.getElementById('cursorRing');
  if (cur) {
    var mx=0, my=0, rx=0, ry=0;
    document.addEventListener('mousemove', function(e){ mx=e.clientX; my=e.clientY; });
    (function lp(){
      cur.style.left  = mx+'px'; cur.style.top  = my+'px';
      rx += (mx-rx)*.12;         ry += (my-ry)*.12;
      ring.style.left = rx+'px'; ring.style.top = ry+'px';
      requestAnimationFrame(lp);
    })();
  }

  /* ── Reveal au scroll ── */
  var ro = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.06 });
  document.querySelectorAll('.reveal').forEach(function(el){ ro.observe(el); });

  var so = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('.skill-item').forEach(function(el){ so.observe(el); });

  /* ── Modales ── */
  document.querySelectorAll('.work-item[data-modal]').forEach(function(item){
    item.addEventListener('click', function(){
      var m = document.getElementById('modal-' + item.dataset.modal);
      if (m) m.classList.add('active');
    });
  });
  document.querySelectorAll('[data-close]').forEach(function(btn){
    btn.addEventListener('click', function(){ btn.closest('.modal-overlay').classList.remove('active'); });
  });
  document.querySelectorAll('.modal-overlay').forEach(function(o){
    o.addEventListener('click', function(e){ if(e.target === o) o.classList.remove('active'); });
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape')
      document.querySelectorAll('.modal-overlay.active').forEach(function(o){ o.classList.remove('active'); });
  });

  /* ── Nav active ── */
  var navAs = document.querySelectorAll('.nav-links a');
  document.querySelectorAll('section[id]').forEach(function(s){
    new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) navAs.forEach(function(a){
          var on = a.getAttribute('href') === '#' + e.target.id;
          a.classList.toggle('active', on);
          a.style.opacity = on ? '1' : '.38';
        });
      });
    }, { threshold: 0.35 }).observe(s);
  });

})();

/* ── Vagues Canvas ── */
(function(){
  var canvas = document.getElementById('waveCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H;

  function resize(){
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  var t = 0;
  var waves = [
    { amp:40, freq:0.0050, speed:0.52, y:0.60, alpha:0.20, color:'58,190,248' },
    { amp:30, freq:0.0072, speed:0.78, y:0.66, alpha:0.14, color:'42,148,220' },
    { amp:24, freq:0.0092, speed:1.08, y:0.71, alpha:0.10, color:'28,110,195' },
    { amp:18, freq:0.0112, speed:0.62, y:0.76, alpha:0.07, color:'16,70,165'  },
    { amp:14, freq:0.0128, speed:0.88, y:0.81, alpha:0.05, color:'8,45,140'   },
  ];

  function drawWave(w, time){
    ctx.beginPath();
    var baseY = H * w.y;
    ctx.moveTo(0, H);
    for (var x = 0; x <= W; x += 3){
      var y = baseY
        + Math.sin(x * w.freq + time * w.speed) * w.amp
        + Math.sin(x * w.freq * 1.7 + time * w.speed * 0.6) * w.amp * 0.38
        + Math.sin(x * w.freq * 0.4 + time * w.speed * 1.4) * w.amp * 0.22;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    var g = ctx.createLinearGradient(0, baseY - w.amp * 1.5, 0, H);
    g.addColorStop(0, 'rgba(' + w.color + ',' + w.alpha + ')');
    g.addColorStop(1, 'rgba(' + w.color + ',0)');
    ctx.fillStyle = g;
    ctx.fill();
  }

  function animate(){
    requestAnimationFrame(animate);
    t += 0.012;
    ctx.clearRect(0, 0, W, H);
    waves.forEach(function(w){ drawWave(w, t); });
  }
  animate();
})();