(function(){
  const canvas = document.getElementById('stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, stars, shootingStars = [];
  const mouse = { x: 0, y: 0 };

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.floor((w * h) / 2600);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2 + 0.2,
      baseAlpha: Math.random() * 0.6 + 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2
    }));
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / w - 0.5);
    mouse.y = (e.clientY / h - 0.5);
  });

  function maybeSpawnShootingStar(){
    if (reduceMotion) return;
    if (Math.random() < 0.004 && shootingStars.length < 2){
      const startX = Math.random() * w * 0.6 + w * 0.2;
      shootingStars.push({
        x: startX,
        y: -10,
        len: Math.random() * 80 + 60,
        speed: Math.random() * 6 + 8,
        angle: Math.PI / 3.4,
        life: 1
      });
    }
  }

  let t = 0;
  function draw(){
    t += 1;
    ctx.clearRect(0, 0, w, h);

    const parallax = 6;
    stars.forEach(s => {
      const alpha = reduceMotion
        ? s.baseAlpha
        : s.baseAlpha + Math.sin(t * s.twinkleSpeed + s.phase) * 0.25;
      ctx.beginPath();
      ctx.fillStyle = `rgba(238,241,248,${Math.max(0, alpha)})`;
      ctx.arc(
        s.x - mouse.x * parallax,
        s.y - mouse.y * parallax,
        s.r, 0, Math.PI * 2
      );
      ctx.fill();
    });

    maybeSpawnShootingStar();
    shootingStars.forEach(s => {
      const dx = Math.cos(s.angle) * s.len;
      const dy = Math.sin(s.angle) * s.len;
      const grad = ctx.createLinearGradient(s.x, s.y, s.x - dx, s.y - dy);
      grad.addColorStop(0, `rgba(255,255,255,${s.life})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - dx, s.y - dy);
      ctx.stroke();

      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.life -= 0.02;
    });
    shootingStars = shootingStars.filter(s => s.life > 0 && s.y < h + 50);

    requestAnimationFrame(draw);
  }

  resize();
  draw();
})();
