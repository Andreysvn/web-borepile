// ============================================================
// PROSES.JS - FIX TOTAL (FAQ BUKA TUTUP)
// ============================================================

(function() {
    'use strict';

    console.log('🚀 Proses page script started');

    // ============================================================
    // FAQ ACCORDION - BISA BUKA & TUTUP
    // ============================================================
    var faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length > 0) {
        for (var i = 0; i < faqItems.length; i++) {
            var btn = faqItems[i].querySelector('.faq-question');
            var answer = faqItems[i].querySelector('.faq-answer');
            
            if (btn && answer) {
                // Set initial state
                if (btn.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    answer.classList.add('show');
                } else {
                    answer.style.maxHeight = '0';
                    answer.classList.remove('show');
                }
                
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    var currentBtn = this;
                    var currentItem = currentBtn.closest('.faq-item');
                    var currentAnswer = currentItem.querySelector('.faq-answer');
                    
                    if (!currentAnswer) return;
                    
                    var isOpen = currentBtn.classList.contains('active');
                    
                    // Tutup SEMUA
                    document.querySelectorAll('.faq-item').forEach(function(item) {
                        var q = item.querySelector('.faq-question');
                        var a = item.querySelector('.faq-answer');
                        if (a) {
                            q.classList.remove('active');
                            q.setAttribute('aria-expanded', 'false');
                            a.classList.remove('show');
                            a.style.maxHeight = '0';
                        }
                    });
                    
                    // Kalo yang diklik tadinya TUTUP, baru buka
                    if (!isOpen) {
                        currentBtn.classList.add('active');
                        currentBtn.setAttribute('aria-expanded', 'true');
                        currentAnswer.classList.add('show');
                        currentAnswer.style.maxHeight = currentAnswer.scrollHeight + 'px';
                    }
                });
            }
        }
        console.log('✅ FAQ registered: ' + faqItems.length + ' items');
    } else {
        console.log('⚠️ No .faq-item found');
    }

    // ============================================================
    // NAVBAR SHRINK
    // ============================================================
    var navbar = document.querySelector('.navbar');
    if (navbar) {
        var ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    var scrollY = window.scrollY || window.pageYOffset;
                    if (scrollY > 50) {
                        navbar.classList.add('shrink');
                    } else {
                        navbar.classList.remove('shrink');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ============================================================
    // MOBILE MENU
    // ============================================================
    var mobileMenu = document.getElementById('mobile-menu');
    var navMenu = document.querySelector('.nav-menu');

    if (mobileMenu && navMenu) {
        var newBtn = mobileMenu.cloneNode(true);
        mobileMenu.parentNode.replaceChild(newBtn, mobileMenu);
        var newMenu = navMenu.cloneNode(true);
        navMenu.parentNode.replaceChild(newMenu, navMenu);

        var finalBtn = document.getElementById('mobile-menu');
        var finalMenu = document.querySelector('.nav-menu');

        if (finalBtn && finalMenu) {
            finalBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                var isActive = finalMenu.classList.toggle('active');
                finalBtn.classList.toggle('active');
                finalBtn.setAttribute('aria-expanded', isActive);
                document.body.style.overflow = isActive ? 'hidden' : '';
            });

            finalMenu.querySelectorAll('a').forEach(function(link) {
                link.addEventListener('click', function() {
                    finalMenu.classList.remove('active');
                    finalBtn.classList.remove('active');
                    finalBtn.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                });
            });

            document.addEventListener('click', function(e) {
                if (finalMenu.classList.contains('active')) {
                    var isInside = finalMenu.contains(e.target) || finalBtn.contains(e.target);
                    if (!isInside) {
                        finalMenu.classList.remove('active');
                        finalBtn.classList.remove('active');
                        finalBtn.setAttribute('aria-expanded', 'false');
                        document.body.style.overflow = '';
                    }
                }
            });
        }
    }

    // ============================================================
    // DROPDOWN MOBILE
    // ============================================================
    document.querySelectorAll('.dropdown .dropbtn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                var parent = this.closest('.dropdown');
                if (parent) {
                    var isActive = parent.classList.contains('active');
                    document.querySelectorAll('.dropdown').forEach(function(d) {
                        d.classList.remove('active');
                    });
                    if (!isActive) {
                        parent.classList.add('active');
                    }
                }
            }
        });
    });

    // ============================================================
    // SCROLL TOP
    // ============================================================
    var scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('active');
            } else {
                scrollTopBtn.classList.remove('active');
            }
        });
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============================================================
    // TOGGLE TECHNICAL DETAILS
    // ============================================================
    document.querySelectorAll('.toggle-details-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var details = this.nextElementSibling;
            if (!details) return;
            
            var isOpen = details.style.display === 'block';
            
            document.querySelectorAll('.technical-details').forEach(function(d) {
                d.style.display = 'none';
            });
            document.querySelectorAll('.toggle-details-btn').forEach(function(b) {
                b.setAttribute('aria-expanded', 'false');
                var icon = b.querySelector('i');
                if (icon) icon.style.transform = 'rotate(0deg)';
            });
            
            if (!isOpen) {
                details.style.display = 'block';
                this.setAttribute('aria-expanded', 'true');
                var icon = this.querySelector('i');
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // ============================================================
    // TIMELINE LABEL INTERACTION
    // ============================================================
    document.querySelectorAll('.timeline-label').forEach(function(label) {
        label.addEventListener('click', function() {
            document.querySelectorAll('.timeline-label').forEach(function(l) {
                l.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // ============================================================
    // COMPARISON ACCORDION
    // ============================================================
    document.querySelectorAll('.comparison-accordion-header').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            var parent = this.closest('.comparison-accordion');
            if (!parent) return;
            
            var isActive = parent.classList.contains('active');
            
            document.querySelectorAll('.comparison-accordion').forEach(function(acc) {
                acc.classList.remove('active');
                var header = acc.querySelector('.comparison-accordion-header');
                if (header) {
                    header.setAttribute('aria-expanded', 'false');
                }
            });
            
            if (!isActive) {
                parent.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

    console.log('✅ Proses page script completed!');

})();