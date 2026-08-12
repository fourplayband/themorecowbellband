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
        img.addEventListener('error', function(){ if(this.src !== src) this.src = src; });
        img.setAttribute('loading', 'lazy');
        img.setAttribute('decoding', 'async');
        img.setAttribute('fetchpriority', 'low');

        // orientation detection for thumbnails (portrait/landscape/square)
        function markOrientation(i){
          try{
            if(!i.naturalWidth || !i.naturalHeight) return;
            if(i.naturalHeight > i.naturalWidth) i.classList.add('portrait');
            else if(i.naturalHeight < i.naturalWidth) i.classList.add('landscape');
            else i.classList.add('square');
          }catch(e){}
        }
        img.addEventListener('load', function(){ markOrientation(img); });
        if(img.complete) markOrientation(img);
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
