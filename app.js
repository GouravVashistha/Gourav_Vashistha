// Enhanced Portfolio JavaScript - Bug Fixes Applied

// Global Variables
let currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
let currentPage = 'home';
let isLoading = true;
let typingInterval;
let particlesAnimation;
let statsAnimated = false;
let skillsAnimated = false;

// DOM Elements
const elements = {
    loader: null,
    scrollProgress: null,
    header: null,
    navToggle: null,
    navMenu: null,
    navClose: null,
    navLinks: null,
    themeToggle: null,
    themeIcon: null,
    scrollToTop: null,
    typingText: null,
    pages: null,
    particlesCanvas: null,
    contactForm: null,
    projectModal: null
};

// Initialize DOM elements
function initializeElements() {
    elements.loader = document.getElementById('loader');
    elements.scrollProgress = document.getElementById('scrollProgress');
    elements.header = document.getElementById('header');
    elements.navToggle = document.getElementById('navToggle');
    elements.navMenu = document.getElementById('navMenu');
    elements.navClose = document.getElementById('navClose');
    elements.navLinks = document.querySelectorAll('.nav-link');
    elements.themeToggle = document.getElementById('themeToggle');
    elements.themeIcon = document.getElementById('themeIcon');
    elements.scrollToTop = document.getElementById('scrollToTop');
    elements.typingText = document.getElementById('typingText');
    elements.pages = document.querySelectorAll('.page');
    elements.particlesCanvas = document.getElementById('particlesCanvas');
    elements.contactForm = document.getElementById('contactForm');
    elements.projectModal = document.getElementById('projectModal');
}

// Loading Manager
class LoadingManager {
    constructor() {
        this.progress = 0;
        this.loadingBar = null;
        this.isComplete = false;
    }

    init() {
        this.loadingBar = document.querySelector('.loader-progress');
        this.simulateLoading();
        
        // Hide loader when everything is ready
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.complete();
            }, 1500);
        });

        // Fallback timeout
        setTimeout(() => {
            if (!this.isComplete) {
                this.complete();
            }
        }, 4000);
    }

    simulateLoading() {
        const intervals = [
            { time: 500, progress: 20 },
            { time: 1000, progress: 45 },
            { time: 1500, progress: 70 },
            { time: 2000, progress: 90 },
            { time: 2500, progress: 100 }
        ];

        intervals.forEach(({ time, progress }) => {
            setTimeout(() => {
                this.updateProgress(progress);
            }, time);
        });
    }

    updateProgress(progress) {
        this.progress = progress;
        if (this.loadingBar) {
            this.loadingBar.style.width = `${progress}%`;
        }
    }

    complete() {
        if (this.isComplete) return;
        this.isComplete = true;
        
        if (elements.loader) {
            elements.loader.classList.add('hidden');
            setTimeout(() => {
                elements.loader.style.display = 'none';
                isLoading = false;
                this.initializeApp();
            }, 800);
        }
    }

    initializeApp() {
        // Initialize all components
        navigationManager.init();
        themeManager.init();
        typingAnimationManager.init();
        scrollManager.init();
        statsAnimationManager.init();
        skillAnimationManager.init();
        particlesManager.init();
        contactFormManager.init();
        mobileNavigationManager.init();
        projectFilterManager.init();
        modalManager.init();
        
        console.log('Portfolio fully initialized');
    }
}

// Theme Manager - FIXED
class ThemeManager {
    constructor() {
        this.theme = currentTheme;
    }

    init() {
        console.log('Initializing Theme Manager...');
        this.setTheme(this.theme);
        this.bindEvents();
        console.log('Theme Manager initialized with theme:', this.theme);
    }

