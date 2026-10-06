/**
 * SANFFO DENTAL CLINIC - Interactive Logic
 * Dr. Syed Fahad Ali Shah (BDS, RDS, MPhil, CHPE)
 * Khajoor Stop, Pabbi, Nowshera, Pakistan
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initSmoothScroll();
  initActiveNavLinkObserver();
  initBeforeAfterSliders();
  initServicesFilterAndModal();
  initGalleryFilterAndLightbox();
  initFaqAccordion();
  initBookingForm();
  initContactForm();
  initLegalModals();
});

/* ==========================================================================
   1. Sticky Header with Scroll Detection
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. Mobile Hamburger Navigation
   ========================================================================== */
function initMobileNav() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburgerBtn || !mobileNav) return;

  const toggleNav = () => {
    const isOpen = hamburgerBtn.classList.toggle('active');
    mobileNav.classList.toggle('open');
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburgerBtn.addEventListener('click', toggleNav);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburgerBtn.classList.remove('active');
      mobileNav.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ==========================================================================
   3. Smooth Scroll Navigation
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   4. Active Navigation Observer
   ========================================================================== */
function initActiveNavLinkObserver() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   5. Interactive Before & After Sliders
   ========================================================================== */
function initBeforeAfterSliders() {
  const baContainers = document.querySelectorAll('.ba-container');

  baContainers.forEach(container => {
    const afterWrapper = container.querySelector('.ba-after-wrapper');
    const handle = container.querySelector('.ba-handle');
    if (!afterWrapper || !handle) return;

    let isDown = false;

    const setPosition = (clientX) => {
      const rect = container.getBoundingClientRect();
      let x = clientX - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      const percentage = (x / rect.width) * 100;

      afterWrapper.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    };

    const startDrag = (e) => {
      isDown = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setPosition(clientX);
    };

    const stopDrag = () => {
      isDown = false;
    };

    const onDrag = (e) => {
      if (!isDown) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setPosition(clientX);
    };

    container.addEventListener('mousedown', startDrag);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('mousemove', onDrag);

    container.addEventListener('touchstart', startDrag, { passive: true });
    window.addEventListener('touchend', stopDrag);
    window.addEventListener('touchmove', onDrag, { passive: true });
  });
}

/* ==========================================================================
   6. Services Filter and Details Modal
   ========================================================================== */
const SERVICES_DATA = {
  'general-exam': {
    title: 'Dental Examination & Consultation',
    category: 'General Dentistry',
    description: 'A detailed diagnostic evaluation of teeth, gums, occlusion, and surrounding soft tissues. We utilize intraoral visual inspection and targeted radiography when indicated to detect early stages of decay, wear, or periodontal concerns.',
    details: [
      'Comprehensive examination of teeth and gum condition',
      'Early detection of cavities, plaque, and calculus buildup',
      'Assessment of bite alignment and jaw mobility',
      'Personalized preventive advice and customized treatment guidance'
    ]
  },
  'cleaning-polishing': {
    title: 'Professional Teeth Cleaning & Scaling',
    category: 'General Dentistry',
    description: 'Gentle ultrasonic scaling and specialized polishing designed to remove hardened calculus (tartar) and stubborn plaque deposits that normal brushing cannot reach, supporting fresh breath and gum health.',
    details: [
      'Ultrasonic plaque and calculus removal',
      'Stain removal and enamel polishing for a clean, smooth feel',
      'Preventive gum therapy reducing risk of gingivitis',
      'Personalized oral hygiene recommendations for home care'
    ]
  },
  'fillings': {
    title: 'Tooth-Colored Restorative Fillings',
    category: 'Restorative Dentistry',
    description: 'High-strength, aesthetic composite resin restorations designed to blend seamlessly with the natural shade of your teeth. Used to restore structural integrity, seal cavities, and repair chipped edges.',
    details: [
      'Natural aesthetic shading matched to your exact tooth color',
      'Minimally invasive preparation preserving healthy tooth structure',
      'Durable, biocompatible dental composite materials',
      'Restores normal chewing comfort and functional integrity'
    ]
  },
  'root-canal': {
    title: 'Root Canal Treatment (Endodontics)',
    category: 'Endodontics',
    description: 'A specialized treatment aimed at relieving acute toothache, resolving internal infection, and preserving the natural tooth that would otherwise require extraction.',
    details: [
      'Precise cleaning and disinfection of infected pulp canal spaces',
      'Biocompatible sealing (gutta-percha) to prevent re-infection',
      'Protection of the tooth with a restorative crown or core restoration',
      'A conservative approach focused on saving your natural tooth'
    ]
  },
  'crowns-bridges': {
    title: 'Dental Crowns & Fixed Bridges',
    category: 'Restorative Dentistry',
    description: 'Custom-crafted dental crowns and bridges designed to restore damaged, fractured, or missing teeth with high aesthetic fidelity and long-term chewing strength.',
    details: [
      'Full coverage crowns for cracked, worn, or root-canal treated teeth',
      'Fixed bridges to replace one or more consecutive missing teeth',
      'Natural-looking porcelain and zirconia ceramic options',
      'Restores balanced bite dynamics and smile appearance'
    ]
  },
  'cosmetic-whitening': {
    title: 'Teeth Whitening & Smile Enhancement',
    category: 'Cosmetic Dentistry',
    description: 'Clinically formulated cosmetic treatments designed to lighten external discoloration from tea, coffee, smoking, or age, creating a brighter and more confident smile.',
    details: [
      'Controlled clinical whitening procedures using safe formulations',
      'Customized assessment of enamel sensitivity and shade goals',
      'Cosmetic restorations, composite bonding, and porcelain veneers',
      'Comprehensive smile makeover consultations'
    ]
  },
  'oral-surgery': {
    title: 'Tooth Extractions & Minor Oral Surgery',
    category: 'Oral Surgery',
    description: 'Gentle tooth extractions performed with meticulous clinical care when a tooth is severely decayed, fractured beyond repair, or causing acute impaction concerns.',
    details: [
      'Routine and complex surgical tooth extractions',
      'Assessment of impacted third molars (wisdom teeth)',
      'Management of localized dental infection and abscesses',
      'Post-operative care instructions for smooth, comfortable healing'
    ]
  },
  'prosthodontics': {
    title: 'Complete & Partial Dentures',
    category: 'Prosthodontics',
    description: 'High-quality removable prosthetics engineered to replace multiple missing teeth or complete dental arches, restoring facial aesthetics, speech clarity, and chewing function.',
    details: [
      'Complete dentures for full arch tooth loss',
      'Flexible and acrylic partial dentures for selective missing teeth',
      'Custom bite registration for natural comfort and stability',
      'Careful follow-up and relining for optimal patient adaptation'
    ]
  },
  'pediatric': {
    title: 'Pediatric Dental Care',
    category: 'Pediatric Dentistry',
    description: 'A friendly, comforting approach to children’s oral health, focusing on building positive dental habits early, managing milk tooth decay, and applying preventive coatings.',
    details: [
      'Gentle checkups designed to make young patients feel at ease',
      'Fluoride applications and preventive pit-and-fissure sealants',
      'Management of early childhood cavities and tooth preservation',
      'Oral hygiene education for parents and children'
    ]
  },
  'emergency': {
    title: 'Emergency Dental Care & Urgent Assessment',
    category: 'Emergency Dentistry',
    description: 'Prompt evaluation and urgent relief for acute dental trauma, severe toothache, sudden facial swelling, or chipped and knocked-out teeth.',
    details: [
      'Urgent assessment of acute tooth pain and swelling',
      'Temporary and definitive treatment for fractured teeth',
      'Prescription and clinical intervention for dental infections',
      'Rapid guidance via phone and WhatsApp during clinic hours'
    ]
  }
};

function initServicesFilterAndModal() {
  // Filtering
  const filterTabs = document.querySelectorAll('.services-filter-tabs .filter-tab');
  const serviceCards = document.querySelectorAll('.service-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      serviceCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Service Details Modal
  const serviceModal = document.getElementById('serviceModal');
  const modalTitle = document.getElementById('modalServiceTitle');
  const modalCategory = document.getElementById('modalServiceCategory');
  const modalDesc = document.getElementById('modalServiceDesc');
  const modalList = document.getElementById('modalServiceList');
  const modalBookBtn = document.getElementById('modalServiceBookBtn');

  if (!serviceModal) return;

  const openServiceModal = (key) => {
    const data = SERVICES_DATA[key];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalCategory.textContent = data.category;
    modalDesc.textContent = data.description;
    
    modalList.innerHTML = '';
    data.details.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      modalList.appendChild(li);
    });

    if (modalBookBtn) {
      modalBookBtn.onclick = () => {
        closeServiceModal();
        const select = document.getElementById('preferredTreatment');
        if (select) {
          // Attempt to match treatment dropdown
          for (let option of select.options) {
            if (option.text.toLowerCase().includes(data.category.toLowerCase().split(' ')[0]) ||
                option.text.toLowerCase().includes(data.title.toLowerCase().split(' ')[0])) {
              select.value = option.value;
              break;
            }
          }
        }
        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth' });
        }
      };
    }

    serviceModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeServiceModal = () => {
    serviceModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.service-learn-more').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceKey = btn.getAttribute('data-service');
      openServiceModal(serviceKey);
    });
  });

  serviceModal.querySelectorAll('.modal-close-trigger').forEach(el => {
    el.addEventListener('click', closeServiceModal);
  });
}

