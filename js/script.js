document.addEventListener('DOMContentLoaded', function() {
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
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (navbar) {
            if (currentScroll <= 0) {
                // At top of page
                navbar.classList.remove('scrolled');
            } else if (currentScroll > lastScroll) {
                // Scrolling down
                navbar.classList.add('scrolled');
            } else {
                // Scrolling up
                navbar.classList.add('scrolled');
            }
            
            lastScroll = currentScroll <= 0 ? 0 : currentScroll;
        }
    }, { passive: true });
    
    // Initialize navbar state on page load
    window.dispatchEvent(new Event('scroll'));
    
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const isOpen = question.classList.contains('active');
                
                // Close all other FAQs
                faqQuestions.forEach(q => {
                    if (q !== question) {
                        q.classList.remove('active');
                        q.nextElementSibling.style.maxHeight = null;
                        q.nextElementSibling.classList.remove('show');
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
    
    // Form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = new FormData(contactForm);
            const formValues = Object.fromEntries(formData.entries());
            
            // Here you would typically send the form data to a server
            console.log('Form submitted:', formValues);
            
            // Show success message
            alert(`Terima kasih ${formValues.name || ''}! Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.`);
            
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