    setTheme(theme) {
        console.log('Setting theme to:', theme);
        document.documentElement.setAttribute('data-color-scheme', theme);
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.theme = theme;
        currentTheme = theme;
        
        if (elements.themeIcon) {
            elements.themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        if (particlesManager && particlesManager.particles) {
            particlesManager.updateParticleColors();
        }
        
        console.log('Theme applied:', theme);
    }

    toggle() {
        console.log('Toggling theme from:', this.theme);
        const newTheme = this.theme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        if (elements.themeToggle) {
            elements.themeToggle.style.transform = 'scale(0.8) rotate(180deg)';
            setTimeout(() => {
                elements.themeToggle.style.transform = 'scale(1) rotate(0deg)';
            }, 200);
        }
        
        this.showThemeMessage(newTheme);
    }

    showThemeMessage(theme) {
        const message = `Switched to ${theme} mode`;
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 100px;
            right: 2rem;
            background: var(--color-primary);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: var(--radius-lg);
            z-index: 10001;
            font-size: var(--font-size-sm);
            font-weight: 500;
            transform: translateX(300px);
            transition: transform 0.3s ease;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            messageEl.style.transform = 'translateX(300px)';
            setTimeout(() => {
                if (document.body.contains(messageEl)) {
                    document.body.removeChild(messageEl);
                }
            }, 300);
        }, 2000);
    }

    bindEvents() {
        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', (e) => {
                console.log('Theme toggle clicked');
                e.preventDefault();
                e.stopPropagation();
                this.toggle();
            });
            console.log('Theme toggle event listener bound');
        } else {
            console.warn('Theme toggle button not found');
        }
    }
}

// Navigation Manager - FIXED
class NavigationManager {
    constructor() {
        this.currentPage = 'home';
        this.isAnimating = false;
    }

    init() {
        console.log('Initializing Navigation Manager...');
        this.bindEvents();
        this.updateActiveNavLink('home');
        this.showPage('home', false);
        console.log('Navigation Manager initialized');
    }

    bindEvents() {
        // Navigation links - FIXED
        elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const targetPage = link.getAttribute('data-page');
                console.log('Navigation clicked:', targetPage);
                if (targetPage && targetPage !== this.currentPage && !this.isAnimating) {
                    this.showPage(targetPage, true);
                }
                mobileNavigationManager.close();
            });
        });

        // Hero buttons - FIXED
        const heroButtons = document.querySelectorAll('[data-page]');
        heroButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const targetPage = btn.getAttribute('data-page');
                console.log('Hero button clicked:', targetPage);
                if (targetPage && !this.isAnimating) {
                    this.showPage(targetPage, true);
                }
            });
        });

        // Footer links - FIXED
        const footerLinks = document.querySelectorAll('a[data-page]');
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = link.getAttribute('data-page');
                if (targetPage && !this.isAnimating) {
                    this.showPage(targetPage, true);
                }
            });
        });

        // Browser back/forward
        window.addEventListener('popstate', (e) => {
            const page = e.state?.page || 'home';
            this.showPage(page, false);
        });

        // Resume download buttons
        const resumeButtons = document.querySelectorAll('#downloadResume, #footerResume');
        resumeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.downloadResume();
            });
        });

        console.log('Navigation events bound');
    }

    showPage(targetPage, addToHistory = true) {
        console.log('Showing page:', targetPage);
        if (this.isAnimating) {
            console.log('Navigation blocked - animation in progress');
            return;
        }
        
        this.isAnimating = true;

        // Hide current page
        const currentPageEl = document.getElementById(this.currentPage);
        if (currentPageEl) {
            currentPageEl.style.opacity = '0';
            currentPageEl.style.transform = 'translateY(-20px)';
        }

        setTimeout(() => {
            // Hide all pages
            elements.pages.forEach(page => {
                page.classList.remove('active');
                page.style.display = 'none';
            });

            // Show target page
            const targetPageEl = document.getElementById(targetPage);
            if (targetPageEl) {
                targetPageEl.style.display = 'block';
                targetPageEl.classList.add('active');
                targetPageEl.style.opacity = '1';
                targetPageEl.style.transform = 'translateY(0)';
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                // Update navigation
                this.updateActiveNavLink(targetPage);
                this.currentPage = targetPage;
                currentPage = targetPage;
                
                // Add to history
                if (addToHistory) {
                    history.pushState({ page: targetPage }, '', `#${targetPage}`);
                }
                
                // Trigger page-specific animations
                setTimeout(() => {
                    this.triggerPageAnimations(targetPage);
                    this.isAnimating = false;
                }, 300);
                
                console.log('Page shown:', targetPage);
            } else {
                console.error('Target page not found:', targetPage);
                this.isAnimating = false;
            }
        }, 200);
    }

    updateActiveNavLink(activePage) {
        elements.navLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === activePage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    triggerPageAnimations(page) {
        console.log('Triggering animations for page:', page);
        switch (page) {
            case 'home':
                if (!statsAnimated) {
                    statsAnimationManager.animate();
                }
                break;
            case 'about':
                skillAnimationManager.animateSkillBars();
                this.animateElements('.about-content > *', 200);
                break;
            case 'experience':
                this.animateTimelineItems();
                break;
            case 'projects':
                this.animateProjectCards();
                projectFilterManager.init(); // Re-initialize project filter
                break;
            case 'contact':
                this.animateElements('.contact-card', 150);
                break;
        }
    }

    animateElements(selector, delay = 200) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                el.style.transition = 'all 0.6s ease';
            }, index * delay);
        });
    }

    animateTimelineItems() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate');
            }, index * 300);
        });
    }

    animateProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate');
            }, index * 200);
        });
    }

    downloadResume() {
        this.showMessage('Resume download will be available soon! Please contact me directly for the latest version.', 'info');
    }

    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `message message--${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 100px;
            right: 2rem;
            background: var(--color-${type === 'info' ? 'primary' : type});
            color: white;
            padding: 1rem 2rem;
            border-radius: var(--radius-lg);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.4s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            max-width: 350px;
        `;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            messageEl.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(messageEl)) {
                    document.body.removeChild(messageEl);
                }
            }, 400);
        }, 3000);
    }
}

