// Testimonials Carousel
(function() {
  var currentIndex = 0;
  var testimonials = [];
  var track, dots, prevBtn, nextBtn;
  var autoplayInterval;

  function init() {
    track = document.getElementById('testimonial-track');
    dots = document.getElementById('testimonial-dots');
    prevBtn = document.getElementById('testimonial-prev');
    nextBtn = document.getElementById('testimonial-next');

    if (!track) return;

    loadTestimonials();
  }

  function loadTestimonials() {
    fetch('data/testimonials.json')
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        testimonials = data;
        renderTestimonials();
        setupNavigation();
        startAutoplay();
      })
      .catch(function(error) {
        console.error('Error loading testimonials:', error);
      });
  }

  function renderTestimonials() {
    var html = '';
    
    testimonials.forEach(function(testimonial, index) {
      var textHtml = testimonial.text.map(function(paragraph) {
        return '<p class="testimonial__text">' + paragraph + '</p>';
      }).join('');

      html += '<div class="testimonial-carousel__slide' + (index === 0 ? ' active' : '') + '">' +
        '<div class="testimonial">' +
          '<div class="testimonial__quote">' +
            textHtml +
            '<p class="testimonial__author">' + testimonial.author + '</p>' +
            '<p class="testimonial__role">' + testimonial.role + '<br>' + testimonial.company + '</p>' +
          '</div>' +
        '</div>' +
      '</div>';
    });

    track.innerHTML = html;

    // Create dots
    var dotsHtml = '';
    testimonials.forEach(function(_, index) {
      dotsHtml += '<button class="testimonial-carousel__dot' + (index === 0 ? ' active' : '') + '" data-index="' + index + '" aria-label="Go to testimonial ' + (index + 1) + '"></button>';
    });
    dots.innerHTML = dotsHtml;
  }

  function setupNavigation() {
    prevBtn.addEventListener('click', function() {
      goToSlide(currentIndex - 1);
      resetAutoplay();
    });

    nextBtn.addEventListener('click', function() {
      goToSlide(currentIndex + 1);
      resetAutoplay();
    });

    dots.addEventListener('click', function(e) {
      if (e.target.classList.contains('testimonial-carousel__dot')) {
        var index = parseInt(e.target.getAttribute('data-index'));
        goToSlide(index);
        resetAutoplay();
      }
    });
  }

  function goToSlide(index) {
    var slides = track.querySelectorAll('.testimonial-carousel__slide');
    var dotBtns = dots.querySelectorAll('.testimonial-carousel__dot');

    // Handle wrap-around
    if (index < 0) {
      index = slides.length - 1;
    } else if (index >= slides.length) {
      index = 0;
    }

    // Update slides
    slides.forEach(function(slide, i) {
      slide.classList.remove('active', 'prev', 'next');
      if (i === index) {
        slide.classList.add('active');
      } else if (i === currentIndex) {
        slide.classList.add(index > currentIndex ? 'prev' : 'next');
      }
    });

    // Update dots
    dotBtns.forEach(function(dot, i) {
      dot.classList.toggle('active', i === index);
    });

    currentIndex = index;
  }

  function startAutoplay() {
    autoplayInterval = setInterval(function() {
      goToSlide(currentIndex + 1);
    }, 15000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
