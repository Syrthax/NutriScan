// Auto-detect system theme preference
const detectTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Set theme
const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
};

// Initialize theme
let currentTheme = detectTheme();
setTheme(currentTheme);

// Theme toggle functionality
const initThemeToggle = () => {
    // Toggle from dock
    const dockThemeToggle = document.getElementById('theme-toggle-dock');
    if (dockThemeToggle) {
        dockThemeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggleTheme();
        });
    }
};

// Toggle theme function
const toggleTheme = () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(currentTheme);
};

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        currentTheme = e.matches ? 'dark' : 'light';
        setTheme(currentTheme);
    }
});

// Smooth scroll for anchor links
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// Dock navigation
const initDockNav = () => {
    const dockItems = document.querySelectorAll('.dock-item');
    
    dockItems.forEach(item => {
        const action = item.dataset.action;
        
        if (action && action !== 'theme-toggle') {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(`#${action}`);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        }
        
        // Tooltip on hover
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.2)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
};

// Scroll animations using Intersection Observer
const initScrollAnimations = () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add stretch effect on scroll
                entry.target.classList.add('stretch');
                setTimeout(() => {
                    entry.target.classList.remove('stretch');
                }, 300);
            }
        });
    }, observerOptions);

    // Observe all elements with scroll-element class
    document.querySelectorAll('.scroll-element').forEach(el => {
        observer.observe(el);
    });

    // Add scroll-element class to animated sections
    document.querySelectorAll('.feature-card, .step, .warning-card, .about-text, .about-image').forEach(el => {
        el.classList.add('scroll-element');
        observer.observe(el);
    });
};

// Parallax effect for blobs
const initParallax = () => {
    const blobs = document.querySelectorAll('.blob');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        blobs.forEach((blob, index) => {
            const speed = 0.5 + (index * 0.2);
            const yPos = -(scrolled * speed);
            blob.style.transform = `translateY(${yPos}px)`;
        });
    });
};

// Dock visibility on scroll
const initDockVisibility = () => {
    const dock = document.querySelector('.floating-dock');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 300) {
            dock.style.opacity = '1';
            dock.style.transform = 'translateX(-50%) translateY(0)';
        } else {
            dock.style.opacity = '0.9';
        }
        
        // Hide dock when scrolling down, show when scrolling up
        if (currentScroll > lastScroll && currentScroll > 500) {
            dock.style.transform = 'translateX(-50%) translateY(120%)';
        } else {
            dock.style.transform = 'translateX(-50%) translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
};

// Stats counter animation
const initStatsCounter = () => {
    const stats = document.querySelectorAll('.stat-number');
    
    const animateCount = (element, target) => {
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString() + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    };
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target.textContent.replace(/\D/g, '');
                // Only animate if there's a number to animate
                if (text && !isNaN(parseInt(text))) {
                    const target = parseInt(text);
                    animateCount(entry.target, target);
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => observer.observe(stat));
};

// Add floating animation to dock items
const initDockAnimations = () => {
    const dockItems = document.querySelectorAll('.dock-item');
    
    dockItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
};

// Gradient text animation enhancement
const initGradientAnimation = () => {
    const gradientTexts = document.querySelectorAll('.gradient-text');
    
    gradientTexts.forEach(text => {
        text.addEventListener('mouseenter', function() {
            this.style.animationDuration = '2s';
        });
        
        text.addEventListener('mouseleave', function() {
            this.style.animationDuration = '8s';
        });
    });
};

// Feature cards hover effect enhancement
const initFeatureCards = () => {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.03)';
            
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'rotate(5deg) scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'rotate(0deg) scale(1)';
            }
        });
    });
};

// Phone mockup interactive animation
const initPhoneMockup = () => {
    const phone = document.querySelector('.phone-mockup');
    
    if (phone) {
        phone.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) rotateY(5deg)';
        });
        
        phone.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotateY(0deg)';
        });
    }
};

// Button ripple effect
const initButtonEffects = () => {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
};

// Add ripple styles dynamically
const addRippleStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
};

// Dynamic blob movement based on mouse position
const initInteractiveBlobs = () => {
    const blobs = document.querySelectorAll('.blob');
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        blobs.forEach((blob, index) => {
            const speed = (index + 1) * 10;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            
            blob.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
};

// Navbar background on scroll
const initNavbarScroll = () => {
    const nav = document.querySelector('.glass-nav');
    
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
            } else {
                nav.style.boxShadow = 'none';
            }
        });
    }
};

// Initialize all functions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initSmoothScroll();
    initDockNav();
    initScrollAnimations();
    initParallax();
    initDockVisibility();
    initStatsCounter();
    initDockAnimations();
    initGradientAnimation();
    initFeatureCards();
    initPhoneMockup();
    initButtonEffects();
    addRippleStyles();
    initInteractiveBlobs();
    initNavbarScroll();
    
    console.log('🌿 NutriScan initialized with theme:', currentTheme);
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
