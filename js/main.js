(function(){
// EVENTS: add dates here, e.g. {date:'2026-10-18',title:'Souq Social',place:'Location',time:'12-6 pm'}
var EVENTS=[{date:'2026-10-10',title:"ADAM's Center"},{date:'2026-10-17',title:'Souq Social'}];
var $=function(s){return document.querySelector(s)},$$=function(s){return [].slice.call(document.querySelectorAll(s))};
$('#yr').textContent=new Date().getFullYear();
/* menu + routing */
var burger=$('.burger'),ul=$('#menu');
function closeMenu(){ul.classList.remove('open');burger.setAttribute('aria-expanded','false')}
burger.addEventListener('click',function(){var o=ul.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
function route(){
var r=(location.hash.replace(/^#\/?/,'')||'home'),pg={about:1,book:1,events:1,contact:1,privacy:1},sec={menu:1};
var page=pg[r]?r:'home';
$$('.page').forEach(function(p){p.classList.toggle('on',p.id==='p-'+page)});
$$('nav ul a').forEach(function(a){a.classList.toggle('on',a.dataset.r===page)});
closeMenu();
if(page==='home'&&sec[r]){var e=document.getElementById('s-'+r);if(e)e.scrollIntoView()}else window.scrollTo(0,0);
}
window.addEventListener('hashchange',route);route();
/* cup builder */
var f=$('#bf');
function upd(){
var ice=f.querySelector('input[name=ice]:checked'),fl=[].slice.call(f.querySelectorAll('input[type=checkbox]:checked')).map(function(x){return x.value});
var sub=+ice.value+.5*fl.length,tax=sub*.06;
$('#sub').textContent='$'+sub.toFixed(2);$('#tax').textContent='$'+tax.toFixed(2);$('#tot').textContent='$'+(sub+tax).toFixed(2);
var liqY=+ice.dataset.lv-10;$('#liq').setAttribute('y',liqY);$('#liq').setAttribute('height',200-liqY);
var nCubes=+ice.dataset.cubes;$$('#ice .cube').forEach(function(c,i){c.style.opacity=i<nCubes?1:0});
['lemon','mint','ginger'].forEach(function(n){$('#f-'+n).setAttribute('opacity',fl.indexOf(n)>-1?1:0)});}
f.addEventListener('change',upd);upd();
/* calendar */
var now=new Date(),y=now.getFullYear(),m=now.getMonth(),MN=['January','February','March','April','May','June','July','August','September','October','November','December'];
function pad(n){return n<10?'0'+n:''+n}
function draw(){
$('#mt').textContent=MN[m]+' '+y;
var h=['S','M','T','W','T','F','S'].map(function(d){return '<div class="dn">'+d+'</div>'}).join('');
var first=new Date(y,m,1).getDay(),n=new Date(y,m+1,0).getDate(),mk=y+'-'+pad(m+1)+'-';
var ev=EVENTS.filter(function(e){return e.date.indexOf(mk)===0}).sort(function(a,b){return a.date<b.date?-1:1});
for(var i=0;i<first;i++)h+='<div></div>';
for(var d=1;d<=n;d++){var has=ev.some(function(e){return e.date===mk+pad(d)}),t=(d===now.getDate()&&m===now.getMonth()&&y===now.getFullYear());
h+='<div class="d'+(has?' ev':'')+(t?' today':'')+'">'+d+'</div>'}
$('#grid').innerHTML=h;
$('#evl').innerHTML=ev.length?ev.map(function(e){var dt=new Date(e.date+'T12:00');return '<div class="row"><b>'+MN[dt.getMonth()]+' '+dt.getDate()+'</b><span>'+e.title+(e.place?', '+e.place:'')+(e.time?'<br>'+e.time:'')+'</span></div>'}).join(''):'<p>No events posted for '+MN[m]+' yet. Follow <a href="https://instagram.com/sukkar.cane" target="_blank" rel="noopener">@sukkar.cane</a> to hear about the next one first.</p>';}
$('#prev').onclick=function(){m--;if(m<0){m=11;y--}draw()};
$('#next').onclick=function(){m++;if(m>11){m=0;y++}draw()};
draw();
var cf=$('#cf');
cf.addEventListener('submit',function(ev){ev.preventDefault();var msg=$('#cfm');msg.textContent='Sending...';
fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(cf)).toString()})
.then(function(r){if(!r.ok)throw 0;cf.reset();msg.textContent='Thank you! We got your message and will reply soon.'})
.catch(function(){msg.innerHTML='Sorry, that didn\'t send. Please message us on Instagram, @sukkar.cane.'})});

/* interactive lights (stand + market tents), with a twinkle sound */
var ctxA=null,masterA=null;
function twAudio(){
  try{
    if(!ctxA){
      var AC=window.AudioContext||window.webkitAudioContext; if(!AC) return null;
      ctxA=new AC(); masterA=ctxA.createGain(); masterA.gain.value=.9;
      var dly=ctxA.createDelay(); dly.delayTime.value=.13;
      var fb=ctxA.createGain(); fb.gain.value=.32;
      var wet=ctxA.createGain(); wet.gain.value=.35;
      masterA.connect(ctxA.destination); masterA.connect(dly); dly.connect(fb); fb.connect(dly); dly.connect(wet); wet.connect(ctxA.destination);
    }
    if(ctxA.state==='suspended') ctxA.resume();
    return ctxA;
  }catch(e){return null}
}
var TW_NOTES=[1046.5,1174.7,1318.5,1568,1760,2093,2349.3,2637];
function twPing(t,f,v){
  var o=ctxA.createOscillator(),o2=ctxA.createOscillator(),g=ctxA.createGain(),g2=ctxA.createGain();
  o.type='sine'; o.frequency.value=f; o2.type='triangle'; o2.frequency.value=f*2.005; g2.gain.value=.22;
  g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(v,t+.006); g.gain.exponentialRampToValueAtTime(0.0001,t+.55);
  o.connect(g); o2.connect(g2); g2.connect(g); g.connect(masterA);
  o.start(t); o2.start(t); o.stop(t+.6); o2.stop(t+.6);
}
function twinkle(on){
  var c=twAudio(); if(!c) return;
  var t0=c.currentTime+.02, n=on?10:5, i, idx;
  for(i=0;i<n;i++){
    var t=t0+i*(on?.062:.085)+Math.random()*.018;
    if(on){ idx=Math.min(TW_NOTES.length-1, Math.floor(i*.7)+(Math.random()<.4?1:0)); twPing(t,TW_NOTES[idx],.09+Math.random()*.04); }
    else { idx=Math.max(0,TW_NOTES.length-2-i); twPing(t,TW_NOTES[idx],.06); }
  }
}
$$('.lightbtn').forEach(function(btn){
  btn.addEventListener('click',function(){
    var fig=document.getElementById(btn.dataset.target);
    var on=fig.dataset.lit!=='true';
    fig.dataset.lit=on?'true':'false';
    btn.setAttribute('aria-pressed',on?'true':'false');
    var word=fig.id==='standFig'?'stand':'market';
    btn.querySelector('.lbl').textContent=on?('Turn off the '+word+' lights'):('Turn on the '+word+' lights');
    twinkle(on);
  });
});
var STAND_BULBS=[[6.1, 26.66], [11.07, 27.28], [15.87, 31.23], [19.76, 28.09], [21.54, 35.85], [27.84, 29.36], [40.07, 30.73], [49.63, 30.56], [60.73, 30.11], [69.07, 29.67], [76.14, 28.54], [77.76, 37.78], [80.94, 30.89], [84.54, 27.81], [87.44, 31.17], [94.0, 26.5]];
var standArt=$('#standFig');
if(standArt){
  STAND_BULBS.forEach(function(b){
    var h=document.createElement('span'); h.className='halo';
    h.style.left=b[0]+'%'; h.style.top=b[1]+'%';
    h.style.setProperty('--d',(Math.random()*2.4).toFixed(2)+'s');
    h.style.setProperty('--dur',(2.2+Math.random()*1.6).toFixed(2)+'s');
    h.style.setProperty('--t',(b[0]*.006).toFixed(2)+'s');
    standArt.appendChild(h);
  });
}
var TENT_LINES={"T1": [[330, 1004], [540, 1034], [835, 988]], "T2": [[845, 888], [950, 906], [1165, 880]], "T3": [[1035, 794], [1225, 804], [1485, 770]], "T4": [[1400, 714], [1550, 740], [1765, 710]], "T5": [[1950, 1099], [2105, 1122], [2325, 1102]], "T6": [[1615, 1157], [1775, 1194], [2035, 1159]], "T7": [[1285, 1234], [1505, 1302], [1715, 1237]], "T8": [[885, 1394], [1090, 1422], [1390, 1379]]};
(function(){
  var wires=document.getElementById('wires'),bulbs=document.getElementById('bulbs');
  if(!wires||!bulbs) return;
  var NS='http://www.w3.org/2000/svg', SAG=24, SPACING=62;
  function el(n,a){var e=document.createElementNS(NS,n);for(var x in a)e.setAttribute(x,a[x]);return e}
  Object.keys(TENT_LINES).forEach(function(key){
    var pts=TENT_LINES[key];
    for(var s=0;s<pts.length-1;s++){
      var a=pts[s], b=pts[s+1], c=[(a[0]+b[0])/2,(a[1]+b[1])/2+SAG*2];
      wires.appendChild(el('path',{d:'M'+a[0]+' '+a[1]+' Q'+c[0]+' '+c[1]+' '+b[0]+' '+b[1],'class':'wire'}));
      var L=Math.hypot(b[0]-a[0],b[1]-a[1]), n=Math.max(2,Math.round(L/SPACING));
      for(var i=0;i<n;i++){
        var t=(i+.5)/n, u=1-t;
        var x=u*u*a[0]+2*u*t*c[0]+t*t*b[0], y=u*u*a[1]+2*u*t*c[1]+t*t*b[1];
        var g=el('g',{transform:'translate('+x.toFixed(1)+' '+(y+18).toFixed(1)+')'});
        g.style.setProperty('--d',(Math.random()*2.4).toFixed(2)+'s');
        g.style.setProperty('--dur',(2.2+Math.random()*1.6).toFixed(2)+'s');
        g.style.setProperty('--t',(((x-262)/2106)*.9).toFixed(2)+'s');
        g.appendChild(el('circle',{r:72,fill:'url(#hg)','class':'halo2'}));
        g.appendChild(el('rect',{x:-5,y:-16,width:10,height:11,rx:2,'class':'socket'}));
        g.appendChild(el('circle',{r:13,cy:2,'class':'bulb'}));
        bulbs.appendChild(g);
      }
    }
  });
})();
})();
