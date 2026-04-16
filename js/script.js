function ready(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

ready(function() {
    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Toggle body overflow when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // Navbar scroll effect with improved performance
    const initNavbar = () => {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        const currentScroll = Math.max(window.pageYOffset || 0, document.documentElement.scrollTop || 0);

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

    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const currentScroll = Math.max(window.pageYOffset || 0, document.documentElement.scrollTop || 0);

        if (!navbar) return;

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

        lastScroll = currentScroll;
    }, { passive: true });

    // Initialize navbar state on page load
    initNavbar();
    window.addEventListener('load', initNavbar);

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                
                // Close all other FAQs
                faqQuestions.forEach(q => {
                    if (q !== question) {
                        q.classList.remove('active');
                        if (q.nextElementSibling) {
                            q.nextElementSibling.style.maxHeight = null;
                            q.nextElementSibling.classList.remove('show');
                        }
                    }
                });
                
                // Toggle current FAQ
                question.classList.toggle('active');
                if (answer) {
                    answer.classList.toggle('show');
                    if (answer.classList.contains('show')) {
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    } else {
                        answer.style.maxHeight = null;
                    }
                }
            });
        });
    }
    
    // Counter Animation with Intersection Observer
    const counterAnimation = () => {
        const counters = document.querySelectorAll('.counter');
        const speed = 20; // Lower is faster
        const animationDuration = 2000; // Total duration in ms
        
        if (counters.length > 0) {
            const startCounters = () => {
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target') || 0;
                    const increment = target / (animationDuration / speed);
                    let current = 0;
                    
                    // Reset counter to 0
                    counter.textContent = '0';
                    counter.classList.add('animating');
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.textContent = Math.ceil(current);
                            setTimeout(updateCounter, speed);
                        } else {
                            counter.textContent = target;
                            counter.classList.remove('animating');
                        }
                    };
                    
                    updateCounter();
                });
            };
            
            // Only animate when in viewport
            const statsSection = document.querySelector('.stats');
            if (statsSection) {
                const observer = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting) {
                        startCounters();
                        observer.unobserve(statsSection);
                    }
                }, { threshold: 0.5 });
                
                observer.observe(statsSection);
            }
        }
    };
    
    // Initialize counter animation
    counterAnimation();
    
    // Scroll to Top Button
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
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Highlight active navigation link
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    function highlightNav() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}` || (current === 'home' && href === '#')) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightNav);
    highlightNav(); // Run once on load
    
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

    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            disable: function() {
                return window.innerWidth < 768;
            }
        });
    }

    // Footer visitor counter
    const visitorCounterApiUrl = window.VISITOR_API_URL || '/api/visitor-today';
    const visitorApiCredentials = window.VISITOR_API_CREDENTIALS || 'omit';

    const updateVisitorCounter = async () => {
        const counterElement = document.getElementById('visitorCounter');
        if (!counterElement) return;

        const renderCount = value => {
            counterElement.innerHTML = `<i class="fas fa-users"></i> Total Visitor: ${value}`;
        };

        const fetchVisitorCount = async () => {
            if (!visitorCounterApiUrl) return null;
            try {
                const response = await fetch(visitorCounterApiUrl, {
                    cache: 'no-cache',
                    credentials: visitorApiCredentials,
                });
                if (!response.ok) throw new Error('Gagal mengambil data');
                const data = await response.json();
                return typeof data.count === 'number' ? data.count : null;
            } catch (error) {
                console.warn('Visitor API tidak tersedia:', error);
                return null;
            }
        };

        const apiCount = await fetchVisitorCount();
        if (apiCount !== null) {
            renderCount(apiCount.toLocaleString('id-ID'));
            return;
        }

        const storageKey = 'apbVisitorCount';
        let count = 0;

        try {
            count = parseInt(localStorage.getItem(storageKey), 10) || 0;
            count += 1;
            localStorage.setItem(storageKey, count.toString());
            renderCount(count.toLocaleString('id-ID'));
        } catch (error) {
            console.warn('LocalStorage tidak tersedia:', error);
            counterElement.innerHTML = `<i class="fas fa-users"></i> Total Visitor: tidak tersedia`;
        }
    };

    updateVisitorCounter();
    
    // Newsletter/Mulai Layanan Form - Send to WhatsApp
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('newsletter-email').value || '';
            
            if (!email) {
                alert('Mohon isi email Anda terlebih dahulu');
                return;
            }
            
            // Build WhatsApp message
            const whatsappMessage = `Halo, saya ingin mulai layanan. Email saya: ${email}`;
            const encodedMessage = encodeURIComponent(whatsappMessage);
            
            // WhatsApp Business number
            const whatsappNumber = '6285814173761';
            
            // Build WhatsApp URL
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            console.log('Newsletter Form Submitted:', { email, whatsappUrl });
            
            // Show confirmation
            alert('Terima kasih! Anda akan diarahkan ke WhatsApp...');
            
            // Open WhatsApp
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 500);
            
            // Reset form
            newsletterForm.reset();
        });
    }

    // Form submission - Send to WhatsApp
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = new FormData(contactForm);
            const formValues = Object.fromEntries(formData.entries());
            
            const name = formValues.name || '';
            const email = formValues.email || '';
            const phone = formValues.phone || '';
            const service = formValues.service || '';
            const message = formValues.message || '';
            
            // Build WhatsApp message format
            const whatsappMessage = `
