// ===== Render dynamic sections from window.CV =====
(function(){
  const cv = window.CV;
  const el = (id)=>document.getElementById(id);

  // Marquee
  const mqItems = cv.skillsMarquee.concat(cv.skillsMarquee);
  el('mq').innerHTML = mqItems.map(s=>`<span>${s}<span class="cy"> +</span></span>`).join('');

  // Skills grid
  el('skillsGrid').innerHTML = Object.entries(cv.skills).map(([cat,items],i)=>`
    <div class="cell reveal ${i%3===1?'d1':i%3===2?'d2':''}">
      <div class="h"><span class="t">${cat}</span><span class="i">0${i+1}</span></div>
      <div class="tags">${items.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
    </div>
  `).join('');

  // Projects
  el('projList').innerHTML = cv.projects.map((p,i)=>`
    <div class="proj reveal" data-screen-label="Project ${p.num}">
      <div class="pmedia">
        <div class="pframe">
          <div class="pframe-bar"><span></span><span></span><span></span><em>${p.demo ? p.demo.replace(/^https?:\/\//,'').replace(/\/$/,'') : p.title.toLowerCase().replace(/\s+/g,'-')}</em></div>
          <div class="pframe-img"><img src="${p.img}" alt="${p.title} screenshot" loading="lazy"></div>
        </div>
      </div>
      <div class="pmain">
        <div class="pnum">PROJECT_${p.num}</div>
        <div class="ptitle">${p.title}</div>
        <div class="psub">${p.sub} · ${p.date}</div>
        <ul class="pbody">${p.points.map(pt=>`<li>${pt}</li>`).join('')}</ul>
        <div class="pstack">${p.stack.map(s=>`<span class="t">${s}</span>`).join('')}</div>
        <div class="plinks">
          <a href="${p.repo}" target="_blank" rel="noopener" class="plink" aria-label="${p.title} source code">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5A11.5 11.5 0 0 0 23.5 12C23.5 5.7 18.3.5 12 .5z"/></svg>
            <span>Code</span>
          </a>
          ${p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener" class="plink" aria-label="${p.title} live demo">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg>
            <span>Live demo</span>
          </a>` : ''}
        </div>
      </div>
    </div>
  `).join('');

  // Experience
  el('expList').innerHTML = cv.experience.map(e=>`
    <div class="item reveal">
      <div class="left">
        <div class="role">${e.role}</div>
        <div class="co">${e.company}</div>
        <div class="per">${e.period}</div>
      </div>
      <div class="right">
        <ul style="margin:0;padding:0;">${e.points.map(pt=>`<li>${pt}</li>`).join('')}</ul>
        <div class="stack">${e.stack.map(s=>`<span class="t">${s}</span>`).join('')}</div>
      </div>
    </div>
  `).join('');

  // Education
  el('eduDeg').textContent = cv.education.degree;
  el('eduSch').textContent = cv.education.school;
  el('eduPer').textContent = cv.education.period;

  // Certs
  const certArrow = '<svg class="certarr" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>';
  el('certList').innerHTML = cv.certifications.map((c,i)=>{
    const inner = `
      <div class="left"><span class="ix">0${i+1}</span><div><div class="nm">${c.name}${c.link?certArrow:''}</div><div class="og">${c.org}</div></div></div>
      <div class="dt">${c.date}</div>`;
    return c.link
      ? `<a class="row link" href="${c.link}" target="_blank" rel="noopener" aria-label="View ${c.name} certificate (opens in new tab)">${inner}</a>`
      : `<div class="row">${inner}</div>`;
  }).join('');

  // Contact
  const icons = {
    email:'<path d="M3 5h18v14H3z"/><path d="m3 6 9 7 9-7"/>',
    github:'<path d="M12 1.5C6 1.5 1.5 6 1.5 12c0 4.6 3 8.5 7.2 9.9.5.1.7-.2.7-.5v-1.8c-2.9.6-3.5-1.3-3.5-1.3-.5-1.2-1.2-1.5-1.2-1.5-1-.6 0-.6 0-.6 1 .1 1.6 1.1 1.6 1.1 1 1.6 2.5 1.2 3.1.9.1-.7.4-1.2.7-1.4-2.3-.3-4.8-1.2-4.8-5.1 0-1.1.4-2.1 1.1-2.8-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 2.9 1.1a10 10 0 0 1 5.2 0c2-1.4 2.9-1.1 2.9-1.1.6 1.5.2 2.6.1 2.9.7.7 1.1 1.7 1.1 2.8 0 3.9-2.5 4.8-4.8 5.1.4.3.7 1 .7 1.9v2.8c0 .3.2.6.7.5A10.5 10.5 0 0 0 22.5 12c0-6-4.5-10.5-10.5-10.5z"/>',
    linkedin:'<path d="M4.5 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3 9h3v12H3zM9 9h2.9v1.6h.04c.4-.76 1.4-1.6 2.9-1.6 3.1 0 3.7 2 3.7 4.7V21h-3v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9z"/>',
    phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 1.9.6 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.8.6a2 2 0 0 1 1.7 2z"/>',
    xorvion:'<path d="M12 2 20.5 7v10L12 22 3.5 17V7z"/><path d="m9 9 6 6M15 9l-6 6"/>',
  };
  const isStroke = {email:true, phone:true, linkedin:false, github:false, xorvion:true};
  el('contactLinks').innerHTML = [
    {k:'email', label:'Email', v:cv.email, href:'mailto:'+cv.email},
    {k:'github', label:'GitHub', v:'@Sumitkr28', href:'https://'+cv.github},
    {k:'linkedin', label:'LinkedIn', v:'sumit-kumar2812', href:'https://'+cv.linkedin},
    {k:'xorvion', label:'Xorvion AI', v:'xorvion-ai.vercel.app', href:'https://xorvion-ai.vercel.app/'},
    {k:'phone', label:'Phone', v:cv.phone, href:'tel:'+cv.phone.replace(/\s/g,'')},
  ].map(l=>`
    <a class="iconlink" href="${l.href}" ${l.k==='email'||l.k==='phone'?'':'target="_blank" rel="noopener"'} aria-label="${l.label}: ${l.v}">
      <span class="ic"><svg viewBox="0 0 24 24" width="22" height="22" ${isStroke[l.k]?'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"':'fill="currentColor"'}>${icons[l.k]}</svg></span>
      <span class="meta"><span class="lk">${l.label}</span><span class="lv">${l.v}</span></span>
    </a>
  `).join('');

  // Re-observe newly injected .reveal elements
  if(window.__observeReveal) window.__observeReveal();
})();
