// Samaya Creative Hub — shared interactions

document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
    nav
      .querySelectorAll("a")
      .forEach((a) =>
        a.addEventListener("click", () => nav.classList.remove("open")),
      );
  }

  // Policy accordion (Contact page)
  document.querySelectorAll(".acc-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".acc-item");
      const panel = item.querySelector(".acc-panel");
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".acc-item.open").forEach((open) => {
        open.classList.remove("open");
        open.querySelector(".acc-panel").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  // Checkbox visual state (Book Me page)
  document
    .querySelectorAll('.check-item input[type="checkbox"]')
    .forEach((cb) => {
      const item = cb.closest(".check-item");
      cb.addEventListener("change", () =>
        item.classList.toggle("selected", cb.checked),
      );
    });

  // Booking form submission
  const form = document.getElementById("booking-form");
  if (form) {
    form.addEventListener("submit", (e) => {
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

      const BOOKING_EMAIL = "samayacreativehub@gmail.com"; 
      // const FORMSPREE_ID = 'YOUR_FORMSPREE_ID';

      const data = new FormData(form);
      const sessionType = data.get("session_type") || "Not specified";
      const addonServices = data.getAll("addon_service").join(", ") || "None";
      const room = data.get("room") || "Not specified";
      const duration = data.get("duration") || "Not specified";
      const estimatedCost = priceAmount
        ? priceAmount.textContent
        : "To be confirmed";

      const lines = [
        `Name: ${data.get("name")}`,
        `Email: ${data.get("email")}`,
        `Phone: ${data.get("phone")}`,
        `Room session: ${sessionType}`,
        `Additional services: ${addonServices}`,
        `Studio/Room: ${room}`,
        `Duration: ${duration}${duration === "Custom" ? " — " + (data.get("custom_duration") || "") : ""}`,
        `Estimated cost: ${estimatedCost}`,
        `Additional notes: ${data.get("notes") || "—"}`,
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
      const subject = encodeURIComponent(
        `Booking Request — ${data.get("name")}`,
      );
      const body = encodeURIComponent(lines.join("\n"));
      window.location.href = `mailto:${BOOKING_EMAIL}?subject=${subject}&body=${body}`;

      showConfirmation();
    });
  }

  function showConfirmation() {
    const confirmBox = document.getElementById("booking-confirm");
    if (confirmBox) {
      confirmBox.classList.add("show");
      confirmBox.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    form.reset();
    document
      .querySelectorAll(".check-item.selected")
      .forEach((i) => i.classList.remove("selected"));
  }
});

// Photo/Video price toggle (room cards)
document.querySelectorAll(".room-name").forEach((el) => {
  el.dataset.original = el.textContent;
});

document.querySelectorAll(".price-toggle").forEach((toggle) => {
  const buttons = toggle.querySelectorAll(".toggle-btn");
  const grid = toggle.parentElement.querySelector(".rooms-grid");
  if (!grid) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view;
      buttons.forEach((b) => {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-selected", b === btn);
      });

      grid.querySelectorAll(".room-card").forEach((card) => {
        const nameEl = card.querySelector(".room-name");
        const fromEl = card.querySelector(".from");

        if (view === "video") {
          if (card.hasAttribute("data-video-hide")) {
            card.classList.add("is-hidden");
            return;
          }
          card.classList.remove("is-hidden");
          fromEl.textContent = `From ₦${card.dataset.videoFrom}`;
          if (card.dataset.videoName)
            nameEl.textContent = card.dataset.videoName;
        } else {
          card.classList.remove("is-hidden");
          fromEl.textContent = `From ₦${card.dataset.photoFrom}`;
          nameEl.textContent = nameEl.dataset.original;
        }
      });
    });
  });
});

// Photo/Video toggle — services page room listings
document.querySelectorAll(".room-listing .room-name").forEach((el) => {
  el.dataset.original = el.textContent;
});

document.querySelectorAll(".price-toggle").forEach((toggle) => {
  const buttons = toggle.querySelectorAll(".toggle-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view;
      buttons.forEach((b) => {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-selected", b === btn);
      });

      document.querySelectorAll(".room-listing").forEach((room) => {
        const nameEl = room.querySelector(".room-name");
        const amounts = room.querySelectorAll(".price-row .amt");

        if (view === "video") {
          if (room.hasAttribute("data-video-hide")) {
            room.classList.add("is-hidden");
            return;
          }
          room.classList.remove("is-hidden");
          amounts[0].textContent = `₦${room.dataset.videoHour}`;
          amounts[1].textContent = `₦${room.dataset.videoHalf}`;
          if (room.dataset.videoName)
            nameEl.textContent = room.dataset.videoName;
          const bookBtn = room.querySelector(".book-room-btn");
          if (bookBtn)
            bookBtn.href = bookBtn.href.replace(
              /service=\w+/,
              "service=Videography",
            );
        } else {
          room.classList.remove("is-hidden");
          amounts[0].textContent = `₦${room.dataset.photoHour}`;
          amounts[1].textContent = `₦${room.dataset.photoHalf}`;
          nameEl.textContent = nameEl.dataset.original;
                      const bookBtnP = room.querySelector('.book-room-btn');
            if (bookBtnP) bookBtnP.href = bookBtnP.href.replace(/service=\w+/, 'service=Photography');
        }
      });
    });
  });
});

