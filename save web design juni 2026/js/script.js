// ==================== SCRIPT LENGKAP UNTUK AGUNG PERKASA BOREPILE ====================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Script berjalan!');
    
    // ==================== MOBILE MENU TOGGLE ====================
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // ==================== NAVBAR SCROLL EFFECT ====================
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const initNavbar = () => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
            
            if (document.body.classList.contains('home')) {
                if (currentScroll <= 120) {
                    navbar.classList.remove('solid');
                } else {
                    navbar.classList.add('solid');
                }
            } else {
                if (currentScroll <= 120) {
                    navbar.classList.remove('scrolled');
                } else {
                    navbar.classList.add('scrolled');
                }
            }
        };
        
        window.addEventListener('scroll', initNavbar, { passive: true });
        initNavbar();
    }
    
    // ==================== FAQ ACCORDION ====================
    const faqButtons = document.querySelectorAll('.faq-question');
    
    if (faqButtons.length > 0) {
        console.log('FAQ ditemukan: ' + faqButtons.length + ' tombol');
        
        faqButtons.forEach(button => {
            button.addEventListener('click', function() {
                const answer = this.nextElementSibling;
                const isActive = this.classList.contains('active');
                
                faqButtons.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.nextElementSibling) {
                        btn.nextElementSibling.classList.remove('show');
                        btn.nextElementSibling.style.maxHeight = null;
                    }
                });
                
                if (!isActive) {
                    this.classList.add('active');
                    if (answer) {
                        answer.classList.add('show');
                        answer.style.maxHeight = answer.scrollHeight + 50 + 'px';
                    }
                }
            });
        });
    } else {
        console.log('FAQ tidak ditemukan');
    }
    
    // ==================== SCROLL TO TOP BUTTON ====================
    const scrollTopBtn = document.getElementById('scrollTop');
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
    
    // ==================== SMOOTH SCROLLING FOR ANCHOR LINKS ====================
    let cachedNavbarHeight = null;
    
    const getNavbarHeight = () => {
        if (cachedNavbarHeight !== null) return cachedNavbarHeight;
        const navbarEl = document.querySelector('.navbar');
        if (navbarEl) {
            cachedNavbarHeight = navbarEl.offsetHeight;
        }
        return cachedNavbarHeight || 90;
    };
    
    window.addEventListener('resize', () => {
        cachedNavbarHeight = null;
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navbarHeight = getNavbarHeight();
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
    
    // ==================== HIGHLIGHT ACTIVE NAVIGATION LINK ====================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let sectionCache = [];
    
    const updateSectionCache = () => {
        sectionCache = Array.from(sections).map(section => ({
            id: section.getAttribute('id'),
            top: section.offsetTop,
            height: section.clientHeight
        }));
    };
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateSectionCache, 250);
    });
    
    function highlightNav() {
        let current = '';
        const scrollPosition = window.scrollY;
        
        for (let i = 0; i < sectionCache.length; i++) {
            const section = sectionCache[i];
            if (section && scrollPosition >= section.top - section.height / 3) {
                current = section.id;
            }
        }
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}` || (current === 'home' && href === '#')) {
                link.classList.add('active');
            }
        });
    }
    
    updateSectionCache();
    window.addEventListener('scroll', highlightNav, { passive: true });
    highlightNav();
    
    // ==================== LOAD HERO VIDEO ====================
    const loadHeroVideo = () => {
        const heroBackground = document.querySelector('.video-background');
        if (!heroBackground) return;
        
        const videoSrc = heroBackground.dataset.videoSrc;
        if (!videoSrc) return;
        
        if (window.innerWidth >= 992) {
            const video = document.createElement('video');
            video.setAttribute('autoplay', '');
            video.setAttribute('muted', '');
            video.setAttribute('loop', '');
            video.setAttribute('playsinline', '');
            video.setAttribute('preload', 'metadata');
            video.className = 'hero-video';
            
            const source = document.createElement('source');
            source.src = videoSrc;
            source.type = 'video/mp4';
            video.appendChild(source);
            
            heroBackground.insertBefore(video, heroBackground.firstChild);
        }
    };
    
    loadHeroVideo();
    
    // ==================== NEWSLETTER FORM ====================
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('newsletter-email')?.value || '';
            
            if (!email) {
                alert('Mohon isi email Anda terlebih dahulu');
                return;
            }
            
            const whatsappMessage = `Halo, saya dari website ingin meminta informasi penawaran harga. Email saya: ${email}`;
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappNumber = '6285814173761';
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            alert('Terima kasih! Anda akan diarahkan ke WhatsApp...');
            
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 500);
            
            newsletterForm.reset();
        });
    }
    
    // ==================== CONTACT FORM ====================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const formValues = Object.fromEntries(formData.entries());
            
            const name = formValues.name || '';
            const email = formValues.email || '';
            const phone = formValues.phone || '';
            const service = formValues.service || '';
            const message = formValues.message || '';
            
            const whatsappMessage = `*Form Hubungi Kami - Agung Perkasa Borepile*\n\n*Nama:* ${name}\n*Email:* ${email}\n*Nomor Telepon:* ${phone}\n*Jenis Layanan:* ${service}\n*Pesan:* ${message}`.trim();
            
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappNumber = '6285814173761';
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            alert(`Terima kasih ${name}! Pesan Anda akan dikirim ke WhatsApp kami.`);
            
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 500);
            
            contactForm.reset();
        });
    }
    
    // ==================== VIDEO FALLBACK FOR MOBILE ====================
    const bgVideo = document.getElementById('bg-video');
    const videoFallback = document.querySelector('.video-fallback');
    
    if (bgVideo && videoFallback) {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            bgVideo.style.display = 'none';
            videoFallback.style.display = 'block';
        } else {
            bgVideo.play().catch(e => {
                console.log('Video autoplay prevented:', e);
                bgVideo.style.display = 'none';
                videoFallback.style.display = 'block';
            });
        }
    }
    
    // ==================== SERVICE CARD INTERACTIONS ====================
    const serviceCards = document.querySelectorAll('.service-card');
    const featureToggleBtns = document.querySelectorAll('.features-toggle-btn');
    const compareServicesBtn = document.getElementById('compareServicesBtn');
    const comparisonModal = document.getElementById('comparisonModal');
    const closeModal = document.querySelector('.close-modal');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });
    
    featureToggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const featuresContent = this.nextElementSibling;
            
            featureToggleBtns.forEach(b => {
                if (b !== btn) {
                    b.classList.remove('active');
                    if (b.nextElementSibling) {
                        b.nextElementSibling.classList.remove('show');
                    }
                }
            });
            
            this.classList.toggle('active');
            if (featuresContent) {
                featuresContent.classList.toggle('show');
            }
            
            const toggleText = this.querySelector('.toggle-text');
            if (toggleText) {
                if (this.classList.contains('active')) {
                    toggleText.textContent = 'Sembunyikan Fitur';
                } else {
                    toggleText.textContent = 'Lihat Fitur Lengkap';
                }
            }
        });
    });
    
    if (compareServicesBtn && comparisonModal && closeModal) {
        compareServicesBtn.addEventListener('click', function() {
            comparisonModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
        
        closeModal.addEventListener('click', function() {
            comparisonModal.style.display = 'none';
            document.body.style.overflow = '';
        });
        
        window.addEventListener('click', function(e) {
            if (e.target === comparisonModal) {
                comparisonModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
    
    // Service image click
    const serviceImages = document.querySelectorAll('.service-img');
    serviceImages.forEach(img => {
        img.addEventListener('click', function() {
            const btn = this.closest('.service-card')?.querySelector('.features-toggle-btn');
            if (btn) btn.click();
        });
    });
    
    // Service hover effects
    serviceCards.forEach(card => {
        const hoverContent = card.querySelector('.service-hover-content');
        
        card.addEventListener('mouseenter', () => {
            if (hoverContent) {
                hoverContent.style.opacity = '1';
                hoverContent.style.transform = 'translateY(0)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (hoverContent) {
                hoverContent.style.opacity = '0';
                hoverContent.style.transform = 'translateY(20px)';
            }
        });
    });
    
    // Fix for mobile viewport height
    function setViewportHeight() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    
    console.log('Semua script berjalan dengan baik!');
});