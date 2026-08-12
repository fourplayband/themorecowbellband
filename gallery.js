(function(){
  function initGallery(){
    var grid = document.getElementById('photo-grid');
    if(!grid) return;
    fetch('assets/photos/index.json').then(function(r){
      if(!r.ok) throw new Error('index.json not found');
      return r.json();
    }).then(function(list){
      list.forEach(function(fn, idx){
        var img = document.createElement('img');
        var src = 'assets/photos/' + fn;
        img.alt = fn;
        img.className = 'mb-4 rounded-xl shadow w-full block';

        // derive thumbnail path next to the source: .../photos/thumbs/name.webp
        function deriveThumbSync(s){
          try{
            var a = document.createElement('a'); a.href = s;
            var pathname = a.pathname;
            var parts = pathname.split('/');
            var filename = parts.pop();
            var dir = parts.join('/');
            var name = filename.replace(/\.[^/.]+$/, '');
            return dir + '/thumbs/' + name + '.webp';
          }catch(e){ return s; }
        }
        var thumb = deriveThumbSync(src);
        img.src = thumb;
        img.setAttribute('data-full', src);
        // default focus is auto for these generated thumbnails
        img.setAttribute('data-focus', 'auto');
        img.addEventListener('error', function(){ if(this.src !== src) this.src = src; });
        img.setAttribute('loading', 'lazy');
        img.setAttribute('decoding', 'async');
        img.setAttribute('fetchpriority', 'low');

        // apply focus/object-position on thumbnail after load
        function applyFocus(i){
          try{
            var focusVal = i.dataset && i.dataset.focus ? i.dataset.focus : 'auto';
            i.style.objectFit = 'cover';
            if(!focusVal || focusVal === 'auto'){
              if(i.naturalHeight > i.naturalWidth) i.style.objectPosition = '50% 25%';
              else i.style.objectPosition = '50% 50%';
            } else {
              var posMap = { top: '50% 5%', upper: '50% 25%', center: '50% 50%', lower: '50% 70%', bottom: '50% 95%' };
              i.style.objectPosition = posMap[focusVal] || '50% 50%';
            }
          }catch(e){}
        }
        img.addEventListener('load', function(){ applyFocus(img); });
        if(img.complete) applyFocus(img);
        var wrapper = document.createElement('div');
        wrapper.className = 'photo-item';
        wrapper.style.breakInside = 'avoid';
        wrapper.appendChild(img);
        grid.appendChild(wrapper);
      });
    }).catch(function(err){
      console.warn('gallery init error', err);
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', initGallery); else initGallery();
})();
