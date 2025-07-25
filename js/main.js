
    // Premium JavaScript Implementation
    
    // Loading Screen
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.getElementById('loader').classList.add('loaded');
      }, 500);
    });
    
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    });
    
    // Mobile Menu
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    let menuOpen = false;
    
    mobileMenuToggle.addEventListener('click', () => {
      menuOpen = !menuOpen;
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = menuOpen ? 'hidden' : '';
      
      // Animate hamburger
      const spans = mobileMenuToggle.querySelectorAll('span');
      if (menuOpen) {
        spans[0].style.transform = 'rotate(45deg) translateY(8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
    
    // Close mobile menu on link click
    document.querySelectorAll('.mobile-menu__link').forEach(link => {
      link.addEventListener('click', () => {
        menuOpen = false;
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
    
    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = 80;
          const targetPosition = target.offsetTop - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Intersection Observer for Animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.feature-card, .testimonial, .process__step, .pricing__card');
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)';
      observer.observe(el);
    });
    
    // Parallax Effect for Orbs
    let ticking = false;
    function updateParallax() {
      const scrolled = window.pageYOffset;
      const orbs = document.querySelectorAll('.orb');
      
      orbs.forEach((orb, index) => {
        const speed = 0.5 + (index * 0.2);
        const yPos = -(scrolled * speed);
        orb.style.transform = `translateY(${yPos}px)`;
      });
      
      ticking = false;
    }
    
    function requestTick() {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Dynamic Counter Animation
    function animateValue(element, start, end, duration) {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + (element.dataset.suffix || '');
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
    
    // Animate stats when they come into view
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statNumbers = entry.target.querySelectorAll('.stat__number[data-target]');
          statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            stat.dataset.suffix = '%';
            animateValue(stat, 0, target, 2000);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
      statsObserver.observe(statsSection);
    }
    
    // Add active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    
    window.addEventListener('scroll', () => {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 100) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
          link.classList.add('active');
        }
      });
    });
    
    // Performance Monitoring
    if ('PerformanceObserver' in window) {
      try {
        const perfObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            // Log performance metrics
            console.log(`Performance: ${entry.name} - ${entry.duration}ms`);
          }
        });
        perfObserver.observe({ entryTypes: ['measure', 'navigation'] });
      } catch (e) {
        // PerformanceObserver not fully supported
      }
    }
    
    // Lazy Loading for Iframe
    const chatbotFrame = document.querySelector('.chatbot-demo__frame');
    const frameObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Frame is already loaded via HTML
          frameObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    if (chatbotFrame) {
      frameObserver.observe(chatbotFrame);
    }
    
    // Analytics Event Tracking
    function trackEvent(category, action, label) {
      if (typeof gtag !== 'undefined') {
        gtag('event', action, {
          'event_category': category,
          'event_label': label
        });
      }
    }
    
    // Track CTA clicks
    document.querySelectorAll('.btn--primary').forEach(button => {
      button.addEventListener('click', () => {
        trackEvent('CTA', 'click', button.textContent.trim());
      });
    });
    
    // Keyboard Navigation Support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuOpen) {
        menuOpen = false;
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
    
    // Enhance focus visibility for accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-nav');
    });
    
    // Service Worker Registration for PWA capabilities
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
          // Service worker registration failed
        });
      });
    }
    
    // Console Easter Egg
    console.log('%c🚀 FrontendDialed - Enterprise AI Funnels', 
      'font-size: 20px; font-weight: bold; color: #3A86FF; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
    console.log('%cBuilt with precision by the #1 Tech Firm in America', 
      'font-size: 14px; color: #999; font-style: italic;');
    console.log('%cInterested in joining our team? Email careers@frontenddialed.com', 
      'font-size: 12px; color: #666;');
  
