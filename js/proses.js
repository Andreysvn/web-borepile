// ============================================================
// PROSES.JS - KHUSUS HALAMAN PROSES JASA
// ============================================================

(function() {
    'use strict';

    // ===== 1. NAVBAR SHRINK =====
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    const scrollY = window.scrollY || window.pageYOffset;
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

    // ===== 2. MOBILE MENU =====
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenu && navMenu) {
        const newToggle = mobileMenu.cloneNode(true);
        mobileMenu.parentNode.replaceChild(newToggle, mobileMenu);
        const newMenu = navMenu.cloneNode(true);
        navMenu.parentNode.replaceChild(newMenu, navMenu);

        const menuBtn = document.getElementById('mobile-menu');
        const menuList = document.querySelector('.nav-menu');

        if (menuBtn && menuList) {
            menuBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const isActive = menuList.classList.toggle('active');
                menuBtn.classList.toggle('active');
                menuBtn.setAttribute('aria-expanded', isActive);
                document.body.style.overflow = isActive ? 'hidden' : '';
            });

            menuList.querySelectorAll('a').forEach(function(link) {
                link.addEventListener('click', function() {
                    menuList.classList.remove('active');
                    menuBtn.classList.remove('active');
                    menuBtn.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                });
            });

            document.addEventListener('click', function(e) {
                if (menuList.classList.contains('active')) {
                    const isInside = menuList.contains(e.target) || menuBtn.contains(e.target);
                    if (!isInside) {
                        menuList.classList.remove('active');
                        menuBtn.classList.remove('active');
                        menuBtn.setAttribute('aria-expanded', 'false');
                        document.body.style.overflow = '';
                    }
                }
            });
        }
    }

    // ===== 3. DROPDOWN MOBILE =====
    document.querySelectorAll('.dropdown .dropbtn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = this.closest('.dropdown');
                parent.classList.toggle('active');
                document.querySelectorAll('.dropdown').forEach(function(d) {
                    if (d !== parent) {
                        d.classList.remove('active');
                    }
                });
            }
        });
    });

    // ===== 4. SCROLL TOP =====
    const scrollTopBtn = document.getElementById('scrollTop');
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

    // ===== 5. FAQ ACCORDION =====
    document.querySelectorAll('.faq-question').forEach(function(btn) {
        btn.addEventListener('click', function() {
            requestAnimationFrame(function() {
                const expanded = btn.getAttribute('aria-expanded') === 'true' ? false : true;
                btn.setAttribute('aria-expanded', expanded);
                btn.classList.toggle('active');
                const answer = btn.nextElementSibling;
                if (answer) {
                    answer.classList.toggle('show');
                }
            });
        });
    });

    // ===== 6. TOGGLE TECHNICAL DETAILS =====
    document.querySelectorAll('.toggle-details-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const details = this.nextElementSibling;
            const isOpen = details.style.display === 'block';
            
            // Tutup semua detail lain
            document.querySelectorAll('.technical-details').forEach(function(d) {
                d.style.display = 'none';
            });
            document.querySelectorAll('.toggle-details-btn').forEach(function(b) {
                b.setAttribute('aria-expanded', 'false');
                const icon = b.querySelector('i');
                if (icon) icon.style.transform = 'rotate(0deg)';
            });
            
            if (!isOpen) {
                details.style.display = 'block';
                this.setAttribute('aria-expanded', 'true');
                const icon = this.querySelector('i');
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // ===== 7. TIMELINE LABEL INTERACTION =====
    document.querySelectorAll('.timeline-label').forEach(function(label) {
        label.addEventListener('click', function() {
            document.querySelectorAll('.timeline-label').forEach(function(l) {
                l.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    console.log('Proses jasa page script berjalan!');
})();

    // ===== 8. COMPARISON ACCORDION =====
    document.querySelectorAll('.comparison-accordion-header').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const parent = this.closest('.comparison-accordion');
            const isActive = parent.classList.contains('active');
            
            // Tutup semua accordion lain
            document.querySelectorAll('.comparison-accordion').forEach(function(acc) {
                acc.classList.remove('active');
                acc.querySelector('.comparison-accordion-header').setAttribute('aria-expanded', 'false');
            });
            
            // Buka yang diklik kalau belum aktif
            if (!isActive) {
                parent.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });