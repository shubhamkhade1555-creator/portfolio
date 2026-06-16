/* full-page moving constellation behind content (standalone, always alive) */
(function(){
  function init(){
    var cv=document.getElementById('bgp');if(!cv)return;var ctx=cv.getContext('2d');if(!ctx)return;
    var P=[],mx=-999,my=-999,DPR=Math.min(2,window.devicePixelRatio||1);
    function size(){var w=window.innerWidth,h=window.innerHeight;
      cv.width=w*DPR;cv.height=h*DPR;cv.style.width=w+'px';cv.style.height=h+'px';ctx.setTransform(DPR,0,0,DPR,0,0);
      var N=Math.min(120,Math.max(40,Math.floor(w/15)));P=[];
      for(var i=0;i<N;i++)P.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.2,r:Math.random()*1.5+.5,c:Math.random()<.15});}
    size();window.addEventListener('resize',size);
    window.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;});
    function draw(){var w=window.innerWidth,h=window.innerHeight;ctx.clearRect(0,0,w,h);
      var dark=document.documentElement.getAttribute('data-theme')==='dark',dot=dark?'#EDEAE3':'#13110D',clay=dark?'#E87A52':'#D8623A';
      for(var i=0;i<P.length;i++){var p=P[i],dx=p.x-mx,dy=p.y-my,d2=dx*dx+dy*dy;
        if(d2<20000){var f=(20000-d2)/20000*.6,d=Math.max(20,Math.sqrt(d2));p.vx+=dx/d*f;p.vy+=dy/d*f;}
        p.vx*=.98;p.vy*=.98;p.x+=p.vx;p.y+=p.vy;
        if(p.x<0)p.x+=w;if(p.x>w)p.x-=w;if(p.y<0)p.y+=h;if(p.y>h)p.y-=h;
        for(var j=i+1;j<P.length;j++){var q=P[j],ax=p.x-q.x,ay=p.y-q.y,dd=ax*ax+ay*ay;
          if(dd<12000){ctx.globalAlpha=(1-dd/12000)*.10;ctx.strokeStyle=dot;ctx.lineWidth=.5;
            ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}}
        ctx.globalAlpha=p.c?.7:.32;ctx.fillStyle=p.c?clay:dot;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill();}
      ctx.globalAlpha=1;requestAnimationFrame(draw);}
    draw();
  }
  if(document.readyState!=='loading')init();else document.addEventListener('DOMContentLoaded',init);
})();

/* ---------------------------------- */

/* ---- FAILSAFE: never leave page invisible ---- */
function forceShow(){document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'));
  document.querySelectorAll('.lineMask').forEach(e=>e.classList.add('in'));
  var p=document.getElementById('portrait');if(p)p.classList.add('in');
  var l=document.getElementById('loader');if(l)l.classList.add('done');}
setTimeout(forceShow,3500);
window.addEventListener('error',forceShow);

/* ---- PRELOADER: monochrome spinning globe + whirl ---- */
(function(){
  var loader=document.getElementById('loader'),cv=document.getElementById('globe'),stop=false;
  if(cv&&cv.getContext){
    var ctx=cv.getContext('2d'),DPR=Math.min(2,window.devicePixelRatio||1);
    cv.width=200*DPR;cv.height=200*DPR;ctx.scale(DPR,DPR);
    var N=460,pts=[],R=78,cx=100,cy=100,rot=0;
    for(var i=0;i<N;i++){var y=1-(i/(N-1))*2,rr=Math.sqrt(1-y*y),th=i*2.399963;
      pts.push({x:Math.cos(th)*rr,y:y,z:Math.sin(th)*rr});}
    (function frame(){if(stop)return;ctx.clearRect(0,0,200,200);rot+=0.013;
      var s=Math.sin(rot),c=Math.cos(rot),pr=[];
      for(var i=0;i<N;i++){var p=pts[i];pr.push({x:p.x*c-p.z*s,y:p.y,z:p.x*s+p.z*c});}
      pr.sort(function(a,b){return a.z-b.z;});
      for(var k=0;k<pr.length;k++){var q=pr[k],d=(q.z+1)/2;ctx.globalAlpha=.14+d*.74;ctx.fillStyle='#EDEAE3';
        ctx.beginPath();ctx.arc(cx+q.x*R,cy+q.y*R,.5+d*1.7,0,7);ctx.fill();}
      ctx.globalAlpha=.22;ctx.strokeStyle='#EDEAE3';ctx.lineWidth=1;
      ctx.beginPath();ctx.ellipse(cx,cy,R+16,(R+16)*.34,rot*.5,0,7);ctx.stroke();
      var a=rot*1.7;ctx.globalAlpha=1;ctx.fillStyle='#D8623A';
      ctx.beginPath();ctx.arc(cx+Math.cos(a)*(R+16),cy+Math.sin(a)*(R+16),3.6,0,7);ctx.fill();
      requestAnimationFrame(frame);})();
  }
  setTimeout(function(){stop=true;if(loader)loader.classList.add('done');try{start();}catch(e){forceShow();}},2100);
})();

