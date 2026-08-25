// Samaya Creative Hub — shared interactions

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  // Policy accordion (Contact page)
  document.querySelectorAll('.acc-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.acc-item');
      const panel = item.querySelector('.acc-panel');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.acc-item.open').forEach(open => {
        open.classList.remove('open');
        open.querySelector('.acc-panel').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  // Checkbox visual state (Book Me page)
  document.querySelectorAll('.check-item input[type="checkbox"]').forEach(cb => {
    const item = cb.closest('.check-item');
    cb.addEventListener('change', () => item.classList.toggle('selected', cb.checked));
  });

  // Booking form submission
  const form = document.getElementById('booking-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // ------------------------------------------------------------------
      // EMAIL DELIVERY — no backend server, so this uses a form-to-email
      // service. Two options are wired below; enable whichever you use.
      //
      // OPTION A (recommended): Formspree
      //   1. Create a free form at https://formspree.io
      //   2. Replace YOUR_FORMSPREE_ID below with your form ID
      //   3. Uncomment the fetch() block and remove the mailto fallback
      //
      // OPTION B (current default): mailto fallback — opens the visitor's
      // email client pre-filled with their booking details, addressed to
      // Samaya's booking inbox. Replace the placeholder address below with
      // the real one.
      // ------------------------------------------------------------------

      const BOOKING_EMAIL = 'bookings@samayacreativehub.com'; // <-- replace with real email
      // const FORMSPREE_ID = 'YOUR_FORMSPREE_ID';

      const data = new FormData(form);
      const services = data.getAll('service').join(', ') || 'Not specified';
      const rooms = data.getAll('room').join(', ') || 'Not specified';
      const duration = data.get('duration') || 'Not specified';

      const lines = [
        `Name: ${data.get('name')}`,
        `Email: ${data.get('email')}`,
        `Phone: ${data.get('phone')}`,
        `Service(s): ${services}`,
        `Studio/Room preference: ${rooms}`,
        `Preferred date: ${data.get('date')}`,
        `Preferred time: ${data.get('time')}`,
        `Duration: ${duration}${duration === 'Custom' ? ' — ' + (data.get('custom_duration') || '') : ''}`,
        `Additional notes: ${data.get('notes') || '—'}`,
      ];

      /* OPTION A — Formspree (uncomment to use instead of mailto)
      fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data,
      }).then(res => {
        if (res.ok) showConfirmation();
      });
      return;
      */

      // OPTION B — mailto fallback (default)
      const subject = encodeURIComponent(`Booking Request — ${data.get('name')}`);
      const body = encodeURIComponent(lines.join('\n'));
      window.location.href = `mailto:${BOOKING_EMAIL}?subject=${subject}&body=${body}`;

      showConfirmation();
    });
  }

  function showConfirmation() {
    const confirmBox = document.getElementById('booking-confirm');
    if (confirmBox) {
      confirmBox.classList.add('show');
      confirmBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    form.reset();
    document.querySelectorAll('.check-item.selected').forEach(i => i.classList.remove('selected'));
  }
});

  // Photo/Video price toggle (room cards)
  document.querySelectorAll('.room-name').forEach(el => { el.dataset.original = el.textContent; });

  document.querySelectorAll('.price-toggle').forEach(toggle => {
    const buttons = toggle.querySelectorAll('.toggle-btn');
    const grid = toggle.parentElement.querySelector('.rooms-grid');
    if (!grid) return;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        buttons.forEach(b => { b.classList.toggle('active', b === btn); b.setAttribute('aria-selected', b === btn); });

        grid.querySelectorAll('.room-card').forEach(card => {
          const nameEl = card.querySelector('.room-name');
          const fromEl = card.querySelector('.from');

          if (view === 'video') {
            if (card.hasAttribute('data-video-hide')) {
              card.classList.add('is-hidden');
              return;
            }
            card.classList.remove('is-hidden');
            fromEl.textContent = `From ₦${card.dataset.videoFrom}`;
            if (card.dataset.videoName) nameEl.textContent = card.dataset.videoName;
          } else {
            card.classList.remove('is-hidden');
            fromEl.textContent = `From ₦${card.dataset.photoFrom}`;
            nameEl.textContent = nameEl.dataset.original;
          }
        });
      });
    });
  });


    // Photo/Video toggle — services page room listings
  document.querySelectorAll('.room-listing .room-name').forEach(el => { el.dataset.original = el.textContent; });

  document.querySelectorAll('.price-toggle').forEach(toggle => {
    const buttons = toggle.querySelectorAll('.toggle-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        buttons.forEach(b => { b.classList.toggle('active', b === btn); b.setAttribute('aria-selected', b === btn); });

        document.querySelectorAll('.room-listing').forEach(room => {
          const nameEl = room.querySelector('.room-name');
          const amounts = room.querySelectorAll('.price-row .amt');

                   if (view === 'video') {
            if (room.hasAttribute('data-video-hide')) { room.classList.add('is-hidden'); return; }
            room.classList.remove('is-hidden');
            amounts[0].textContent = `₦${room.dataset.videoHour}`;
            amounts[1].textContent = `₦${room.dataset.videoHalf}`;
            if (room.dataset.videoName) nameEl.textContent = room.dataset.videoName;
          } else {
            room.classList.remove('is-hidden');
            amounts[0].textContent = `₦${room.dataset.photoHour}`;
            amounts[1].textContent = `₦${room.dataset.photoHalf}`;
            nameEl.textContent = nameEl.dataset.original;
          }
        });
      });
    });
  });

  // Room image lightbox
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    document.querySelectorAll('.room-listing .photo img').forEach(img => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('open');
      });
    });

    const closeLightbox = () => { lightbox.classList.remove('open'); lightboxImg.src = ''; };
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
  }

  // Book.html — filter room checkboxes by selected service
  const serviceInputs = document.querySelectorAll('input[name="service"]');
  const roomInputs = document.querySelectorAll('input[name="room"]');
  if (serviceInputs.length && roomInputs.length) {
    const videoUnavailable = ['The Muse', 'The Ember', 'The Golden', 'The Chronicle'];
    const updateRoomAvailability = () => {
      const photoChecked = document.querySelector('input[name="service"][value="Photography"]')?.checked;
      const videoChecked = document.querySelector('input[name="service"][value="Videography"]')?.checked;
      const videoOnly = videoChecked && !photoChecked;

      roomInputs.forEach(cb => {
        const item = cb.closest('.check-item');
        if (videoOnly && videoUnavailable.includes(cb.value)) {
          item.style.display = 'none';
          if (cb.checked) { cb.checked = false; item.classList.remove('selected'); }
        } else {
          item.style.display = '';
        }
      });
    };
    serviceInputs.forEach(cb => cb.addEventListener('change', updateRoomAvailability));
    updateRoomAvailability();
  }