/**
 * Dr. Mo — doctormo.us
 * Main JavaScript
 * Mobile nav, scroll effects, FAQ accordion, form handling
 */

(function () {
  'use strict';

  // ========== Mobile Navigation ==========
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('active');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen);

      // Prevent body scroll when nav is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close nav when clicking a link
    const navLinks = nav.querySelectorAll('.nav__link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close nav on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });
  }

  // ========== Header Scroll Effect ==========
  const header = document.getElementById('header');

  if (header) {
    var lastScrollY = 0;

    function handleScroll() {
      var currentScrollY = window.scrollY;

      if (currentScrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScrollY = currentScrollY;
    }

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run on load
  }

  // ========== Fade-In on Scroll (Intersection Observer) ==========
  var fadeElements = document.querySelectorAll('.fade-in');

  if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
    var fadeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    fadeElements.forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    // Fallback: show all elements immediately
    fadeElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ========== FAQ Accordion ==========
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');

    if (question) {
      question.addEventListener('click', function () {
        var isActive = item.classList.contains('active');

        // Close all other items
        faqItems.forEach(function (otherItem) {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            var otherBtn = otherItem.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        item.classList.toggle('active');
        question.setAttribute('aria-expanded', !isActive);
      });
    }
  });

  // ========== Contact Form Handling ==========
  var contactForm = document.getElementById('contact-form');
  var formSuccess = document.getElementById('form-success');
  var submitBtn = document.getElementById('submit-btn');

  // Check for successful submission (redirect back with query param)
  if (window.location.search.includes('submitted=true') && formSuccess && contactForm) {
    contactForm.style.display = 'none';
    formSuccess.style.display = 'block';

    // Clean the URL
    if (window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  // Form validation
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      var isValid = true;
      var firstInvalid = null;

      // Check required fields
      var requiredFields = contactForm.querySelectorAll('[required]');
      requiredFields.forEach(function (field) {
        removeError(field);

        if (!field.value.trim()) {
          isValid = false;
          showError(field, 'This field is required');
          if (!firstInvalid) firstInvalid = field;
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
          isValid = false;
          showError(field, 'Please enter a valid email address');
          if (!firstInvalid) firstInvalid = field;
        }
      });

      if (!isValid) {
        e.preventDefault();
        if (firstInvalid) firstInvalid.focus();
      } else if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
      }
    });

    // Clear errors on input
    var inputs = contactForm.querySelectorAll('.form-input, .form-textarea, .form-select');
    inputs.forEach(function (input) {
      input.addEventListener('input', function () {
        removeError(input);
      });
      input.addEventListener('change', function () {
        removeError(input);
      });
    });
  }

  function showError(field, message) {
    field.style.borderColor = '#e74c3c';

    var errorEl = document.createElement('span');
    errorEl.className = 'form-error';
    errorEl.textContent = message;
    errorEl.style.cssText =
      'color: #e74c3c; font-size: 0.8rem; margin-top: 0.3rem; display: block;';

    var parent = field.closest('.form-group');
    if (parent) {
      parent.appendChild(errorEl);
    }
  }

  function removeError(field) {
    field.style.borderColor = '';

    var parent = field.closest('.form-group');
    if (parent) {
      var error = parent.querySelector('.form-error');
      if (error) error.remove();
    }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ========== Smooth Scroll for Anchor Links ==========
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerOffset = 100;
        var elementPosition = target.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // ========== Active Nav Highlighting ==========
  // Highlight current page in nav
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  var navLinks = document.querySelectorAll('.nav__link');

  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;

    var linkPath = href.split('/').pop();

    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });
})();