// Mobile Navigation Manager
class MobileNavigationManager {
    constructor() {
        this.isOpen = false;
    }

    init() {
        console.log('Initializing Mobile Navigation...');
        this.bindEvents();
    }

    bindEvents() {
        if (elements.navToggle) {
            elements.navToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggle();
            });
        }
        
        if (elements.navClose) {
            elements.navClose.addEventListener('click', () => this.close());
        }

        document.addEventListener('click', (e) => {
            if (this.isOpen && elements.navMenu && !elements.navMenu.contains(e.target) && !elements.navToggle.contains(e.target)) {
                this.close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        if (elements.navMenu && elements.navToggle) {
            this.isOpen = true;
            elements.navMenu.classList.add('active');
            elements.navToggle.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    close() {
        if (elements.navMenu && elements.navToggle) {
            this.isOpen = false;
            elements.navMenu.classList.remove('active');
            elements.navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// Typing Animation Manager
class TypingAnimationManager {
    constructor() {
        this.texts = [
            'Full Stack Developer',
            'Backend Specialist',
            'Cloud Enthusiast',
            'Microservices Expert',
            'Java Developer'
        ];
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.typingSpeed = 100;
        this.deletingSpeed = 50;
        this.pauseTime = 2000;
        this.isActive = true;
    }

    init() {
        console.log('Initializing Typing Animation...');
        if (elements.typingText) {
            this.type();
            console.log('Typing animation started');
        }
    }

    type() {
        if (!this.isActive || !elements.typingText) return;

        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            elements.typingText.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            elements.typingText.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }

        let typeSpeed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            typeSpeed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }

    pause() {
        this.isActive = false;
    }

    resume() {
        this.isActive = true;
        this.type();
    }
}

// Stats Animation Manager
class StatsAnimationManager {
    constructor() {
        this.hasAnimated = false;
        this.observer = null;
    }

    init() {
        console.log('Initializing Stats Animation...');
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.animate();
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            this.observer.observe(statsSection);
        }
    }

    animate() {
        if (this.hasAnimated) return;
        
        console.log('Animating stats...');
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach((stat, index) => {
            const target = parseInt(stat.getAttribute('data-target'));
            stat.classList.add('counting');
            setTimeout(() => {
                this.countUp(stat, target, 2000, () => {
                    stat.classList.remove('counting');
                    stat.classList.add('completed');
                });
            }, index * 200);
        });
        
        this.hasAnimated = true;
        statsAnimated = true;
        
        if (this.observer) {
            this.observer.disconnect();
        }
    }

    countUp(element, target, duration, callback) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                const suffix = target === 3 || target === 5 ? '+' : '';
                element.textContent = target + suffix;
                clearInterval(timer);
                if (callback) callback();
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }
}

// Skill Animation Manager
class SkillAnimationManager {
    constructor() {
        this.hasAnimated = false;
        this.observer = null;
    }

    init() {
        console.log('Initializing Skill Animation...');
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.animateSkillBars();
                }
            });
        }, { threshold: 0.3 });

        const skillsSection = document.querySelector('.skills-section');
        if (skillsSection) {
            this.observer.observe(skillsSection);
        }
    }

    animateSkillBars() {
        if (this.hasAnimated) return;
        
        console.log('Animating skill bars...');
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.getAttribute('data-width');
                bar.style.width = `${width}%`;
            }, index * 200);
        });
        
        this.hasAnimated = true;
        skillsAnimated = true;
        
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// Scroll Manager
class ScrollManager {
    constructor() {
        this.lastScrollTop = 0;
        this.isScrolling = false;
    }