*Form Hubungi Kami - Agung Perkasa Borepile*

*Nama:* ${name}
*Email:* ${email}
*Nomor Telepon:* ${phone}
*Jenis Layanan:* ${service}
*Pesan:* ${message}
`.trim();
            
            // Encode message for URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            
            // WhatsApp Business number (your number)
            const whatsappNumber = '6285814173761';
            
            // Build WhatsApp URL
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            // Show success message
            alert(`Terima kasih ${name}! Pesan Anda akan dikirim ke WhatsApp kami. Silakan tunggu sebentar...`);
            
            // Open WhatsApp with pre-filled message after short delay
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 500);
            
            // Reset form
            contactForm.reset();
        });
    }

    // Video fallback for mobile
    const bgVideo = document.getElementById('bg-video');
    const videoFallback = document.querySelector('.video-fallback');
    
    if (bgVideo && videoFallback) {
        // Check if mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            // Hide video and show fallback image on mobile
            bgVideo.style.display = 'none';
            videoFallback.style.display = 'block';
        } else {
            // Ensure video plays on desktop
            bgVideo.play().catch(e => {
                console.log('Video autoplay prevented:', e);
                // Fallback to image if video fails to play
                bgVideo.style.display = 'none';
                videoFallback.style.display = 'block';
            });
        }
    }

    // Enhanced Service Section Interactions
    const serviceCards = document.querySelectorAll('.service-card');
    const featureToggleBtns = document.querySelectorAll('.features-toggle-btn');
    const compareServicesBtn = document.getElementById('compareServicesBtn');
    const comparisonModal = document.getElementById('comparisonModal');
    const closeModal = document.querySelector('.close-modal');
    
    // Service Card Hover Effect
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
        
        // For mobile touch devices
        card.addEventListener('touchstart', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('touchend', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });
    
    // Toggle Service Features
    featureToggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const featuresContent = this.nextElementSibling;
            const isOpen = this.classList.contains('active');
            
            // Close all other feature toggles
            featureToggleBtns.forEach(b => {
                if (b !== btn) {
                    b.classList.remove('active');
                    b.nextElementSibling.classList.remove('show');
                }
            });
            
            // Toggle current feature
            this.classList.toggle('active');
            featuresContent.classList.toggle('show');
            
            // Update button text
            const toggleText = this.querySelector('.toggle-text');
            if (this.classList.contains('active')) {
                toggleText.textContent = 'Sembunyikan Fitur';
            } else {
                toggleText.textContent = 'Lihat Fitur Lengkap';
            }
        });
    });
    
    // Service Comparison Modal
    if (compareServicesBtn && comparisonModal) {
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
    
    // Service Image Click Effect
    const serviceImages = document.querySelectorAll('.service-img');
    serviceImages.forEach(img => {
        img.addEventListener('click', function() {
            const btn = this.closest('.service-card').querySelector('.features-toggle-btn');
            btn.click();
        });
    });

    // Enhanced service card hover effects
    serviceCards.forEach(card => {
        const img = card.querySelector('.service-img');
        const hoverContent = card.querySelector('.service-hover-content');
        
        card.addEventListener('mouseenter', () => {
            hoverContent.style.opacity = '1';
            hoverContent.style.transform = 'translateY(0)';
        });
        
        card.addEventListener('mouseleave', () => {
            hoverContent.style.opacity = '0';
            hoverContent.style.transform = 'translateY(20px)';
        });
        
        // For mobile touch devices
        card.addEventListener('touchstart', () => {
            hoverContent.style.opacity = '1';
            hoverContent.style.transform = 'translateY(0)';
        });
        
        card.addEventListener('touchend', () => {
            hoverContent.style.opacity = '0';
            hoverContent.style.transform = 'translateY(20px)';
        });
    });
    
    // Fix for mobile viewport height
    function setViewportHeight() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
});