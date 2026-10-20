/**
 * RONAK DEORA - Graphic Design Portfolio
 * Interactive Script: Navigation, Lightbox, Copy Clipboard, Form Handlers, Filter
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DYNAMIC YEAR
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. MOUSE SPOTLIGHT (Desktop)
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.opacity = '1';
      cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });
    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
    });
  }

  // 3. STICKY NAVBAR & SCROLL SPY
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Header background change
    if (scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll Spy active state
    let currentSectionId = '';
    sections.forEach((sec) => {
      const secTop = sec.offsetTop - 120;
      const secHeight = sec.offsetHeight;
      if (scrollY >= secTop && scrollY < secTop + secHeight) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 4. MOBILE DRAWER NAVIGATION
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      const isOpen = mobileDrawer.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 5. TOAST NOTIFICATION UTILITY
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-msg');
  let toastTimer = null;

  const showToast = (message) => {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  };

  // 6. COPY TO CLIPBOARD HANDLERS
  const copyButtons = [
    { btnId: 'hero-copy-phone', text: '+91 7427879676', label: 'Phone number' },
    { btnId: 'hero-copy-email', text: 'deoraronnak11@gmail.com', label: 'Email address' },
    { btnId: 'copy-phone-btn', text: '+91 7427879676', label: 'Phone number' },
    { btnId: 'copy-email-btn', text: 'deoraronnak11@gmail.com', label: 'Email address' }
  ];

  copyButtons.forEach((item) => {
    const btn = document.getElementById(item.btnId);
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(item.text).then(
          () => {
            showToast(`✓ ${item.label} copied to clipboard!`);
          },
          () => {
            // Fallback
            showToast(`${item.text}`);
          }
        );
      });
    }
  });

  // Generic data-clipboard buttons
  document.querySelectorAll('[data-clipboard]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-clipboard');
      const type = btn.getAttribute('data-type') || 'Content';
      navigator.clipboard.writeText(text).then(() => {
        showToast(`✓ ${type} copied to clipboard!`);
      });
    });
  });

  // 7. PORTFOLIO CATEGORY FILTERING
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.transition = 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // 8. LIGHTBOX MODAL FUNCTIONALITY
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCat = document.getElementById('lightbox-cat');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxDownloadBtn = document.getElementById('lightbox-download-btn');
  const lightboxWaBtn = document.getElementById('lightbox-wa-btn');

  const openLightbox = (src, title, category, description) => {
    if (!lightboxModal) return;
    lightboxImg.src = src;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    lightboxCat.textContent = category;
    lightboxDesc.textContent = description;

    if (lightboxDownloadBtn) {
      lightboxDownloadBtn.href = src;
      lightboxDownloadBtn.setAttribute('download', title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.jpg');
    }

    if (lightboxWaBtn) {
      const waText = encodeURIComponent(`Hi Ronak! I saw your project "${title}" on your portfolio and I would love to discuss a project.`);
      lightboxWaBtn.href = `https://wa.me/917427879676?text=${waText}`;
    }

    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.open-lightbox-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const src = btn.getAttribute('data-src');
      const title = btn.getAttribute('data-title');
      const category = btn.getAttribute('data-category');
      const desc = btn.getAttribute('data-desc');
      openLightbox(src, title, category, desc);
    });
  });

  // Also clicking on project media opens lightbox
  document.querySelectorAll('.project-media-wrap').forEach((wrap) => {
    wrap.addEventListener('click', () => {
      const btn = wrap.querySelector('.open-lightbox-btn');
      if (btn) btn.click();
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });

  // 9. RESUME TABS SWITCHER
  const resumeTabs = document.querySelectorAll('.resume-tab-btn');
  const resumeViews = {
    creative: document.getElementById('view-creative'),
    minimalist: document.getElementById('view-minimalist')
  };

  resumeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      resumeTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const resumeType = tab.getAttribute('data-resume');
      Object.keys(resumeViews).forEach((key) => {
        if (resumeViews[key]) {
          if (key === resumeType) {
            resumeViews[key].classList.add('active');
          } else {
            resumeViews[key].classList.remove('active');
          }
        }
      });
    });
  });

  // 10. CONTACT FORM HANDLING
  const contactForm = document.getElementById('contact-form');
  const feedbackEl = document.getElementById('form-feedback');
  const sendWaBtn = document.getElementById('send-wa-form-btn');

  const getFormData = () => {
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const phone = document.getElementById('form-phone').value.trim();
    const project = document.getElementById('form-project').value;
    const message = document.getElementById('form-message').value.trim();
    return { name, email, phone, project, message };
  };

  const validateForm = () => {
    const data = getFormData();
    if (!data.name) {
      showFeedback('Please enter your name.', 'error');
      document.getElementById('form-name').focus();
      return false;
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      showFeedback('Please enter a valid email address.', 'error');
      document.getElementById('form-email').focus();
      return false;
    }
    if (!data.project) {
      showFeedback('Please select a project type.', 'error');
      document.getElementById('form-project').focus();
      return false;
    }
    if (!data.message) {
      showFeedback('Please provide details in the message box.', 'error');
      document.getElementById('form-message').focus();
      return false;
    }
    return true;
  };

  const showFeedback = (msg, type) => {
    if (!feedbackEl) return;
    feedbackEl.className = `form-feedback ${type}`;
    feedbackEl.innerHTML = `<i class="fa-solid fa-${type === 'success' ? 'circle-check' : 'triangle-exclamation'}"></i> ${msg}`;
    feedbackEl.style.display = 'block';
  };

  if (contactForm) {
    // Submit via Mailto / Email
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      const data = getFormData();
      const subject = encodeURIComponent(`Design Inquiry from ${data.name}: ${data.project}`);
      const body = encodeURIComponent(
        `Hi Ronak,\n\n` +
        `Name: ${data.name}\n` +
        `Email: ${data.email}\n` +
        `Phone: ${data.phone || 'N/A'}\n` +
        `Project Type: ${data.project}\n\n` +
        `Message:\n${data.message}\n\n` +
        `Sent from Ronak Deora Graphic Design Portfolio`
      );

      showFeedback('Opening your email client to send message to deoraronnak11@gmail.com...', 'success');
      showToast('Opening email client...');

      setTimeout(() => {
        window.location.href = `mailto:deoraronnak11@gmail.com?subject=${subject}&body=${body}`;
      }, 500);
    });

    // Send via WhatsApp Button
    if (sendWaBtn) {
      sendWaBtn.addEventListener('click', () => {
        if (!validateForm()) return;

        const data = getFormData();
        const waText = encodeURIComponent(
          `*New Design Inquiry for Ronak Deora*\n\n` +
          `👤 *Name:* ${data.name}\n` +
          `📧 *Email:* ${data.email}\n` +
          `📞 *Phone:* ${data.phone || 'N/A'}\n` +
          `🎨 *Project:* ${data.project}\n\n` +
          `💬 *Message:*\n${data.message}`
        );

        showFeedback('Connecting to WhatsApp...', 'success');
        showToast('Redirecting to WhatsApp chat...');

        setTimeout(() => {
          window.open(`https://wa.me/917427879676?text=${waText}`, '_blank');
        }, 400);
      });
    }
  }

  // 11. SKILL METERS ANIMATION ON SCROLL
  const skillMeters = document.querySelectorAll('.meter-fill');
  if ('IntersectionObserver' in window) {
    const meterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const meter = entry.target;
            const targetWidth = meter.style.width;
            meter.style.width = '0%';
            setTimeout(() => {
              meter.style.width = targetWidth;
            }, 100);
            meterObserver.unobserve(meter);
          }
        });
      },
      { threshold: 0.3 }
    );

    skillMeters.forEach((meter) => meterObserver.observe(meter));
  }
});
