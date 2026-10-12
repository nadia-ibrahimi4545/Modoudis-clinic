document.documentElement.classList.add('js'); // برای انیمیشن ظاهر شدن کارت‌ها

var WHATSAPP_NUMBER = '93796337036'; // شماره واتساپ کلینیک (با کد کشور، بدون +)
var navToggle = document.getElementById('navToggle'), navLinks = document.getElementById('navLinks'), siteNav = document.getElementById('siteNav');
function setMenu(open){ if(!navLinks||!navToggle) return; navLinks.classList.toggle('open', open); navToggle.setAttribute('aria-expanded', open ? 'true' : 'false'); }
if(navToggle && navLinks && siteNav){
  navToggle.addEventListener('click', function(e){ e.stopPropagation(); setMenu(!navLinks.classList.contains('open')); });
  navLinks.addEventListener('click', function(e){ if(e.target.closest('a')) setMenu(false); });
  document.addEventListener('click', function(e){ if(!siteNav.contains(e.target)) setMenu(false); });
}
document.addEventListener('keydown', function(e){ if(e.key === 'Escape') setMenu(false); });
window.addEventListener('resize', function(){ if(window.innerWidth > 1100) setMenu(false); });

/* حالت اسکرول هدر + مشخص‌کردن بخش فعال در منو */
(function(){ try{
  if(!navLinks || !siteNav) return;
  var secs = [].slice.call(document.querySelectorAll('section[id]')),
      links = [].slice.call(navLinks.querySelectorAll('a[href^="#"]')).filter(function(a){ return !a.classList.contains('sn-cta'); }),
      ticking = false;
  function update(){
    ticking = false;
    siteNav.classList.toggle('scrolled', window.scrollY > 20);
    var y = window.scrollY + 160, cur = '';
    secs.forEach(function(s){ if(s.offsetTop <= y) cur = s.id; });
    links.forEach(function(a){ a.classList.toggle('active', a.getAttribute('href') === '#' + cur); });
  }
  window.addEventListener('scroll', function(){ if(!ticking){ ticking = true; requestAnimationFrame(update); } }, {passive:true});
  window.addEventListener('resize', update);
  update();
 }catch(err){ console.error('scroll-spy:',err); }
})();

/* ظاهر شدن نرم کارت‌ها هنگام اسکرول */
(function(){ try{
  var els = [].slice.call(document.querySelectorAll('.stats-card,.dr-quote,.an-collage,.an-tag,.bmi-card,.step-card,.map-card,.measure-chip,.dv-card,.service-card,.why-item,.contact-card,.faq-list details,.diet-photo,.env-photo,.physio-band,.footer-cta,.fg-brand,.fg-col'));
  if(!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  els.forEach(function(el){
    var idx = [].indexOf.call(el.parentNode.children, el);
    el.style.transitionDelay = Math.min(idx % 4, 3) * 90 + 'ms';
    el.classList.add('reveal');
    el.addEventListener('transitionend', function(e){
      if(e.target === el && e.propertyName === 'opacity'){ el.classList.remove('reveal','in'); el.style.transitionDelay = ''; }
    });
  });
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  }, {threshold:.12, rootMargin:'0px 0px -5% 0px'});
  els.forEach(function(el){ io.observe(el); });
 }catch(err){ console.error('reveal:',err); }
})();

/* ماشین‌حساب BMI */
(function(){ try{
  var H=document.getElementById('bmi-h'), W=document.getElementById('bmi-w'), card=document.getElementById('bmiCard');
  if(!H||!W) return;
  var FA='۰۱۲۳۴۵۶۷۸۹';
  function fa(s){ return String(s).replace(/\d/g,function(d){return FA[d];}); }
  function num(v){
    v=String(v).replace(/[۰-۹]/g,function(d){return FA.indexOf(d);}).replace(/[٠-٩]/g,function(d){return d.charCodeAt(0)-1632;}).replace(/[٫,،]/g,'.').replace(/[^0-9.]/g,'');
    return parseFloat(v);
  }
  var cats=[
    {max:18.5,name:'کم‌وزن',color:'#4a8fcf',msg:'وزن شما کمتر از محدودهٔ معمول است. برای بررسی دقیق‌تر و برنامهٔ تغذیهٔ مناسب، مشاوره بگیرید.'},
    {max:25,name:'وزن نرمال',color:'#2f9a68',msg:'وزن شما در محدودهٔ معمول است. برای حفظ آن، آنالیز ترکیب بدن (چربی، عضله، آب) می‌تواند کمک‌کننده باشد.'},
    {max:30,name:'اضافه وزن',color:'#d19a17',msg:'وزن شما کمی بالاتر از محدودهٔ معمول است. با آنالیز بدن و یک برنامهٔ اختصاصی می‌توان مسیر مناسب را مشخص کرد.'},
    {max:999,name:'چاقی',color:'#cf5a4f',msg:'وزن شما بالاتر از محدودهٔ معمول است. پیشنهاد می‌شود برای بررسی دقیق و برنامهٔ درمانی زیر نظر متخصص، مشاوره بگیرید.'}
  ];
  function calc(){
    var h=num(H.value), w=num(W.value);
    if(!(h>=100&&h<=250&&w>=20&&w<=300)){ card.classList.remove('has-result'); return; }
    var m=h/100, b=w/(m*m), c=cats[0];
    for(var i=0;i<cats.length;i++){ if(b<cats[i].max){c=cats[i];break;} }
    document.getElementById('bmiNum').textContent=fa(b.toFixed(1));
    var ce=document.getElementById('bmiCat'); ce.textContent=c.name; ce.style.background=c.color;
    document.getElementById('bmiMsg').textContent=c.msg;
    var lo=18.5*m*m, hi=24.9*m*m;
    document.getElementById('bmiRange').innerHTML='محدودهٔ وزن نرمال برای قد شما: <b>'+fa(Math.round(lo))+' تا '+fa(Math.round(hi))+' کیلوگرم</b>';
    var p=Math.max(0,Math.min(1,(b-15)/25))*100;
    document.getElementById('bmiPin').style.insetInlineStart=p+'%';
    card.classList.add('has-result');
  }
  H.addEventListener('input',calc); W.addEventListener('input',calc);
  H.addEventListener('change',calc); W.addEventListener('change',calc);
  calc();
 }catch(err){ console.error('bmi:',err); }
})();

/* ارسال فرم نوبت‌دهی به واتساپ کلینیک */
document.getElementById('apptForm').addEventListener('submit', function(e){
  e.preventDefault();
  if(!this.checkValidity()){ this.reportValidity(); return; }
  var f = this.elements, box = document.getElementById('successMsg');
  var lines = ['سلام، می‌خواهم نوبت بگیرم.', '',
    'نام: ' + f.name.value.trim(),
    'شماره تماس: ' + f.phone.value.trim(),
    'خدمت: ' + f.service.value];
  if(f.when.value.trim()) lines.push('زمان پیشنهادی: ' + f.when.value.trim());
  if(f.note.value.trim()) lines.push('توضیحات: ' + f.note.value.trim());
  var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
  var w = window.open(url, '_blank');
  if(w){ try{ w.opener = null; }catch(_){} } else { window.location.href = url; } // اگر پاپ‌آپ بسته بود، در همین تب باز شود
  box.textContent = 'در حال انتقال به واتساپ... اگر باز نشد، ';
  var a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'اینجا را بزنید.';
  box.appendChild(a); box.style.display = 'block';
  this.reset();
});