    init() {
        console.log('Initializing Scroll Manager...');
        this.bindEvents();
        this.updateScrollProgress();
        this.updateScrollToTop();
    }

    bindEvents() {
        window.addEventListener('scroll', this.throttle(() => {
            this.updateScrollProgress();
            this.updateScrollToTop();
            this.updateHeaderBackground();
        }, 16));

        if (elements.scrollToTop) {
            elements.scrollToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        
        if (elements.scrollProgress) {
            elements.scrollProgress.style.width = `${Math.min(progress, 100)}%`;
        }
    }

    updateScrollToTop() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (elements.scrollToTop) {
            if (scrollTop > 500) {
                elements.scrollToTop.classList.add('visible');
            } else {
                elements.scrollToTop.classList.remove('visible');
            }
        }
    }

    updateHeaderBackground() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (elements.header) {
            if (scrollTop > 50) {
                elements.header.style.background = currentTheme === 'dark' ? 
                    'rgba(38, 40, 40, 0.98)' : 'rgba(19, 52, 59, 0.98)';
                elements.header.style.backdropFilter = 'blur(20px)';
            } else {
                elements.header.style.background = currentTheme === 'dark' ? 
                    'rgba(38, 40, 40, 0.95)' : 'rgba(19, 52, 59, 0.95)';
                elements.header.style.backdropFilter = 'blur(20px)';
            }
        }
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// Project Filter Manager - FIXED
class ProjectFilterManager {
    constructor() {
        this.currentFilter = 'all';
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        console.log('Initializing Project Filter...');
        this.bindEvents();
        this.initialized = true;
    }

    bindEvents() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        console.log('Found filter buttons:', filterBtns.length);
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = btn.getAttribute('data-filter');
                console.log('Filter clicked:', filter);
                this.setFilter(filter);
                this.updateActiveFilter(btn);
            });
        });
    }

    setFilter(filter) {
        this.currentFilter = filter;
        const projectCards = document.querySelectorAll('.project-card');
        console.log('Filtering projects:', projectCards.length, 'Filter:', filter);
        
        projectCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.classList.add('animate');
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            } else {
                card.classList.remove('animate');
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    updateActiveFilter(activeBtn) {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }
}

