/* CPA Referral: injects the enroll form + student-portal section into index.html
   and runs the referral tracking. Loaded via <script src="./refer.js"></script>
   just before </body> in index.html. (DOM injection is used because the
   assignment's cursor-position paste is not possible with automation tools.) */
(function(){
  'use strict';

  /* ---------- Snippet 1: enroll form under the bKash WhatsApp button ---------- */
  function injectEnrollForm(){
    if(document.getElementById('enrWaBtn')) return; /* already injected */
    var btn = null;
    var links = document.querySelectorAll('a');
    for(var i = 0; i < links.length; i++){
      var t = links[i].textContent || '';
      var h = links[i].getAttribute('href') || '';
      if(t.indexOf('WhatsApp-\u098f \u0995\u09a8\u09ab\u09be\u09b0\u09cd\u09ae \u0995\u09b0\u09c1\u09a8') !== -1 &&
         h.indexOf('wa.me/8801842793958?text=') !== -1 && h.indexOf('%20CPA') !== -1){
        btn = links[i]; break;
      }
    }
    if(!btn) return;
    btn.id = 'enrWaBtn';
    var d = document.createElement('div');
    d.className = 'enroll-form';
    d.style.marginTop = '14px';
    d.innerHTML =
      '<input class="unlock-mail" id="enrName" type="text" placeholder="\u09a4\u09cb\u09ae\u09be\u09b0 \u09a8\u09be\u09ae" style="margin-bottom:10px">' +
      '<input class="unlock-mail" id="enrPhone" type="text" placeholder="\u09ae\u09cb\u09ac\u09be\u0987\u09b2 \u09a8\u09ae\u09cd\u09ac\u09b0" style="margin-bottom:10px">' +
      '<input class="unlock-mail" id="enrRef" type="text" placeholder="\u09b0\u09c7\u09ab\u09be\u09b0 \u0995\u09cb\u09a1 (\u09af\u09a6\u09bf \u09a5\u09be\u0995\u09c7)" style="margin-bottom:6px;text-transform:uppercase">' +
      '<p class="rev-note" id="enrMsg" style="display:none"></p>';
    btn.parentNode.insertBefore(d, btn.nextSibling);
  }

  /* ---------- Snippet 2: student portal button section ---------- */
  function injectPortal(){
    if(document.getElementById('portalSec')) return; /* already injected */
    var btn = document.getElementById('enrWaBtn');
    if(!btn) return;
    var sec = btn.closest ? btn.closest('section') : null;
    if(!sec || !sec.parentNode) return;
    var s = document.createElement('section');
    s.id = 'portalSec';
    s.innerHTML =
      '<div class="wrap" style="text-align:center;padding:6px 0 34px">' +
      '<a class="btn btn-blue" href="./students.html" style="font-size:17px">\uD83C\uDF93 \u0986\u09ae\u09bf \u09ad\u09b0\u09cd\u09a4\u09bf \u09b9\u09af\u09bc\u09c7\u099b\u09bf \u2014 \u0995\u09cd\u09b2\u09be\u09b8\u09c7 \u09a2\u09c1\u0995\u09cb</a>' +
      '<p class="rev-note">\u09ad\u09b0\u09cd\u09a4\u09bf\u09b0 \u09aa\u09b0 WhatsApp-\u098f \u09aa\u09be\u0993\u09af\u09bc\u09be \u09b8\u09cd\u099f\u09c1\u09a1\u09c7\u09a8\u09cd\u099f \u0995\u09cb\u09a1 \u09a6\u09bf\u09af\u09bc\u09c7 \u09b2\u09be\u0987\u09ad \u0995\u09cd\u09b2\u09be\u09b8\u09c7 \u09a2\u09c1\u0995\u09cb</p>' +
      '<p class="rev-note" style="margin-top:10px">\uD83E\uDD1D \u09ac\u09a8\u09cd\u09a7\u09c1\u09a6\u09c7\u09b0 \u09b0\u09c7\u09ab\u09be\u09b0 \u0995\u09b0\u09c7 \u0986\u09af\u09bc \u0995\u09b0\u09cb: <a href="./refer.html" style="color:var(--gold)">Refer &amp; Earn \u2192</a></p>' +
      '</div>';
    sec.parentNode.insertBefore(s, sec.nextSibling);
  }

  /* ---------- Snippet 3: referral tracking ---------- */
  var REF_API = 'https://aiaffiliatelaunch.unaux.com/cpa-download/api.php';
  function refGet(){ try{ return localStorage.getItem('cpaRef') || ''; }catch(e){ return ''; } }
  function refSet(r){ try{ localStorage.setItem('cpaRef', r); }catch(e){} }
  function refPostEnroll(name, contact, ref, type){
    var fd = new FormData();
    fd.append('action','enroll'); fd.append('name', name);
    fd.append('contact', contact || ''); fd.append('ref', ref || ''); fd.append('type', type);
    fetch(REF_API, {method:'POST', body:fd}).catch(function(){});
  }
  function refSay(t, ok){
    var m = document.getElementById('enrMsg');
    if(!m) return;
    m.style.display = 'block'; m.style.color = ok ? '#25d366' : '#ff7b7b'; m.textContent = t;
  }
  function initReferral(){
    var m = /[?&]ref=([A-Za-z0-9]{4,12})/.exec(location.search);
    if(m){
      var code = m[1].toUpperCase();
      refSet(code);
      var fd = new FormData(); fd.append('action','refclick'); fd.append('code', code);
      fetch(REF_API, {method:'POST', body:fd}).catch(function(){});
    }
    var saved = refGet();
    var ri = document.getElementById('enrRef');
    if(saved && ri && !ri.value) ri.value = saved;
    var btn = document.getElementById('enrWaBtn');
    if(btn){
      btn.addEventListener('click', function(ev){
        var nameEl = document.getElementById('enrName');
        var phoneEl = document.getElementById('enrPhone');
        var refEl = document.getElementById('enrRef');
        var name = nameEl ? nameEl.value.trim() : '';
        var phone = phoneEl ? phoneEl.value.trim() : '';
        var ref = refEl ? refEl.value.trim().toUpperCase() : '';
        if(!name){ ev.preventDefault(); refSay('\u26a0\ufe0f \u09a4\u09cb\u09ae\u09be\u09b0 \u09a8\u09be\u09ae \u09b2\u09c7\u0996\u09cb', false); return; }
        if(ref && !/^[A-Z0-9]{4,12}$/.test(ref)){ ev.preventDefault(); refSay('\u26a0\ufe0f \u09b0\u09c7\u09ab\u09be\u09b0 \u0995\u09cb\u09a1\u099f\u09bf \u09b8\u09a0\u09bf\u0995 \u09a8\u09af\u09bc', false); return; }
        if(ref) refSet(ref);
        refPostEnroll(name, phone, ref, 'live');
        var txt = '\u0986\u09ae\u09bf CPA Advanced Master Course-\u098f \u09ad\u09b0\u09cd\u09a4\u09bf \u09b9\u09a4\u09c7 \u099a\u09be\u0987\u0964 \u09a8\u09be\u09ae: ' + name + (phone ? ', \u09ae\u09cb\u09ac\u09be\u0987\u09b2: ' + phone : '') + '\u0964 \u09ac\u09bf\u0995\u09be\u09b6\u09c7 \u09aa\u09c7\u09ae\u09c7\u09a8\u09cd\u099f \u0995\u09b0\u09c7\u099b\u09bf\u0964' + (ref ? ' \u09b0\u09c7\u09ab\u09be\u09b0 \u0995\u09cb\u09a1: ' + ref : '');
        btn.href = 'https://wa.me/8801842793958?text=' + encodeURIComponent(txt);
      });
    }
    var uw = document.getElementById('unlockWaEn');
    if(uw){
      uw.addEventListener('click', function(){
        var r = refGet(); if(!r) return;
        var mail = document.getElementById('unlockMailEn');
        var g = mail ? mail.value.trim() : '';
        refPostEnroll(g || 'PDF buyer', g || '', r, 'pdf');
        if(uw.href.indexOf('Ref') === -1){ uw.href += encodeURIComponent('\nRef code: ' + r); }
      });
    }
  }


  /* ---------- Snippet 4: prominent Refer & Earn section ---------- */
  function injectReferEarn(){
    if(document.getElementById('referEarnSec')) return; /* already injected */
    var anchor = document.getElementById('portalSec');
    if(!anchor){
      var btn = document.getElementById('enrWaBtn');
      anchor = (btn && btn.closest) ? btn.closest('section') : null;
    }
    if(!anchor || !anchor.parentNode) return;
    var s = document.createElement('section');
    s.id = 'referEarnSec';
    s.innerHTML =
      '<div class="wrap" style="padding:10px 0 40px">' +
      '<div style="background:linear-gradient(135deg,#0f2743,#1a3a5c);border:1px solid rgba(255,215,0,.35);border-radius:16px;padding:28px 22px;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,.35);max-width:640px;margin:0 auto">' +
      '<div style="font-size:44px">🤝</div>' +
      '<h2 style="color:#ffd700;margin:10px 0 6px;font-size:27px">রেফার করে আয় করো!</h2>' +
      '<p class="rev-note" style="margin-bottom:6px">বন্ধুদের কোর্সে ভর্তি করাও — প্রতি ভর্তিতে কমিশন তোমার</p>' +
      '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin:18px 0">' +
      '<div style="background:rgba(255,255,255,.06);border:1px solid rgba(37,211,102,.4);border-radius:12px;padding:14px 22px;min-width:140px">' +
      '<div style="font-size:26px;font-weight:800;color:#25d366">৳৫০০</div>' +
      '<div class="rev-note" style="font-size:13px">প্রতি লাইভ কোর্স ভর্তি</div></div>' +
      '<div style="background:rgba(255,255,255,.06);border:1px solid rgba(37,211,102,.4);border-radius:12px;padding:14px 22px;min-width:140px">' +
      '<div style="font-size:26px;font-weight:800;color:#25d366">$৫</div>' +
      '<div class="rev-note" style="font-size:13px">প্রতি English PDF বিক্রি</div></div>' +
      '</div>' +
      '<p class="rev-note" style="margin-bottom:4px">📝 ফ্রি সাইন আপ করো → 🔗 তোমার রেফার লিংক শেয়ার করো → 💰 কেউ ভর্তি হলেই কমিশন</p>' +
      '<p class="rev-note" style="font-size:13px">টাকা পাবে বিকাশ / নগদ / Payoneer-এ</p>' +
      '<a class="btn" href="./refer.html" style="margin-top:16px;font-size:17px">🚀 ফ্রি সাইন আপ করো</a>' +
      '</div></div>';
    anchor.parentNode.insertBefore(s, anchor.nextSibling);
  }


  /* ---------- Snippet 5: Refer button in top nav ---------- */
  function injectNavRefer(){
    if(document.getElementById('navReferBtn')) return; /* already injected */
    var nav = document.querySelector('nav .wrap > div');
    if(!nav) nav = document.querySelector('nav');
    if(!nav) return;
    var a = document.createElement('a');
    a.id = 'navReferBtn';
    a.className = 'nav-cta';
    a.href = './refer.html';
    a.style.background = 'linear-gradient(135deg,#25d366,#128c7e)';
    a.style.boxShadow = '0 6px 20px rgba(37,211,102,.35)';
    a.innerHTML = '<span class="lang-bn">\uD83E\uDD1D \u09b0\u09c7\u09ab\u09be\u09b0</span><span class="lang-en">\uD83E\uDD1D Refer</span>';
    /* put it before the Enroll CTA so it sits on the right side */
    var cta = nav.querySelector('.nav-cta');
    if(cta && cta.parentNode === nav){ nav.insertBefore(a, cta); }
    else { nav.appendChild(a); }
  }

  injectEnrollForm();
  injectPortal();
  injectReferEarn();
  injectNavRefer();
  initReferral();
})();
