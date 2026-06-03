// ===== Portfolio motion =====
(function(){
  // Nav scroll state
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if(window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Scroll reveal — bidirectional (re-animates on scroll up & down)
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add('in');
      else e.target.classList.remove('in');
    });
  }, {threshold:0.10, rootMargin:'-4% 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // Typing effect for hero preline
  const typed = document.querySelector('.hero .typed');
  if(typed){
    const full = typed.getAttribute('data-text') || typed.textContent;
    typed.textContent = '';
    let i = 0;
    const tick = () => {
      if(i <= full.length){
        typed.textContent = full.slice(0,i);
        i++;
        setTimeout(tick, 38 + Math.random()*40);
      } else {
        typed.style.borderRight = 'none';
      }
    };
    setTimeout(tick, 500);
  }

  // Animated count-up for stats / metrics
  const countEls = document.querySelectorAll('[data-count]');
  const cio = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      const dur = 1100; const start = performance.now();
      const step = (now)=>{
        const p = Math.min((now-start)/dur, 1);
        const eased = 1 - Math.pow(1-p, 3);
        const val = target % 1 === 0 ? Math.round(target*eased) : (target*eased).toFixed(1);
        el.textContent = val + suffix;
        if(p<1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      cio.unobserve(el);
    });
  }, {threshold:0.6});
  countEls.forEach(el=>cio.observe(el));

  // Subtle parallax on hero headline
  const h1 = document.querySelector('.hero h1');
  if(h1 && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    window.addEventListener('scroll', ()=>{
      const y = window.scrollY;
      if(y < 900) h1.style.transform = `translateY(${y*0.12}px)`;
    }, {passive:true});
  }

  // Hero background animation — Aurora Glow
  const heroCanvas = document.getElementById('heroBg');
  if(heroCanvas && typeof HeroBG === 'function'){
    const hb = new HeroBG(heroCanvas);
    hb.set('aurora');
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
      hb.start();
    } else {
      hb._frame();
    }
  }

  // Orbital globe — gentle scroll drift in the hero corner
  const orbit = document.getElementById('orbitBg');
  if(orbit && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    window.addEventListener('scroll', ()=>{
      const y = window.scrollY;
      if(y < 1000) orbit.style.transform = `translateY(${y * 0.18}px)`;
    }, {passive:true});
  }

  // Active nav link on scroll
  const sections = ['about','skills','projects','experience','education','contact'];
  const navLinks = {};
  document.querySelectorAll('.nav .links a').forEach(a=>{
    const id = a.getAttribute('href').replace('#','');
    navLinks[id] = a;
  });
  const sio = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        Object.values(navLinks).forEach(a=>a.style.color='');
        const link = navLinks[e.target.id];
        if(link) link.style.color = 'var(--cy)';
      }
    });
  }, {threshold:0.4});
  sections.forEach(id=>{ const el=document.getElementById(id); if(el) sio.observe(el); });
})();
