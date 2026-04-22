/* ============================================================
   PORTFOLIO — Interactive Scripts
   ============================================================ */

(function () {
  "use strict";

  // ----- Particle Background -----
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let mouse = { x: null, y: null };
  const PARTICLE_COUNT = 80;
  const CONNECT_DIST = 130;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 0.5;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      // Mouse repulsion
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          this.x += dx * 0.02;
          this.y += dy * 0.02;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(108, 99, 255, 0.5)";
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const opacity = 1 - dist / CONNECT_DIST;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108, 99, 255, ${opacity * 0.15})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  initParticles();
  animateParticles();

  window.addEventListener("resize", () => {
    resizeCanvas();
    initParticles();
  });

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // ----- Typing Effect -----
  const phrases = [
    "Hello, World!",
    "I build things for the web.",
    "I love solving problems.",
    "Let's create something great.",
  ];
  const typingEl = document.getElementById("typingText");
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typeLoop() {
    const current = phrases[phraseIdx];
    if (!isDeleting) {
      typingEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(typeLoop, 2000);
        return;
      }
      setTimeout(typeLoop, 70);
    } else {
      typingEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(typeLoop, 500);
        return;
      }
      setTimeout(typeLoop, 35);
    }
  }

  typeLoop();

  // ----- Navigation scroll effect -----
  const nav = document.getElementById("nav");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });

  // ----- Mobile menu toggle -----
  const navToggle = document.querySelector(".nav-toggle");
  const mobileMenu = document.getElementById("mobileMenu");

  navToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
  });

  document.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
    });
  });

  // ----- Scroll reveal animations -----
  const revealElements = document.querySelectorAll(
    ".section-title, .about-text, .stat-card, .skill-category, .project-card, .contact-card, .contact-intro"
  );

  revealElements.forEach((el) => el.classList.add("reveal"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ----- Animated stat counters -----
  const statCards = document.querySelectorAll(".stat-card");
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const target = parseInt(card.dataset.count, 10);
          const numEl = card.querySelector(".stat-number");
          let current = 0;
          const increment = Math.ceil(target / 40);
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            numEl.textContent = current + "+";
          }, 40);
          countObserver.unobserve(card);
        }
      });
    },
    { threshold: 0.5 }
  );

  statCards.forEach((card) => countObserver.observe(card));

  // ----- Skills orbit (desktop) -----
  const orbitContainer = document.getElementById("skillsOrbit");
  const orbitSkills = [
    "JavaScript",
    "TypeScript",
    "C++",
    "Python",
    "React",
    "Angular",
    "Java",
    "PHP",
    "C#",
    "ASP.NET",
    "AI/ML",
    "OpenGL",
  ];

  // Create orbit ring
  const ring = document.createElement("div");
  ring.classList.add("orbit-ring");
  ring.style.width = "280px";
  ring.style.height = "280px";
  orbitContainer.appendChild(ring);

  // Place skill nodes around center
  orbitSkills.forEach((skill, i) => {
    const angle = (i / orbitSkills.length) * Math.PI * 2 - Math.PI / 2;
    const radius = 140;
    const x = 160 + radius * Math.cos(angle);
    const y = 160 + radius * Math.sin(angle);

    const node = document.createElement("div");
    node.classList.add("orbit-node");
    node.textContent = skill;
    node.style.left = x + "px";
    node.style.top = y + "px";
    node.style.transform = "translate(-50%, -50%)";
    orbitContainer.appendChild(node);
  });

  // ----- Smooth scroll for anchor links -----
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();
