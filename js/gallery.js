// ============================================================
// GALERI - AGUNG PERKASA BOREPILE
// ============================================================

(function() {
    'use strict';

    // ==================== MOBILE MENU ====================
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            const isActive = navMenu.classList.contains('active');
            this.setAttribute('aria-expanded', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        document.querySelectorAll('.nav-menu a').forEach(function(link) {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
                mobileMenu.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // ==================== DROPDOWN MOBILE ====================
    document.querySelectorAll('.dropdown .dropbtn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                var parent = this.closest('.dropdown');
                parent.classList.toggle('active');
                document.querySelectorAll('.dropdown').forEach(function(d) {
                    if (d !== parent) {
                        d.classList.remove('active');
                    }
                });
            }
        });
    });

    // ==================== SHRINK NAVBAR ====================
    var navbar = document.querySelector('.navbar');
    if (navbar) {
        var lastScrollY = 0;
        var ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    var currentScrollY = window.scrollY || window.pageYOffset;
                    if (currentScrollY > 50 && currentScrollY > lastScrollY) {
                        navbar.classList.add('shrink');
                    } else if (currentScrollY <= 50) {
                        navbar.classList.remove('shrink');
                    }
                    lastScrollY = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ==================== SCROLL TOP ====================
    var scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('active');
            } else {
                scrollTopBtn.classList.remove('active');
            }
        });

        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==================== GALLERY FILTER ====================
    var filterChips = document.querySelectorAll('.filter-chip');
    var galleryCards = document.querySelectorAll('.gallery-card');
    var noResults = document.getElementById('noResults');

    function filterGallery(category) {
        var visibleCount = 0;
        galleryCards.forEach(function(card) {
            var cardCategory = card.getAttribute('data-category');
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                visibleCount++;
                card.style.animation = 'fadeInUp 0.4s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    filterChips.forEach(function(chip) {
        chip.addEventListener('click', function() {
            filterChips.forEach(function(c) {
                c.classList.remove('active');
            });
            this.classList.add('active');
            var filter = this.getAttribute('data-filter');
            filterGallery(filter);
        });
    });

    // ==================== LIGHTBOX ====================
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxCaption = document.getElementById('lightboxCaption');
    var closeBtn = document.querySelector('.close-lightbox');
    var prevBtn = document.querySelector('.nav-lightbox.prev');
    var nextBtn = document.querySelector('.nav-lightbox.next');

    var currentIndex = 0;
    var currentImages = [];

    function updateCurrentImages() {
        currentImages = [];
        var visibleCards = Array.from(galleryCards).filter(function(card) {
            return card.style.display !== 'none';
        });
        visibleCards.forEach(function(card) {
            var img = card.querySelector('.gallery-card-img');
            var title = card.querySelector('h3') ? card.querySelector('h3').innerText : '';
            var location = card.querySelector('p') ? card.querySelector('p').innerText : '';
            currentImages.push({
                src: img ? img.src : '',
                caption: title + ' - ' + location
            });
        });
    }

    function openLightbox(index) {
        updateCurrentImages();
        if (currentImages.length === 0) return;
        currentIndex = index;
        lightboxImg.src = currentImages[currentIndex].src;
        lightboxCaption.textContent = currentImages[currentIndex].caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function nextImage() {
        if (currentImages.length === 0) return;
        currentIndex = (currentIndex + 1) % currentImages.length;
        lightboxImg.src = currentImages[currentIndex].src;
        lightboxCaption.textContent = currentImages[currentIndex].caption;
    }

    function prevImage() {
        if (currentImages.length === 0) return;
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        lightboxImg.src = currentImages[currentIndex].src;
        lightboxCaption.textContent = currentImages[currentIndex].caption;
    }

    galleryCards.forEach(function(card, idx) {
        card.addEventListener('click', function() {
            var visibleCards = Array.from(galleryCards).filter(function(c) {
                return c.style.display !== 'none';
            });
            var newIndex = visibleCards.indexOf(card);
            if (newIndex !== -1) openLightbox(newIndex);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', prevImage);
    if (nextBtn) nextBtn.addEventListener('click', nextImage);

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });

    console.log('Galeri siap dengan ' + galleryCards.length + ' foto');

    // ==================== ARTIKEL ANIMASI (Intersection Observer) ====================
    var articleCards = document.querySelectorAll('.article-card');
    if (articleCards.length > 0 && 'IntersectionObserver' in window) {
        var articleObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    articleObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '50px' });

        articleCards.forEach(function(card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            articleObserver.observe(card);
        });
    } else {
        articleCards.forEach(function(card) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    }

})();