function start(){
  var lenis;
  if(window.Lenis){lenis=new Lenis({lerp:.085,wheelMultiplier:1});
    (function raf(t){lenis.raf(t);requestAnimationFrame(raf);})();
    if(window.ScrollTrigger)lenis.on('scroll',ScrollTrigger.update);}

  document.querySelectorAll('.lineMask').forEach(function(el,i){setTimeout(function(){el.classList.add('in');},120+i*120);});
  setTimeout(function(){var p=document.getElementById('portrait');if(p)p.classList.add('in');},420);

  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{threshold:.12,rootMargin:'0px 0px -5% 0px'});
  var vh=window.innerHeight||800;
  /* content-first: anything already in view reveals immediately, rest on scroll */
  document.querySelectorAll('.reveal').forEach(function(el){
    if(el.getBoundingClientRect().top < vh*0.96){el.classList.add('in');}
    else{io.observe(el);}});

  var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){
    var el=e.target,end=+el.dataset.count,suf=el.dataset.suffix||'',c=0,step=Math.max(1,Math.floor(end/45));
    var tk=setInterval(function(){c+=step;if(c>=end){c=end;clearInterval(tk);}el.textContent=c+suf;},20);
    cio.unobserve(el);}})},{threshold:.6});
  document.querySelectorAll('[data-count]').forEach(function(el){cio.observe(el);});

  /* cursor */
  var cur=document.getElementById('cursor'),spot=document.getElementById('spot'),cx=0,cy=0,tx=0,ty=0,sx=0,sy=0;
  window.addEventListener('mousemove',function(e){tx=e.clientX;ty=e.clientY;if(spot)spot.style.opacity='1';});
  (function loop(){cx+=(tx-cx)*.2;cy+=(ty-cy)*.2;cur.style.transform='translate('+(cx-4)+'px,'+(cy-4)+'px)';
    sx+=(tx-sx)*.09;sy+=(ty-sy)*.09;if(spot)spot.style.transform='translate('+sx.toFixed(1)+'px,'+sy.toFixed(1)+'px) translate(-50%,-50%)';
    requestAnimationFrame(loop);})();
  document.querySelectorAll('a,button,.wcard,.caprow').forEach(function(el){
    el.addEventListener('mouseenter',function(){cur.classList.add('grow');});
    el.addEventListener('mouseleave',function(){cur.classList.remove('grow');});});

  /* theme */
  var tb=document.getElementById('theme');
  tb.addEventListener('click',function(){var d=document.documentElement,on=d.getAttribute('data-theme')==='dark';
    d.setAttribute('data-theme',on?'':'dark');tb.textContent=on?'Dark':'Light';});

  /* nav scroll-state + sticky FAB + progress */
  var navEl=document.getElementById('nav'),fab=document.getElementById('fab'),heroEl=document.querySelector('.hero'),prog=document.getElementById('progress');
  function onScroll(){var y=window.scrollY||window.pageYOffset||0,hh=heroEl?heroEl.offsetHeight:600;
    navEl.classList.toggle('scrolled',y>hh-90);
    if(fab)fab.classList.toggle('show',y>hh*0.7);
    if(prog){var max=document.documentElement.scrollHeight-window.innerHeight;
      prog.style.width=(max>0?(y/max*100):0)+'%';}}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* hamburger menu */
  var tgl=document.getElementById('navToggle'),lnk=document.getElementById('navLinks');
  function closeMenu(){lnk.classList.remove('open');navEl.classList.remove('menu-open');
    tgl.setAttribute('aria-expanded','false');tgl.setAttribute('aria-label','Open menu');}
  if(tgl){tgl.addEventListener('click',function(){var open=lnk.classList.toggle('open');
    navEl.classList.toggle('menu-open',open);tgl.setAttribute('aria-expanded',open?'true':'false');
    tgl.setAttribute('aria-label',open?'Close menu':'Open menu');});
    lnk.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeMenu);});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu();});}

  /* magnetic buttons + 3D portrait tilt (fine pointer only) */
  if(window.matchMedia&&window.matchMedia('(pointer:fine)').matches){
    document.querySelectorAll('.btn,.nav-resume,.fab a').forEach(function(el){
      el.addEventListener('mousemove',function(e){var r=el.getBoundingClientRect();
        var x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;
        el.style.transform='translate('+(x*0.25).toFixed(1)+'px,'+(y*0.4).toFixed(1)+'px)';});
      el.addEventListener('mouseleave',function(){el.style.transform='';});});
  }

  /* clock */
  var clk=document.getElementById('clock');
  (function tick(){var t=new Date().toLocaleTimeString('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',second:'2-digit'});clk.textContent='Pune, IST — '+t;setTimeout(tick,1000);})();

  /* ---- HERO FLOW FIELD ---- */
  (function(){
    var cv=document.getElementById('flow');if(!cv)return;
    var ctx=cv.getContext('2d'),W,H,parts=[],f=0,mx=-999,my=-999;
    function acc(v){return getComputedStyle(document.documentElement).getPropertyValue(v).trim();}
    function size(){W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight;parts=[];
      var N=Math.min(170,Math.floor(W/9));
      for(var i=0;i<N;i++)parts.push({x:Math.random()*W,y:Math.random()*H,vx:0,vy:0,s:Math.random()*1.6+.4,hl:Math.random()<.16});}
    size();
    var hero=document.querySelector('.hero');
    hero.addEventListener('mousemove',function(e){var r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;});
    hero.addEventListener('mouseleave',function(){mx=-999;my=-999;});
    function noise(x,y){return Math.sin(x*.0024+f)*Math.cos(y*.0024-f*.7)+Math.sin((x+y)*.0016+f*.5);}
    function draw(){f+=.0016;ctx.clearRect(0,0,W,H);
      var ink=acc('--ink-soft'),cl=acc('--clay'),ac=acc('--accent');
      for(var i=0;i<parts.length;i++){var p=parts[i];
        var a=noise(p.x,p.y)*Math.PI*1.5;p.vx+=Math.cos(a)*.06;p.vy+=Math.sin(a)*.06;
        var dx=p.x-mx,dy=p.y-my,d2=dx*dx+dy*dy;
        if(d2<19000){var f2=(19000-d2)/19000*1.4;p.vx+=dx/Math.sqrt(d2+1)*f2;p.vy+=dy/Math.sqrt(d2+1)*f2;}
        p.vx*=.94;p.vy*=.94;p.x+=p.vx;p.y+=p.vy;
        if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
        for(var j=i+1;j<parts.length;j++){var q=parts[j],ddx=p.x-q.x,ddy=p.y-q.y,dd=ddx*ddx+ddy*ddy;
          if(dd<8000){ctx.globalAlpha=(1-dd/8000)*.16;ctx.strokeStyle=ink;ctx.lineWidth=.6;
            ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}}
        ctx.globalAlpha=p.hl?.95:.4;ctx.fillStyle=p.hl?cl:ink;
        ctx.beginPath();ctx.arc(p.x,p.y,p.hl?p.s+1.4:p.s,0,7);ctx.fill();}
      ctx.globalAlpha=1;requestAnimationFrame(draw);}
    draw();window.addEventListener('resize',size);
  })();

  /* ---- WORK CARD CANVAS ---- */
  document.querySelectorAll('canvas[data-vis]').forEach(function(cv){
    var ctx=cv.getContext('2d'),type=cv.dataset.vis,W,H,f=0;
    function acc(v){return getComputedStyle(document.documentElement).getPropertyValue(v).trim();}
    function size(){var r=cv.getBoundingClientRect();cv.width=r.width*2;cv.height=r.height*2;W=r.width;H=r.height;ctx.setTransform(2,0,0,2,0,0);}
    size();
    function draw(){f+=.012;ctx.clearRect(0,0,W,H);var c=acc('--clay'),ln='#7a7468';
      if(type==='wave'){for(var r=0;r<6;r++){ctx.beginPath();
        for(var x=0;x<=W;x+=4){var y=H/2+Math.sin(x*.022+f*2+r*.6)*(16+r*7)*Math.sin(f+r);x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
        ctx.strokeStyle=r===2?c:ln;ctx.globalAlpha=r===2?.95:.22;ctx.lineWidth=r===2?1.8:1;ctx.stroke();}ctx.globalAlpha=1;}
      else if(type==='grid'){var g=28;ctx.globalAlpha=.22;ctx.strokeStyle=ln;
        for(var x=0;x<W;x+=g){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
        for(var y=0;y<H;y+=g){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
        ctx.globalAlpha=1;var px=W/2+Math.sin(f)*W*.32,py=H/2+Math.cos(f*.7)*H*.32;
        ctx.fillStyle=c;ctx.beginPath();ctx.arc(px,py,5,0,7);ctx.fill();
        ctx.strokeStyle=c;ctx.globalAlpha=.45;ctx.beginPath();ctx.arc(px,py,14+Math.sin(f*3)*5,0,7);ctx.stroke();ctx.globalAlpha=1;}
      else{var n=46;for(var i=0;i<n;i++){var a=i/n*7+f,rad=H*.34*(.5+.5*Math.sin(f+i));
        var x=W/2+Math.cos(a)*rad,y=H/2+Math.sin(a)*rad;ctx.fillStyle=i%6===0?c:ln;ctx.globalAlpha=i%6===0?.95:.3;
        ctx.beginPath();ctx.arc(x,y,i%6===0?3:1.6,0,7);ctx.fill();}ctx.globalAlpha=1;}
      requestAnimationFrame(draw);}
    draw();window.addEventListener('resize',size);
  });

  /* parallax */
  if(window.gsap&&window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);
    gsap.to('.hero-inner',{yPercent:-6,opacity:.55,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});}
}