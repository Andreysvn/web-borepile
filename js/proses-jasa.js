function ready(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

ready(function() {
    window.prosesJasaReady = true;
    // Initialize AOS (Animate on Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }

    // Mobile Menu Toggle (for navbar)
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

    // Toggle Technical Details Button
    const detailsButtons = document.querySelectorAll('.toggle-details-btn');
    
    detailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const technicalDetails = this.nextElementSibling;
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close other details
            detailsButtons.forEach(btn => {
                if (btn !== this && btn.getAttribute('aria-expanded') === 'true') {
                    btn.setAttribute('aria-expanded', 'false');
                    if (btn.nextElementSibling) {
                        btn.nextElementSibling.style.display = 'none';
                    }
                }
            });
            
            // Toggle current details
            if (isExpanded) {
                this.setAttribute('aria-expanded', 'false');
                technicalDetails.style.display = 'none';
            } else {
                this.setAttribute('aria-expanded', 'true');
                technicalDetails.style.display = 'block';
            }
        });
    });

    // Timeline Labels Click Functionality
    const timelineLabels = document.querySelectorAll('.timeline-label');
    
    if (timelineLabels.length > 0) {
        timelineLabels.forEach((label, index) => {
            label.addEventListener('click', function() {
                // Remove active from all labels
                timelineLabels.forEach(l => l.classList.remove('active'));
                // Add active to clicked label
                this.classList.add('active');
                
                // Update progress bar
                const progressWidth = ((index + 1) / timelineLabels.length) * 100;
                const progressBar = document.querySelector('.timeline-progress');
                if (progressBar) {
                    progressBar.style.width = progressWidth + '%';
                }
                
                // Scroll to corresponding step
                const correspondingStep = document.querySelector(`[data-step="${index + 1}"]`);
                if (correspondingStep) {
                    correspondingStep.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // Navbar Scroll Effect
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (navbar) {
            if (currentScroll <= 0) {
                navbar.classList.remove('scrolled');
            } else {
                navbar.classList.add('scrolled');
            }
            
            lastScroll = currentScroll <= 0 ? 0 : currentScroll;
        }
        
        // Highlight active process step on scroll
        highlightActiveStep();
    }, { passive: true });

    // Function to highlight active step based on viewport
    function highlightActiveStep() {
        const steps = document.querySelectorAll('.proses-step');
        const windowCenter = window.innerHeight / 2;
        
        steps.forEach(step => {
            const rect = step.getBoundingClientRect();
            const stepNumber = step.getAttribute('data-step');
            
            if (rect.top < windowCenter && rect.bottom > windowCenter) {
                // Update timeline label
                const label = document.querySelector(`.timeline-label:nth-child(${stepNumber})`);
                if (label) {
                    const allLabels = document.querySelectorAll('.timeline-label');
                    allLabels.forEach(l => l.classList.remove('active'));
                    label.classList.add('active');
                    
                    // Update progress bar
                    const progressWidth = (stepNumber / steps.length) * 100;
                    const progressBar = document.querySelector('.timeline-progress');
                    if (progressBar) {
                        progressBar.style.width = progressWidth + '%';
                    }
                }
            }
        });
    }

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Image Lazy Loading Enhancement
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.complete && img.naturalWidth > 0) {
                        img.style.opacity = '1';
                    } else {
                        img.style.opacity = '0';
                        img.onload = function() {
                            setTimeout(() => {
                                img.style.opacity = '1';
                            }, 100);
                        };
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    // Add smooth fade-in animation to images
    const style = document.createElement('style');
    style.textContent = `
        img[loading="lazy"] {
            transition: opacity 0.3s ease;
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // Scroll to top on page load if URL has hash
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }

    // Track page interactions for analytics
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        // Track button clicks
        if (target.classList.contains('btn-primary') || target.classList.contains('btn-secondary')) {
            const buttonText = target.textContent.trim();
            if (typeof gtag !== 'undefined') {
                gtag('event', 'button_click', {
                    'event_category': 'engagement',
                    'event_label': buttonText
                });
            }
        }
        
        // Track FAQ interactions
        if (target.classList.contains('faq-question')) {
            const questionText = target.querySelector('span').textContent.trim();
            if (typeof gtag !== 'undefined') {
                gtag('event', 'faq_click', {
                    'event_category': 'faq',
                    'event_label': questionText
                });
            }
        }
        
        // Track details toggle
        if (target.classList.contains('toggle-details-btn')) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'details_toggle', {
                    'event_category': 'engagement',
                    'event_label': 'Technical Details'
                });
            }
        }
    });

    // Initialize page view event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            'page_path': '/proses-jasa.html',
            'page_title': 'Proses Jasa Borepile'
        });
    }

    // Initialize tooltip-like functionality for technical specs
    const techSpecItems = document.querySelectorAll('.tech-spec-item');
    techSpecItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, var(--secondary-color) 0%, var(--accent-color) 100%)';
            this.querySelector('h5').style.color = 'var(--white)';
            this.querySelector('p').style.color = 'rgba(255, 255, 255, 0.9)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.background = '';
            this.querySelector('h5').style.color = '';
            this.querySelector('p').style.color = '';
        });
    });

    // Add intersection observer for counter-like animation (for future timeline stats)
    const prosesSummary = document.querySelector('.proses-summary');
    if (prosesSummary && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(prosesSummary);
    }

    // Dynamic bg pattern animation
    const bgPattern = document.querySelector('.header-bg-pattern');
    if (bgPattern) {
        window.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX / window.innerWidth) * 20;
            const moveY = (e.clientY / window.innerHeight) * 20;
            bgPattern.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    }

    // Accessibility: Add keyboard navigation
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Check if all content is loaded
    window.addEventListener('load', function() {
        // Initialize AOS again after all images load
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    });
});

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll events with debounce
window.addEventListener('scroll', debounce(function() {
    // Scroll-related logic here
}, 50), { passive: true });
