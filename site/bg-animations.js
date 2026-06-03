// ===== Hero background animations engine =====
// Usage: const bg = new HeroBG(canvas); bg.set('network'); bg.start();
(function(){
  const ACCENT = '#27E5E0';
  const ACCENT_RGB = '39,229,224';

  function HeroBG(canvas){
    this.c = canvas;
    this.ctx = canvas.getContext('2d');
    this.mode = 'network';
    this.raf = null;
    this.t = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this._initState();
    window.addEventListener('resize', ()=>this.resize());
    this.resize();
  }

  HeroBG.prototype.resize = function(){
    const r = this.c.getBoundingClientRect();
    this.w = r.width; this.h = r.height;
    this.c.width = this.w * this.dpr;
    this.c.height = this.h * this.dpr;
    this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0);
    this._seed();
  };

  HeroBG.prototype._initState = function(){
    this.particles = [];
    this.stars = [];
    this.drops = [];
    this.streams = [];
    this.blobs = [];
    this.blips = [];
    this.meteors = [];
    this.logLines = [];
  };

  HeroBG.prototype._seed = function(){
    const W=this.w, H=this.h;
    // network nodes
    const n = Math.round((W*H)/22000);
    this.particles = Array.from({length:Math.max(24,n)}, ()=>({
      x:Math.random()*W, y:Math.random()*H,
      vx:(Math.random()-.5)*0.28, vy:(Math.random()-.5)*0.28,
      r:Math.random()*1.6+0.6
    }));
    // stars
    this.stars = Array.from({length:Math.max(60,Math.round(W*H/9000))}, ()=>({
      x:Math.random()*W, y:Math.random()*H,
      z:Math.random()*0.9+0.1, r:Math.random()*1.4+0.3,
      tw:Math.random()*Math.PI*2
    }));
    // matrix columns
    const cols = Math.floor(W/16);
    this.drops = Array.from({length:cols}, ()=>({
      y:Math.random()*-H, speed:Math.random()*0.5+0.35,
      len:Math.floor(Math.random()*12+6)
    }));
    // data streams (vertical streaks)
    this.streams = Array.from({length:Math.max(10,Math.round(W/120))}, ()=>({
      x:Math.random()*W, y:Math.random()*H, len:Math.random()*120+60,
      speed:Math.random()*2.2+1.4, w:Math.random()*1.2+0.4
    }));
    // aurora blobs
    this.blobs = Array.from({length:5}, (_,i)=>({
      x:Math.random()*W, y:Math.random()*H,
      r:Math.random()*220+180,
      dx:(Math.random()-.5)*0.18, dy:(Math.random()-.5)*0.18,
      hue:i
    }));
    // radar blips
    this.blips = Array.from({length:9}, ()=>({
      ang:Math.random()*Math.PI*2, dist:Math.random()*0.9+0.1, life:0
    }));
    // meteors
    this.meteors = Array.from({length:Math.max(7,Math.round(W/180))}, ()=>this._newMeteor());
    // terminal log lines
    const sample=[
      '> initializing model weights …','✓ loaded gemini-2.5-flash','POST /api/chat 200 14ms',
      'embedding 1024-d vector …','RAG: top-k retrieved (k=5)','mTLS handshake ok · spiffe://',
      '$ python train.py --epochs 20','acc=0.94 loss=0.07 ▇▇▇▇▇','GET /scan?url=… 200','xgboost: 300 trees fitted',
      'faiss index built · 10k chunks','token stream ▸ flushing','auth: oauth2.1 grant ok','agent → tool_call(search)',
    ];
    this.logLines = Array.from({length:Math.ceil(H/22)+2}, (_,i)=>({
      text:sample[(Math.random()*sample.length)|0], x:30+Math.random()*40, y:i*22
    }));
  };

  HeroBG.prototype.set = function(mode){ this.mode = mode; this.ctx.clearRect(0,0,this.w,this.h); };

  HeroBG.prototype.start = function(){
    if(this.raf) return;
    const loop = ()=>{ this.t++; this._frame(); this.raf = requestAnimationFrame(loop); };
    this.raf = requestAnimationFrame(loop);
  };
  HeroBG.prototype.stop = function(){ if(this.raf){ cancelAnimationFrame(this.raf); this.raf=null; } };

  HeroBG.prototype._frame = function(){
    const fn = this['_'+this.mode];
    if(fn) fn.call(this);
  };

  // ---- 1. Particle network / constellation ----
  HeroBG.prototype._network = function(){
    const ctx=this.ctx, W=this.w, H=this.h, ps=this.particles;
    ctx.clearRect(0,0,W,H);
    for(const p of ps){
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>W) p.vx*=-1;
      if(p.y<0||p.y>H) p.vy*=-1;
    }
    const MAX=130;
    for(let i=0;i<ps.length;i++){
      for(let j=i+1;j<ps.length;j++){
        const dx=ps[i].x-ps[j].x, dy=ps[i].y-ps[j].y;
        const d=Math.hypot(dx,dy);
        if(d<MAX){
          ctx.strokeStyle=`rgba(${ACCENT_RGB},${(1-d/MAX)*0.32})`;
          ctx.lineWidth=0.7;
          ctx.beginPath(); ctx.moveTo(ps[i].x,ps[i].y); ctx.lineTo(ps[j].x,ps[j].y); ctx.stroke();
        }
      }
    }
    ctx.fillStyle=ACCENT;
    for(const p of ps){ ctx.globalAlpha=0.75; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,7); ctx.fill(); }
    ctx.globalAlpha=1;
  };

  // ---- 2. Matrix rain ----
  HeroBG.prototype._matrix = function(){
    const ctx=this.ctx, W=this.w, H=this.h;
    ctx.fillStyle='rgba(10,10,11,0.16)';
    ctx.fillRect(0,0,W,H);
    ctx.font='13px monospace';
    const chars='01<>{}[]#$%&*+=/ABCDEF010110';
    for(let i=0;i<this.drops.length;i++){
      const d=this.drops[i];
      const x=i*16;
      for(let k=0;k<d.len;k++){
        const ch=chars[(Math.random()*chars.length)|0];
        const yy=d.y - k*16;
        if(yy<0||yy>H) continue;
        const a = k===0 ? 0.95 : Math.max(0, (1-k/d.len)*0.5);
        ctx.fillStyle = k===0 ? '#bafffc' : `rgba(${ACCENT_RGB},${a})`;
        ctx.fillText(ch, x, yy);
      }
      d.y += d.speed*16*0.6;
      if(d.y - d.len*16 > H){ d.y = Math.random()*-120; d.speed=Math.random()*0.5+0.35; }
    }
  };

  // ---- 3. Starfield drift ----
  HeroBG.prototype._starfield = function(){
    const ctx=this.ctx, W=this.w, H=this.h;
    ctx.clearRect(0,0,W,H);
    for(const s of this.stars){
      s.y += s.z*0.35; s.x += s.z*0.12;
      if(s.y>H){ s.y=0; s.x=Math.random()*W; }
      if(s.x>W) s.x=0;
      const tw = 0.5 + Math.sin(this.t*0.03 + s.tw)*0.5;
      ctx.fillStyle=`rgba(${ACCENT_RGB},${(0.25+s.z*0.5)*tw})`;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r*s.z+0.3,0,7); ctx.fill();
    }
  };

  // ---- 4. Pulse grid ----
  HeroBG.prototype._pulsegrid = function(){
    const ctx=this.ctx, W=this.w, H=this.h, gap=46;
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle=`rgba(${ACCENT_RGB},0.10)`; ctx.lineWidth=1;
    ctx.beginPath();
    for(let x=0;x<=W;x+=gap){ ctx.moveTo(x,0); ctx.lineTo(x,H); }
    for(let y=0;y<=H;y+=gap){ ctx.moveTo(0,y); ctx.lineTo(W,y); }
    ctx.stroke();
    // traveling diagonal pulse
    const period=260;
    const prog=(this.t%period)/period;
    const sweep=prog*(W+H)-H;
    for(let gx=0; gx<=W; gx+=gap){
      for(let gy=0; gy<=H; gy+=gap){
        const dist=Math.abs((gx+gy)-(sweep+H));
        if(dist<70){
          const a=(1-dist/70)*0.9;
          ctx.fillStyle=`rgba(${ACCENT_RGB},${a})`;
          ctx.beginPath(); ctx.arc(gx,gy,2.4,0,7); ctx.fill();
        }
      }
    }
  };

  // ---- 5. Aurora glow ----
  HeroBG.prototype._aurora = function(){
    const ctx=this.ctx, W=this.w, H=this.h;
    ctx.clearRect(0,0,W,H);
    ctx.globalCompositeOperation='lighter';
    const cols=[ '39,229,224', '39,229,224', '120,233,230', '20,120,160', '186,255,252' ];
    for(const b of this.blobs){
      b.x+=b.dx; b.y+=b.dy;
      if(b.x<-200||b.x>W+200) b.dx*=-1;
      if(b.y<-200||b.y>H+200) b.dy*=-1;
      const pulse = b.r*(0.9+Math.sin(this.t*0.01+b.hue)*0.12);
      const g=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,pulse);
      g.addColorStop(0,`rgba(${cols[b.hue%cols.length]},0.16)`);
      g.addColorStop(1,`rgba(${cols[b.hue%cols.length]},0)`);
      ctx.fillStyle=g;
      ctx.beginPath(); ctx.arc(b.x,b.y,pulse,0,7); ctx.fill();
    }
    ctx.globalCompositeOperation='source-over';
  };

  // ---- 6. Data streams ----
  HeroBG.prototype._streams = function(){
    const ctx=this.ctx, W=this.w, H=this.h;
    ctx.fillStyle='rgba(10,10,11,0.22)';
    ctx.fillRect(0,0,W,H);
    for(const s of this.streams){
      s.y += s.speed;
      if(s.y - s.len > H){ s.y=Math.random()*-100; s.x=Math.random()*W; s.speed=Math.random()*2.2+1.4; }
      const g=ctx.createLinearGradient(s.x,s.y-s.len,s.x,s.y);
      g.addColorStop(0,`rgba(${ACCENT_RGB},0)`);
      g.addColorStop(1,`rgba(${ACCENT_RGB},0.7)`);
      ctx.strokeStyle=g; ctx.lineWidth=s.w;
      ctx.beginPath(); ctx.moveTo(s.x,s.y-s.len); ctx.lineTo(s.x,s.y); ctx.stroke();
      ctx.fillStyle='#bafffc';
      ctx.beginPath(); ctx.arc(s.x,s.y,s.w*0.9,0,7); ctx.fill();
    }
  };

  // ---- 7. Radar sweep ----
  HeroBG.prototype._radar = function(){
    const ctx=this.ctx, W=this.w, H=this.h;
    ctx.clearRect(0,0,W,H);
    const cx=W*0.82, cy=H*0.42, R=Math.max(W,H)*0.7;
    ctx.strokeStyle=`rgba(${ACCENT_RGB},0.14)`; ctx.lineWidth=1;
    for(let i=1;i<=5;i++){ ctx.beginPath(); ctx.arc(cx,cy,R*i/5,0,7); ctx.stroke(); }
    ctx.strokeStyle=`rgba(${ACCENT_RGB},0.10)`;
    for(let a=0;a<6;a++){ ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(a*Math.PI/3)*R,cy+Math.sin(a*Math.PI/3)*R); ctx.stroke(); }
    const ang=this.t*0.012;
    const g=ctx.createConicGradient ? null : null;
    // sweep wedge
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(ang);
    const grad=ctx.createLinearGradient(0,0,R,0);
    grad.addColorStop(0,`rgba(${ACCENT_RGB},0.30)`); grad.addColorStop(1,`rgba(${ACCENT_RGB},0)`);
    ctx.fillStyle=grad; ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,R,-0.32,0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle=`rgba(${ACCENT_RGB},0.55)`; ctx.lineWidth=1.4; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(R,0); ctx.stroke();
    ctx.restore();
    // blips light up as sweep passes
    for(const b of this.blips){
      const bx=cx+Math.cos(b.ang)*R*b.dist, by=cy+Math.sin(b.ang)*R*b.dist;
      let diff=((ang - b.ang)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);
      if(diff<0.12) b.life=1;
      b.life*=0.97;
      if(b.life>0.02){ ctx.fillStyle=`rgba(${ACCENT_RGB},${b.life})`; ctx.beginPath(); ctx.arc(bx,by,3.2,0,7); ctx.fill(); }
    }
  };

  // ---- 8. Sine waves ----
  HeroBG.prototype._waves = function(){
    const ctx=this.ctx, W=this.w, H=this.h;
    ctx.clearRect(0,0,W,H);
    const layers=4;
    for(let l=0;l<layers;l++){
      const amp=18+l*10, k=0.006+l*0.0018, sp=this.t*(0.012+l*0.004), yBase=H*0.3+l*H*0.16;
      ctx.beginPath();
      for(let x=0;x<=W;x+=6){
        const y=yBase+Math.sin(x*k+sp)*amp+Math.sin(x*k*0.5-sp*0.7)*amp*0.4;
        x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.strokeStyle=`rgba(${ACCENT_RGB},${0.32-l*0.06})`; ctx.lineWidth=1.4; ctx.stroke();
    }
  };

  // ---- 9. Dot matrix wave ----
  HeroBG.prototype._dotmatrix = function(){
    const ctx=this.ctx, W=this.w, H=this.h, gap=30;
    ctx.clearRect(0,0,W,H);
    const cx=W*0.7, cy=H*0.45;
    for(let x=gap/2;x<W;x+=gap){
      for(let y=gap/2;y<H;y+=gap){
        const d=Math.hypot(x-cx,y-cy);
        const v=Math.sin(d*0.03 - this.t*0.05);
        const a=(v+1)/2;
        const r=0.6+a*2.2;
        ctx.fillStyle=`rgba(${ACCENT_RGB},${0.08+a*0.5})`;
        ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill();
      }
    }
  };

  // ---- 10. Meteors ----
  HeroBG.prototype._newMeteor = function(){
    const W=this.w||1200;
    return { x:Math.random()*W*1.2, y:Math.random()*-200-20, len:Math.random()*120+80,
      speed:Math.random()*3+2.4, w:Math.random()*1.1+0.5, delay:Math.random()*200 };
  };
  HeroBG.prototype._meteors = function(){
    const ctx=this.ctx, W=this.w, H=this.h;
    ctx.fillStyle='rgba(10,10,11,0.28)'; ctx.fillRect(0,0,W,H);
    // a few static stars
    ctx.fillStyle=`rgba(${ACCENT_RGB},0.25)`;
    for(const s of this.stars){ ctx.beginPath(); ctx.arc(s.x,s.y,s.r*0.6,0,7); ctx.fill(); }
    for(let i=0;i<this.meteors.length;i++){
      const m=this.meteors[i];
      if(m.delay>0){ m.delay--; continue; }
      m.x-=m.speed; m.y+=m.speed; // diagonal
      const g=ctx.createLinearGradient(m.x+m.len,m.y-m.len,m.x,m.y);
      g.addColorStop(0,`rgba(${ACCENT_RGB},0)`); g.addColorStop(1,`rgba(${ACCENT_RGB},0.85)`);
      ctx.strokeStyle=g; ctx.lineWidth=m.w; ctx.beginPath(); ctx.moveTo(m.x+m.len,m.y-m.len); ctx.lineTo(m.x,m.y); ctx.stroke();
      ctx.fillStyle='#bafffc'; ctx.beginPath(); ctx.arc(m.x,m.y,m.w,0,7); ctx.fill();
      if(m.x<-150||m.y>H+150) this.meteors[i]=this._newMeteor();
    }
  };

  // ---- 11. Terminal log ----
  HeroBG.prototype._terminal = function(){
    const ctx=this.ctx, W=this.w, H=this.h;
    ctx.clearRect(0,0,W,H);
    ctx.font='13px monospace'; ctx.textBaseline='middle';
    const sample=['POST /api/chat 200','✓ gemini-2.5-flash ready','RAG top-k=5 retrieved','mTLS · spiffe:// ok',
      'acc=0.94 loss=0.07','faiss · 10k chunks','agent → tool_call()','xgboost: 300 trees','token stream ▸','oauth2.1 grant ok',
      'GET /scan?url=… 200','embedding 1024-d','playwright · headless','shap values computed','> build complete ✓'];
    for(const ln of this.logLines){
      ln.y-=0.45;
      if(ln.y<-10){ ln.y=H+10; ln.text=sample[(Math.random()*sample.length)|0]; ln.x=30+Math.random()*60; }
      const fade=ln.y<60?ln.y/60:(ln.y>H-60?(H-ln.y)/60:1);
      ctx.fillStyle=`rgba(${ACCENT_RGB},${0.32*Math.max(0,fade)})`;
      ctx.fillText(ln.text, ln.x, ln.y);
    }
  };

  // ---- 12. Hex grid ----
  HeroBG.prototype._hexgrid = function(){
    const ctx=this.ctx, W=this.w, H=this.h, s=26;
    ctx.clearRect(0,0,W,H);
    const hw=Math.sqrt(3)*s, vh=s*1.5;
    ctx.lineWidth=1;
    for(let row=-1, y=0; y<H+s; row++, y=row*vh){
      const off=(row%2)? hw/2:0;
      for(let x=-hw; x<W+hw; x+=hw){
        const cx=x+off, cy=y;
        const pulse=(Math.sin(cx*0.01+cy*0.012 - this.t*0.04)+1)/2;
        ctx.strokeStyle=`rgba(${ACCENT_RGB},${0.05+pulse*0.28})`;
        ctx.beginPath();
        for(let a=0;a<6;a++){ const an=Math.PI/180*(60*a-30); const px=cx+s*Math.cos(an), py=cy+s*Math.sin(an); a===0?ctx.moveTo(px,py):ctx.lineTo(px,py); }
        ctx.closePath(); ctx.stroke();
      }
    }
  };

  window.HeroBG = HeroBG;
})();
