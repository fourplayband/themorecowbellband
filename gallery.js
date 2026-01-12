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
        img.src = 'assets/photos/' + fn;
        img.alt = fn;
        img.className = 'mb-4 rounded-xl shadow w-full block';
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