// Room image lightbox
const lightbox = document.getElementById("lightbox");
if (lightbox) {
  const lightboxImg = lightbox.querySelector(".lightbox-img");
  const closeBtn = lightbox.querySelector(".lightbox-close");

  document.querySelectorAll(".room-listing .photo img").forEach((img) => {
    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add("open");
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove("open");
    lightboxImg.src = "";
  };
  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}

// ---- Book.html: session type → room → duration → price ----
const sessionInputs = document.querySelectorAll('input[name="session_type"]');
const roomField = document.getElementById("room-field");
const durationField = document.getElementById("duration-field");
const durationOptionsEl = document.getElementById("duration-options");
const priceSummary = document.getElementById("price-summary");
const priceAmount = document.getElementById("price-amount");
const videoUnavailable = [
  "The Muse",
  "The Ember",
  "The Golden",
  "The Chronicle",
];

if (sessionInputs.length) {
  const getSession = () =>
    document.querySelector('input[name="session_type"]:checked')?.dataset
      .session || "none";

  const filterRoomsForSession = () => {
    const session = getSession();
    document.querySelectorAll("#room-options .check-item").forEach((item) => {
      const input = item.querySelector("input");
      const hide =
        session === "video" && videoUnavailable.includes(input.value);
      item.style.display = hide ? "none" : "";
      if (hide && input.checked) {
        input.checked = false;
      }

      // relabel Haven under video
      if (input.dataset.videoName) {
        item.lastChild.textContent =
          session === "video"
            ? ` ${input.dataset.videoName}`
            : ` ${input.value}`;
      }
    });
    roomField.style.display = session === "none" ? "none" : "";
    if (session === "none") {
      durationField.style.display = "none";
      priceSummary.style.display = "none";
      document
        .querySelectorAll('input[name="room"]')
        .forEach((r) => (r.checked = false));
    }
    renderDuration();
  };

  sessionInputs.forEach((cb) =>
    cb.addEventListener("change", filterRoomsForSession),
  );

  const renderDuration = () => {
    const session = getSession();
    const checkedRoom = document.querySelector('input[name="room"]:checked');
    if (session === "none" || !checkedRoom) {
      durationField.style.display = "none";
      priceSummary.style.display = "none";
      return;
    }
    durationField.style.display = "";

    if (checkedRoom.hasAttribute("data-no-price")) {
      durationOptionsEl.innerHTML = `
          <label class="radio-item"><input type="radio" name="duration" value="30 Minutes" checked> 30 Minutes</label>
          <label class="radio-item"><input type="radio" name="duration" value="1 Hour"> 1 Hour</label>
          <label class="radio-item"><input type="radio" name="duration" value="Custom"> Custom</label>`;
      priceSummary.style.display = "none";
      durationOptionsEl
        .querySelectorAll("input")
        .forEach((i) => i.addEventListener("change", updatePrice));
      return;
    }

    if (checkedRoom.dataset.flat) {
      durationOptionsEl.innerHTML = `<label class="radio-item"><input type="radio" name="duration" value="${checkedRoom.dataset.flatDuration}" checked> ${checkedRoom.dataset.flatDuration} — ₦${checkedRoom.dataset.flat}</label>`;
    } else {
      const hour =
        session === "video"
          ? checkedRoom.dataset.videoHour
          : checkedRoom.dataset.photoHour;
      const half =
        session === "video"
          ? checkedRoom.dataset.videoHalf
          : checkedRoom.dataset.photoHalf;
      durationOptionsEl.innerHTML = `
          <label class="radio-item"><input type="radio" name="duration" value="30 Minutes" data-price="${half}"> 30 Minutes — ₦${half}</label>
          <label class="radio-item"><input type="radio" name="duration" value="1 Hour" data-price="${hour}" checked> 1 Hour — ₦${hour}</label>`;
    }
    durationOptionsEl
      .querySelectorAll("input")
      .forEach((i) => i.addEventListener("change", updatePrice));
    updatePrice();
  };

  const updatePrice = () => {
    const checkedDuration = document.querySelector(
      'input[name="duration"]:checked',
    );
    if (!checkedDuration || !checkedDuration.dataset.price) {
      priceSummary.style.display = document
        .querySelector('input[name="room"]:checked')
        ?.hasAttribute("data-no-price")
        ? "none"
        : checkedDuration
          ? ""
          : "none";
      if (checkedDuration && !checkedDuration.dataset.price) {
        priceAmount.textContent = `₦${checkedDuration.value.match(/[\d,]+/)?.[0] || document.querySelector('input[name="room"]:checked').dataset.flat}`;
        priceSummary.style.display = "";
      }
      return;
    }
    priceAmount.textContent = `₦${checkedDuration.dataset.price}`;
    priceSummary.style.display = "";
  };

  document
    .querySelectorAll('input[name="room"]')
    .forEach((r) => r.addEventListener("change", renderDuration));

  // ---- Prefill from "Book This Room" links: book.html?room=the-aura&service=Photography ----
  const params = new URLSearchParams(window.location.search);
  const roomParam = params.get("room");
  const serviceParam = params.get("service");
  if (serviceParam) {
    const sessionRadio = document.querySelector(
      `input[name="session_type"][value="${serviceParam}"]`,
    );
    if (sessionRadio) sessionRadio.checked = true;
  }
  filterRoomsForSession();
  if (roomParam) {
    const roomRadio = document.querySelector(
      `#room-options .check-item[data-room-id="${roomParam}"] input`,
    );
    if (roomRadio) {
      roomRadio.checked = true;
      renderDuration();
    }
  }
}

  // Scroll-into-view reveal
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  }