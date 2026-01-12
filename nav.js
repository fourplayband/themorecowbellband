// Centralized nav toggle logic for More Cowbell
(function(){
  function init(){
    var btn = document.getElementById('nav-toggle');
    var mobile = document.getElementById('mobile-nav');
    console.log('nav.js loaded', !!btn, !!mobile);
    if(!btn || !mobile) return;

    // Start closed
    mobile.classList.remove('open');
    mobile.classList.add('hidden');
    btn.setAttribute('aria-expanded','false');
    // ensure toggle sits above other header elements
    try{ btn.style.zIndex = 1200; }catch(e){}

    function setOpenState(isOpen){
      console.log('nav:setOpenState', isOpen);
      if(isOpen){
        mobile.classList.remove('hidden');
      } else {
        mobile.classList.add('hidden');
      }
      document.body.classList.toggle('no-scroll', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
    }

    function toggle(){
      var isOpen = mobile.classList.toggle('open');
      setOpenState(isOpen);
    }

    btn.addEventListener('click', function(e){
      e.stopPropagation();
      console.log('nav-toggle clicked');
      // visual flash so user sees the click registered
      btn.classList.add('mc-toggle-active');
      setTimeout(function(){ btn.classList.remove('mc-toggle-active'); }, 300);
      toggle();
    });
    btn.addEventListener('keyup', function(e){ if(e.key==='Enter'||e.key===' ') { e.preventDefault(); toggle(); } });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape' && mobile.classList.contains('open')) toggle(); });
    window.addEventListener('resize', function(){ if(window.innerWidth>=1280 && mobile.classList.contains('open')) toggle(); });
    mobile.addEventListener('click', function(e){ if(!e.target.closest('.mc-nav-inner') && mobile.classList.contains('open')) toggle(); });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
