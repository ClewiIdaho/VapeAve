/* ==========================================================================
   VAPE AVE — interactions
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Age gate ---------- */
  const ageGate = document.getElementById("ageGate");
  if (ageGate) {
    const verified = sessionStorage.getItem("vapeave-age-verified");
    if (verified === "yes") {
      ageGate.classList.add("is-hidden");
    } else {
      document.body.style.overflow = "hidden";
    }

    document.getElementById("ageYes").addEventListener("click", () => {
      sessionStorage.setItem("vapeave-age-verified", "yes");
      ageGate.classList.add("is-hidden");
      document.body.style.overflow = "";
    });

    document.getElementById("ageNo").addEventListener("click", () => {
      window.location.href = "https://www.google.com";
    });
  }

  /* ---------- Sticky nav shadow ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById("navBurger");
  const links = document.getElementById("navLinks");
  if (burger && links) {
    burger.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 70}ms`;
      io.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Animated counters (about stats) ---------- */
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && !("IntersectionObserver" in window)) {
    counters.forEach((el) => (el.textContent = el.dataset.count));
  }
  if (counters.length && "IntersectionObserver" in window) {
    const countIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseFloat(el.dataset.count);
          const isFloat = String(el.dataset.count).includes(".");
          const dur = 1400;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = target * eased;
            el.textContent = isFloat ? val.toFixed(1) : Math.round(val).toString();
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          countIO.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => countIO.observe(el));
  }

  /* ---------- Open / closed badge (8 AM – midnight, America/Boise) ---------- */
  const openBadge = document.getElementById("openBadge");
  if (openBadge) {
    let hour;
    try {
      hour = parseInt(
        new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          hour12: false,
          timeZone: "America/Boise",
        }).format(new Date()),
        10
      );
    } catch (e) {
      hour = new Date().getHours();
    }
    const isOpen = hour >= 8; // open 8 AM through 11:59 PM
    openBadge.textContent = isOpen ? "● Open now — til midnight" : "● Opens at 8 AM";
    openBadge.classList.toggle("is-closed", !isOpen);
  }

  /* ---------- Random neon jolt (real signs stutter unpredictably) ---------- */
  const heroSign = document.querySelector(".hero__sign");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (heroSign && !reduceMotion) {
    const jolt = () => {
      heroSign.classList.add("is-jolting");
      setTimeout(() => heroSign.classList.remove("is-jolting"), 230);
      setTimeout(jolt, 3800 + Math.random() * 7000);
    };
    setTimeout(jolt, 3200);
  }

  /* ---------- Mock rewards signup (demo only — nothing is sent) ---------- */
  const joinForm = document.getElementById("joinForm");
  if (joinForm) {
    joinForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const success = document.getElementById("joinSuccess");
      const ageBox = document.getElementById("joinAge");
      if (!ageBox.checked) {
        ageBox.focus();
        success.hidden = false;
        success.textContent = "◆ Please confirm you are 21+ to continue (demo).";
        return;
      }
      success.hidden = false;
      success.textContent =
        "◆ Demo complete — no data was sent or stored. On the live site, this customer would now be earning points.";
      joinForm.reset();
    });
  }
})();
