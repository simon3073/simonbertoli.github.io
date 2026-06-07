/**
 * Project Page Shared Scripts
 * Handles lightbox functionality for project screenshot galleries
 */

(function() {
  var lightbox = document.getElementById('lightbox');
  var lightboxImage = document.getElementById('lightbox-image');
  var closeBtn = document.getElementById('lightbox-close');
  var items = document.querySelectorAll('.screenshot-item, .masonry-item');

  if (!lightbox || !items.length) return;
  
  // Build images array from screenshot items
  var images = [];
  items.forEach(function(item) {
    var img = item.querySelector('img');
    if (img) {
      images.push(img.getAttribute('src'));
    }
  });
  
  var currentIndex = 0;
  
  function openLightbox(index) {
    currentIndex = index;
    lightboxImage.src = images[currentIndex];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  items.forEach(function(item, index) {
    item.addEventListener('click', function() {
      openLightbox(index);
    });
  });
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }
  
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) closeLightbox();
  });
  
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
  });
})();