// Contact Form Manager - FIXED
class ContactFormManager {
    constructor() {
        this.form = null;
        this.isSubmitting = false;
    }

    init() {
        console.log('Initializing Contact Form...');
        this.form = elements.contactForm;
        if (this.form) {
            this.bindEvents();
            this.setupValidation();
            console.log('Contact form initialized');
        } else {
            console.warn('Contact form not found');
        }
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Form submitted');
            this.handleSubmit();
        });

        const messageTextarea = this.form.querySelector('#message');
        if (messageTextarea) {
            messageTextarea.addEventListener('input', () => {
                this.updateCharacterCount();
            });
        }
    }

    setupValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearError(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'fullName':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Full name is required';
                } else if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long';
                }
                break;
            
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    isValid = false;
                    errorMessage = 'Email address is required';
                } else if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            
            case 'subject':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Please select a subject';
                }
                break;
            
            case 'message':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Message is required';
                } else if (value.length < 50) {
                    isValid = false;
                    errorMessage = 'Message must be at least 50 characters long';
                }
                break;
        }

        this.showFieldError(field, isValid ? '' : errorMessage);
        return isValid;
    }

    showFieldError(field, message) {
        const errorElement = document.getElementById(`${field.name}Error`);
        if (errorElement) {
            errorElement.textContent = message;
            if (message) {
                field.style.borderColor = 'var(--color-error)';
            } else {
                field.style.borderColor = '';
            }
        }
    }

    clearError(field) {
        this.showFieldError(field, '');
    }

    updateCharacterCount() {
        const messageField = this.form.querySelector('#message');
        const countElement = this.form.querySelector('.character-count');
        
        if (messageField && countElement) {
            const length = messageField.value.length;
            const minLength = 50;
            countElement.textContent = `${length}/${minLength} minimum characters`;
            
            if (length >= minLength) {
                countElement.style.color = 'var(--color-success)';
            } else {
                countElement.style.color = 'var(--color-text-secondary)';
            }
        }
    }

    async handleSubmit() {
        if (this.isSubmitting) return;

        // Validate all fields
        const inputs = this.form.querySelectorAll('input[required], textarea[required], select[required]');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showMessage('Please fix the errors above', 'error');
            return;
        }

        this.isSubmitting = true;
        this.setSubmitState(true);

        // Simulate form submission
        try {
            await this.simulateSubmission();
            this.showMessage('Thank you! Your message has been sent successfully. I will get back to you within 24 hours.', 'success');
            this.form.reset();
            this.updateCharacterCount();
        } catch (error) {
            this.showMessage('Sorry, there was an error sending your message. Please try again or contact me directly via email.', 'error');
        } finally {
            this.isSubmitting = false;
            this.setSubmitState(false);
        }
    }

    setSubmitState(isSubmitting) {
        const submitBtn = this.form.querySelector('.form-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        if (isSubmitting) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            if (btnText) btnText.classList.add('hidden');
            if (btnLoading) btnLoading.classList.remove('hidden');
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            if (btnText) btnText.classList.remove('hidden');
            if (btnLoading) btnLoading.classList.add('hidden');
        }
    }

    simulateSubmission() {
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }

    showMessage(message, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message--${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 100px;
            right: 2rem;
            background: var(--color-${type === 'success' ? 'success' : type === 'error' ? 'error' : 'primary'});
            color: white;
            padding: 1rem 2rem;
            border-radius: var(--radius-lg);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.4s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            max-width: 350px;
            line-height: 1.4;
        `;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            messageEl.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(messageEl)) {
                    document.body.removeChild(messageEl);
                }
            }, 400);
        }, 5000);
    }
}

// Modal Manager
class ModalManager {
    constructor() {
        this.modal = null;
        this.isOpen = false;
    }

    init() {
        console.log('Initializing Modal Manager...');
        this.modal = elements.projectModal;
        if (this.modal) {
            this.bindEvents();
        }
        
        // Bind project detail buttons
        window.openProjectModal = (projectId) => {
            console.log('Opening project modal:', projectId);
            this.openProject(projectId);
        };
    }

    bindEvents() {
        const closeBtn = this.modal.querySelector('.modal-close');
        const overlay = this.modal.querySelector('.modal-overlay');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        
        if (overlay) {
            overlay.addEventListener('click', () => this.close());
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    openProject(projectId) {
        const projectData = this.getProjectData(projectId);
        if (projectData) {
            this.populateModal(projectData);
            this.open();
        }
    }

    getProjectData(projectId) {
        const projects = {
            'bug-tracker': {
                title: 'E-Bug Tracker System',
                description: 'A comprehensive bug tracking system built with Spring Boot and PostgreSQL',
                details: 'This system revolutionized project management workflows by providing real-time bug tracking, automated notifications, and comprehensive analytics. Built using microservices architecture with high scalability and performance.',
                features: [
                    'Real-time bug reporting and tracking',
                    'Role-based access control system',
                    'Automated email notifications',
                    'Advanced analytics dashboard',
                    'Integration with development workflows',
                    'Multi-project support'
                ],
                technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'REST API', 'Maven', 'SonarQube', 'AWS EC2'],
                achievements: [
                    '25% faster bug resolution time',
                    '35% improvement in user satisfaction',
                    '60% reduction in manual tracking overhead'
                ]
            },
            'vote-system': {
                title: 'Vote Management System',
                description: 'Scalable voting platform with microservices architecture',
                details: 'A robust voting platform designed for secure and efficient elections with real-time results and comprehensive admin controls. Built with 7 independent microservices for maximum scalability.',
                features: [
                    '7 independent microservices',
                    'Real-time vote counting',
                    'Secure authentication',
                    'Admin dashboard',
                    'Multi-election support',
                    'Mobile-responsive interface'
                ],
                technologies: ['Java', 'Spring Boot', 'React.js', 'PostgreSQL', 'Gradle', 'Microservices'],
                achievements: [
                    '99.9% system uptime',
                    'Support for concurrent elections',
                    'Zero security breaches'
                ]
            },
            'ecommerce': {
                title: 'E-Commerce Platform - Shop Goals',
                description: 'Feature-rich e-commerce platform with payment integration',
                details: 'A complete e-commerce solution with secure payment processing, inventory management, and responsive design. Built as a final year project with focus on user experience and security.',
                features: [
                    'Secure payment integration',
                    'Real-time inventory tracking',
                    'User authentication',
                    'Order management',
                    'Shopping cart functionality',
                    'Product search and filtering'
                ],
                technologies: ['Python', 'Django', 'JavaScript', 'Bootstrap5', 'SQL', 'HTML5', 'CSS3'],
                achievements: [
                    '1,000+ products handled',
                    '200+ successful transactions',
                    'Sub-3 second page load times'
                ]
            }
        };
        
        return projects[projectId];
    }

    populateModal(projectData) {
        const titleEl = this.modal.querySelector('#modalTitle');
        const bodyEl = this.modal.querySelector('#modalBody');
        
        if (titleEl) {
            titleEl.textContent = projectData.title;
        }
        
        if (bodyEl) {
            bodyEl.innerHTML = `
                <div class="modal-project-content">
                    <p class="project-description">${projectData.description}</p>
                    <div class="project-details">
                        <h4>Project Overview</h4>
                        <p>${projectData.details}</p>
                    </div>
                    <div class="project-features">
                        <h4>Key Features</h4>
                        <ul>
                            ${projectData.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="project-tech">
                        <h4>Technologies Used</h4>
                        <div class="tech-stack">
                            ${projectData.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                    </div>
                    <div class="project-achievements">
                        <h4>Key Achievements</h4>
                        <ul>
                            ${projectData.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }
    }

    open() {
        if (this.modal) {
            this.isOpen = true;
            this.modal.classList.remove('hidden');
            this.modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    close() {
        if (this.modal) {
            this.isOpen = false;
            this.modal.classList.remove('show');
            setTimeout(() => {
                this.modal.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        }
    }
}

// Particles Manager
class ParticlesManager {
    constructor() {
        this.particles = [];
        this.animationId = null;
        this.ctx = null;
        this.canvas = null;
    }

    init() {
        if (window.innerWidth <= 768) return; // Skip on mobile for performance
        
        console.log('Initializing Particles...');
        this.canvas = elements.particlesCanvas;
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 15000));
        this.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                life: Math.random() * 100
            });
        }
    }

    updateParticleColors() {
        console.log('Updating particle colors for theme:', currentTheme);
    }

    animate() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const isDark = currentTheme === 'dark';
        const particleColor = isDark ? '255, 255, 255' : '51, 136, 153';
        
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life++;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Update opacity based on life
            particle.opacity = Math.sin(particle.life * 0.02) * 0.3 + 0.3;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${particleColor}, ${particle.opacity})`;
            this.ctx.fill();
            
            // Draw connections (limited for performance)
            this.particles.slice(index + 1, index + 4).forEach((otherParticle) => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = `rgba(${particleColor}, ${0.1 * (1 - distance / 100)})`;
                    this.ctx.stroke();
                }
            });
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// Initialize managers
const loadingManager = new LoadingManager();
const navigationManager = new NavigationManager();
const themeManager = new ThemeManager();
const typingAnimationManager = new TypingAnimationManager();
const scrollManager = new ScrollManager();
const statsAnimationManager = new StatsAnimationManager();
const skillAnimationManager = new SkillAnimationManager();
const particlesManager = new ParticlesManager();
const contactFormManager = new ContactFormManager();
const mobileNavigationManager = new MobileNavigationManager();
const projectFilterManager = new ProjectFilterManager();
const modalManager = new ModalManager();

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing portfolio...');
    initializeElements();
    loadingManager.init();
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (particlesManager.animationId) {
            cancelAnimationFrame(particlesManager.animationId);
        }
        if (typingAnimationManager) {
            typingAnimationManager.pause();
        }
    } else {
        if (particlesManager.particles.length > 0) {
            particlesManager.animate();
        }
        if (typingAnimationManager) {
            typingAnimationManager.resume();
        }
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768 && particlesManager.particles.length > 0) {
        if (particlesManager.animationId) {
            cancelAnimationFrame(particlesManager.animationId);
        }
        particlesManager.particles = [];
        if (particlesManager.ctx) {
            particlesManager.ctx.clearRect(0, 0, particlesManager.canvas.width, particlesManager.canvas.height);
        }
    } else if (window.innerWidth > 768 && particlesManager.particles.length === 0) {
        particlesManager.init();
    }
});

// Smooth scrolling for anchor links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]') && !e.target.hasAttribute('data-page')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // Navigate with arrow keys (Alt + Arrow)
    if (e.altKey) {
        const pages = ['home', 'about', 'experience', 'projects', 'contact'];
        const currentIndex = pages.indexOf(currentPage);
        
        if (e.key === 'ArrowRight' && currentIndex < pages.length - 1) {
            navigationManager.showPage(pages[currentIndex + 1], true);
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            navigationManager.showPage(pages[currentIndex - 1], true);
        }
    }
    
    // Theme toggle with 'T' key
    if (e.key === 't' || e.key === 'T') {
        if (!e.target.matches('input, textarea')) {
            e.preventDefault();
            themeManager.toggle();
        }
    }
});

// Performance optimizations
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        console.log('Portfolio initialized successfully');
        console.log('Theme Toggle Available:', !!elements.themeToggle);
        console.log('Current Theme:', currentTheme);
    });
}

// Export for potential external use
window.portfolioApp = {
    navigationManager,
    themeManager,
    loadingManager,
    scrollManager,
    toggleTheme: () => themeManager.toggle(),
    navigateTo: (page) => navigationManager.showPage(page, true)
};