/* ==========================================================================
   7. Clinic Gallery Filter and Lightbox
   ========================================================================== */
function initGalleryFilterAndLightbox() {
  const galleryTabs = document.querySelectorAll('.gallery-filter-tabs .filter-tab');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  if (!galleryItems.length) return;

  // Gallery Filtering
  galleryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      galleryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.getAttribute('data-gallery-filter');

      galleryItems.forEach(item => {
        if (filterVal === 'all' || item.getAttribute('data-category') === filterVal) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  if (!lightbox) return;

  let visibleItems = Array.from(galleryItems);
  let currentIndex = 0;

  const updateVisibleItems = () => {
    visibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
  };

  const showLightboxImage = (index) => {
    updateVisibleItems();
    if (!visibleItems.length) return;

    if (index < 0) index = visibleItems.length - 1;
    if (index >= visibleItems.length) index = 0;

    currentIndex = index;
    const item = visibleItems[currentIndex];
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-item-title')?.textContent || '';
    const tag = item.querySelector('.gallery-item-tag')?.textContent || '';

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = `${title} • ${tag}`;
  };

  const openLightbox = (item) => {
    updateVisibleItems();
    currentIndex = visibleItems.indexOf(item);
    showLightboxImage(currentIndex);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => showLightboxImage(currentIndex - 1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => showLightboxImage(currentIndex + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightboxImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showLightboxImage(currentIndex + 1);
  });
}

/* ==========================================================================
   8. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const body = item.querySelector('.accordion-body');

    if (!trigger || !body) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items for clean accordion UX
      accordionItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherTrigger = otherItem.querySelector('.accordion-trigger');
          const otherBody = otherItem.querySelector('.accordion-body');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherBody) otherBody.style.maxHeight = null;
        }
      });

      if (isActive) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        body.style.maxHeight = null;
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   9. Appointment Booking Form with WhatsApp Integration
   ========================================================================== */
function initBookingForm() {
  const form = document.getElementById('appointmentForm');
  const successBox = document.getElementById('bookingSuccessBox');
  const directWhatsappBtn = document.getElementById('bookViaWhatsAppBtn');

  if (!form) return;

  // Set min date to today
  const dateInput = document.getElementById('preferredDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Handle direct WhatsApp prefilled book button
  if (directWhatsappBtn) {
    directWhatsappBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const fullName = document.getElementById('fullName')?.value.trim() || '';
      const phone = document.getElementById('phoneNumber')?.value.trim() || '';
      const date = document.getElementById('preferredDate')?.value || '';
      const time = document.getElementById('preferredTime')?.value || '';
      const treatment = document.getElementById('preferredTreatment')?.value || '';
      const concern = document.getElementById('dentalConcern')?.value.trim() || '';

      let text = `Hello SANFFO DENTAL CLINIC, I would like to book a dental appointment.`;
      if (fullName) text += `\nName: ${fullName}`;
      if (phone) text += `\nPhone: ${phone}`;
      if (treatment) text += `\nTreatment: ${treatment}`;
      if (date) text += `\nPreferred Date: ${date}`;
      if (time) text += `\nPreferred Time: ${time}`;
      if (concern) text += `\nConcern: ${concern}`;

      const waUrl = `https://wa.me/923379785246?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName')?.value.trim();
    const phoneNumber = document.getElementById('phoneNumber')?.value.trim();
    const preferredDate = document.getElementById('preferredDate')?.value;
    const dentalConcern = document.getElementById('dentalConcern')?.value.trim();

    if (!fullName || !phoneNumber || !preferredDate || !dentalConcern) {
      alert('Please fill in all mandatory fields marked with an asterisk (*).');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Submitting Request...';
    }

    setTimeout(() => {
      form.style.display = 'none';
      if (successBox) {
        successBox.style.display = 'block';
      }
    }, 600);
  });
}

/* ==========================================================================
   10. Contact Form Logic
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccessBox');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName')?.value.trim();
    const phone = document.getElementById('contactPhone')?.value.trim();
    const message = document.getElementById('contactMessage')?.value.trim();

    if (!name || !phone || !message) {
      alert('Please provide your name, phone number, and message.');
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Message...';
    }

    setTimeout(() => {
      contactForm.style.display = 'none';
      if (contactSuccess) {
        contactSuccess.style.display = 'block';
      }
    }, 500);
  });
}

/* ==========================================================================
   11. Legal Modals (Privacy Policy & Terms)
   ========================================================================== */
function initLegalModals() {
  const privacyModal = document.getElementById('privacyModal');
  const termsModal = document.getElementById('termsModal');

  const openModal = (modal) => {
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.open-privacy-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(privacyModal);
    });
  });

  document.querySelectorAll('.open-terms-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(termsModal);
    });
  });

  [privacyModal, termsModal].forEach(modal => {
    if (!modal) return;
    modal.querySelectorAll('.modal-close-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => closeModal(modal));
    });
  });
}
