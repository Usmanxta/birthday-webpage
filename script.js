// =======================
// PAGE 1 — FULL LOGIC
// =======================

// ELEMENTS
const radios = document.querySelectorAll('input[name="headphones"]');
const responseText = document.getElementById('responseText');
const startBtn = document.getElementById('startBtn');

const cakeContainer = document.querySelector(".cake-container");
const flame = document.getElementById("flame");
const blowBtn = document.getElementById("blowBtn");
const afterCake = document.querySelector(".after-cake");
const goStory = document.getElementById("goStory");
const birthdayAudio = document.getElementById("birthdayAudio");

let analyser, dataArray;

// -----------------------
// HEADPHONE CHECK LOGIC
// -----------------------
if (radios.length && startBtn && responseText) {
  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'no') {
        responseText.textContent =
          "plz put on your headphones babe 😐 this part hits harder with music";
        startBtn.disabled = true;
      }

      if (radio.value === 'yes') {
        responseText.textContent =
          "good girl 😌 now click start";
        startBtn.disabled = false;
      }
    });
  });
}

// -----------------------
// START BUTTON → CAKE + MUSIC
// -----------------------
if (startBtn) {
  startBtn.addEventListener("click", async () => {
    // show cake
    cakeContainer.classList.remove("hidden");

    // play music (user gesture → Safari safe)
    if (birthdayAudio) {
      birthdayAudio.play();
    }

    // try mic access
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      const mic = audioContext.createMediaStreamSource(stream);
      mic.connect(analyser);
      analyser.fftSize = 256;
      dataArray = new Uint8Array(analyser.frequencyBinCount);

      detectBlow();
    } catch (err) {
      // mic failed → tap button still works
      console.log("mic not allowed, tap will work");
    }
  });
}

// -----------------------
// BLOW DETECTION
// -----------------------
function detectBlow() {
  if (!analyser) return;

  analyser.getByteFrequencyData(dataArray);
  const volume =
    dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

  if (volume > 90) {
    candleOff();
    return;
  }

  requestAnimationFrame(detectBlow);
}

// -----------------------
// CANDLE OFF (USED BY MIC + TAP)
// -----------------------
const sparklesBox = document.getElementById("sparkles");
const confettiContainer = document.getElementById("confettiContainer");
const birthdayMessage = document.getElementById("birthdayMessage");

function createConfettiPieces() {
  confettiContainer.classList.remove("hidden");
  
  const emojis = ['🎉', '🎊', '✨', '💖', '🎈', '🌟', '💗'];
  const colors = ['#ff6b9d', '#ff85b3', '#ffb3d9', '#ffd6e6', '#fff0f5', '#ffb3d1', '#ff85a2'];
  
  // Create lots of confetti pieces (more than before for better effect)
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    
    // Random choice: emoji or colored dot
    const useEmoji = Math.random() > 0.4;
    
    if (useEmoji) {
      piece.classList.add('emoji');
      piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    } else {
      piece.classList.add('shape');
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Random starting position (top of screen, spread horizontally)
    const startX = Math.random() * window.innerWidth;
    const startY = -50;
    piece.style.left = startX + 'px';
    piece.style.top = startY + 'px';
    
    // Random horizontal translation distance
    const txDist = (Math.random() - 0.5) * 400; // spreads left/right
    const rotationDist = Math.random() * 720 - 360; // spins
    
    piece.style.setProperty('--tx', txDist + 'px');
    piece.style.setProperty('--rot', rotationDist + 'deg');
    
    // Vary animation duration and delay
    const duration = 2.5 + Math.random() * 1.2;
    const delay = Math.random() * 0.3;
    
    piece.style.animation = `confettiFall ${duration}s ease-in ${delay}s forwards`;
    
    confettiContainer.appendChild(piece);
    
    // Clean up after animation
    setTimeout(() => piece.remove(), (duration + delay) * 1000 + 100);
  }
}

function candleOff() {
  if (!flame.classList.contains("off")) {
    flame.classList.add("off");

    // ENHANCED CONFETTI PARTY POPPER
    createConfettiPieces();

    // SHOW MESSAGE (with slight delay for better effect)
    setTimeout(() => {
      birthdayMessage.classList.remove("hidden");
      afterCake.classList.remove("hidden");
    }, 600);
  }
}

// -----------------------
// TAP FALLBACK (SAFARI SAFE)
// -----------------------
if (blowBtn) {
  blowBtn.addEventListener("click", candleOff);
}

// -----------------------
// FINAL BUTTON → STORY PAGE
// -----------------------
if (goStory) {
  goStory.addEventListener("click", () => {
    window.location.href = "story.html";
  });
}



// =======================
// PAGE 2: STORY PAGE LOGIC
// =======================

// Smooth scrolling (Lenis)
if (typeof Lenis !== "undefined") {
  const lenis = new Lenis({
    duration: 1.2,
    smooth: true
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

// HERO INTRO — MORE OBVIOUS & CINEMATIC
if (typeof gsap !== "undefined") {

  gsap.from(".hero h1", {
    opacity: 0,
    y: 60,
    filter: "blur(12px)",
    duration: 1.6,
    ease: "power3.out"
  });

  gsap.from(".hero p", {
    opacity: 0,
    y: 30,
    filter: "blur(8px)",
    delay: 0.6,
    duration: 1.2,
    ease: "power3.out"
  });

  gsap.from(".scroll-hint", {
    opacity: 0,
    y: 10,
    delay: 1.6,
    duration: 1
  });
}

// SCROLL 3 — TEXT-ONLY LETTER ANIMATION
if (typeof gsap !== "undefined") {
  gsap.from(".letter .line", {
    opacity: 0,
    y: 30,
    duration: 1,
    stagger: 0.4,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".letter",
      start: "top 70%"
    }
  });
}
// SECOND SONG PLAY
const secondBtn = document.getElementById('playSecondSong');
const secondAudio = document.getElementById('secondAudio');

if (secondBtn && secondAudio) {
  secondBtn.addEventListener('click', () => {
    secondAudio.play();
    // optional: pause the first audio if it's still playing
    if (audio && !audio.paused) {
      audio.pause();
    }
  });
}

if (typeof gsap !== "undefined") {
  document.querySelectorAll('.floating-element').forEach((element, index) => {
    // set initial position with some randomness
    const startY = Math.random() * 100;
    gsap.set(element, { y: startY, rotation: Math.random() * 360 });

    // slow vertical float upward
    gsap.to(element, {
      y: "-140vh",
      duration: Math.random() * 8 + 12, // slower (12-20s)
      repeat: -1,
      ease: "none", // constant speed
    });

    // gentle horizontal drift (subtle, not distracting)
    gsap.to(element, {
      x: `+=${Math.random() * 80 - 40}px`, // gentle sway
      duration: Math.random() * 4 + 6, // slow sway
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // very slow rotation (barely noticeable)
    gsap.to(element, {
      rotation: "+=180",
      duration: Math.random() * 15 + 20,
      repeat: -1,
      ease: "none",
    });
  });
}

// =======================
// LIGHTBOX + ACCESSIBILITY ENHANCEMENTS
// =======================
(function(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Add aria-labels to like buttons
  document.querySelectorAll('.like-btn').forEach(btn => {
    if (!btn.hasAttribute('aria-label')) btn.setAttribute('aria-label','Toggle like');
  });

  // Ensure images have useful alt text (fallback to figcaption)
  document.querySelectorAll('.photo-frame').forEach(frame => {
    const img = frame.querySelector('img');
    const cap = frame.querySelector('figcaption');
    if (img) {
      const currentAlt = (img.getAttribute('alt') || '').trim();
      if (!currentAlt || currentAlt.toLowerCase().startsWith('photo')) {
        img.alt = cap ? cap.textContent.trim() : 'photo';
      }
    }
    const vid = frame.querySelector('video');
    if (vid && !vid.hasAttribute('preload')) vid.setAttribute('preload','metadata');
  });

  const frames = Array.from(document.querySelectorAll('.photo-frame'));
  const lightbox = document.getElementById('lightbox');
  const lbContent = lightbox && lightbox.querySelector('.lightbox-content');
  const lbCaption = lightbox && lightbox.querySelector('.lightbox-caption');
  const lbClose = lightbox && lightbox.querySelector('.lightbox-close');
  const lbNext = lightbox && lightbox.querySelector('.lightbox-next');
  const lbPrev = lightbox && lightbox.querySelector('.lightbox-prev');

  let currentIndex = 0;

  function openLightbox(index){
    if (!lightbox) return;
    currentIndex = index;
    renderLightboxItem(index);
    lightbox.classList.remove('hidden');
    lightbox.setAttribute('aria-hidden','false');
    // focus for accessibility
    lbClose.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox(){
    if (!lightbox) return;
    stopAnyMedia();
    lightbox.classList.add('hidden');
    lightbox.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  function stopAnyMedia(){
    const v = lbContent.querySelector('video');
    if (v) { try { v.pause(); v.currentTime = 0; } catch(e){} }
  }

  function renderLightboxItem(index){
    if (!lbContent) return;
    lbContent.innerHTML = '';
    const frame = frames[index];
    if (!frame) return;
    const cap = frame.querySelector('figcaption');
    const img = frame.querySelector('img');
    const vid = frame.querySelector('video');

    if (img) {
      const el = document.createElement('img');
      // prefer data-src if present (lazy)
      el.src = img.getAttribute('data-src') || img.src;
      el.alt = img.alt || (cap ? cap.textContent.trim() : 'photo');
      lbContent.appendChild(el);
    } else if (vid) {
      const video = document.createElement('video');
      video.src = vid.querySelector('source') ? vid.querySelector('source').src : vid.src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.muted = false;
      video.preload = 'metadata';
      lbContent.appendChild(video);
    }

    if (lbCaption) lbCaption.textContent = cap ? cap.textContent.trim() : '';
  }

  function next(){
    currentIndex = (currentIndex + 1) % frames.length;
    renderLightboxItem(currentIndex);
  }

  function prev(){
    currentIndex = (currentIndex - 1 + frames.length) % frames.length;
    renderLightboxItem(currentIndex);
  }

  // attach click handlers to open lightbox
  frames.forEach((frame, i) => {
    const trigger = frame.querySelector('img') || frame.querySelector('video');
    if (!trigger) return;
    trigger.style.cursor = 'zoom-in';
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(i);
    });
    // keyboard support: Enter opens
    trigger.setAttribute('tabindex','0');
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
    });
  });

  // controls
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbNext) lbNext.addEventListener('click', next);
  if (lbPrev) lbPrev.addEventListener('click', prev);

  // click outside content to close
  if (lightbox) lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // keyboard nav
  window.addEventListener('keydown', (e) => {
    if (!lightbox || lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

})();

const reels = document.querySelectorAll(".reel");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play();
      } else {
        video.pause();
      }
    });
  },
  {
    threshold: 0.6
  }
);

reels.forEach((video) => {
  observer.observe(video);
});

// Lazy-load images (polaroid pics)
const imgObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      const src = img.getAttribute('data-src');
      if (src) {
        img.src = src;
        img.removeAttribute('data-src');
      }
      imgObserver.unobserve(img);
    }
  });
}, { threshold: 0.1, rootMargin: '200px 0px' });

document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));

// Lazy-load video sources for .reel elements
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const video = entry.target;
      // find source children with data-src
      const sources = video.querySelectorAll('source[data-src]');
      sources.forEach(s => {
        s.src = s.getAttribute('data-src');
        s.removeAttribute('data-src');
      });
      // set preload to metadata for quick seekability
      try { video.preload = 'metadata'; } catch (e) {}
      // load the video element
      try { video.load(); } catch (e) {}

      // if marked data-autoplay, try to play (muted videos will autoplay)
      if (video.dataset.autoplay !== undefined) {
        const playPromise = video.play();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.catch(() => {/* ignore autoplay failures */});
        }
      }

      videoObserver.unobserve(video);
    }
  });
}, { threshold: 0.25, rootMargin: '300px 0px' });

document.querySelectorAll('video.reel').forEach(v => videoObserver.observe(v));


// =======================
// AVATAR COMPANIONS LOGIC (scroll-driven approach + meeting)
// =======================

const userAvatar = document.getElementById('userAvatar');
const girlfriendAvatar = document.getElementById('girlfriendAvatar');

const userExpressions = ['uhappy.PNG', 'ublush.PNG', 'uexcited.PNG'];
const girlfriendExpressions = ['fhappy.PNG', 'fblush.PNG', 'fexcited.PNG'];

let currentUserExpressionIndex = 0;
let currentGirlfriendExpressionIndex = 0;
let avatarExprInterval = null;
let haveMet = false;

function rotateAvatarExpressions() {
  if (haveMet) return; // stop rotating after they meet

  if (userAvatar) {
    currentUserExpressionIndex = (currentUserExpressionIndex + 1) % userExpressions.length;
    gsap.to(userAvatar, {
      opacity: 0,
      duration: 0.35,
      onComplete: () => {
        userAvatar.src = `assets/stickers/${userExpressions[currentUserExpressionIndex]}`;
        gsap.to(userAvatar, { opacity: 1, duration: 0.35 });
      }
    });
  }

  if (girlfriendAvatar) {
    currentGirlfriendExpressionIndex = (currentGirlfriendExpressionIndex + 1) % girlfriendExpressions.length;
    gsap.to(girlfriendAvatar, {
      opacity: 0,
      duration: 0.35,
      onComplete: () => {
        girlfriendAvatar.src = `assets/stickers/${girlfriendExpressions[currentGirlfriendExpressionIndex]}`;
        gsap.to(girlfriendAvatar, { opacity: 1, duration: 0.35 });
      }
    });
  }
}

// Start rotation and keep the interval ID so we can clear it when they meet
avatarExprInterval = setInterval(rotateAvatarExpressions, 4000);

// Movement handling
let lastScrollY = 0;
const avatarLeftContainer = document.querySelector('.avatar-left');
const avatarRightContainer = document.querySelector('.avatar-right');

function clamp(v, a = 0, b = 1) { return Math.max(a, Math.min(b, v)); }

function handleAvatarsOnScroll() {
  const doc = document.documentElement;
  const scrollTop = window.scrollY || window.pageYOffset;
  const maxScroll = doc.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? clamp(scrollTop / maxScroll) : 0;

  // compute horizontal offset in pixels (how much they should move toward center)
  const margin = 80; // keep some margin from exact center
  const vw = window.innerWidth;
  const halfWidth = vw / 2;

  // make avatars move closer on small screens: increase moveDistance proportionally
  let moveDistance;
  if (vw <= 420) {
    // mobile narrow: move almost to center so avatars get very close
    moveDistance = Math.max(halfWidth - 8, 80);
  } else if (vw <= 768) {
    // tablet: moderate approach
    moveDistance = Math.max(halfWidth - 40, 90);
  } else {
    // desktop: keep some margin
    moveDistance = Math.max(halfWidth - margin - 60, 40);
  }

  const leftX = progress * moveDistance; // move right
  const rightX = -progress * moveDistance; // move left

  // small vertical lift while approaching
  const lift = progress * 24; // px upward

  if (avatarLeftContainer && avatarRightContainer) {
    gsap.to(avatarLeftContainer, { x: leftX, y: -lift, duration: 0.45, ease: 'power2.out' });
    gsap.to(avatarRightContainer, { x: rightX, y: -lift, duration: 0.45, ease: 'power2.out' });
  }

  // check actual distance between containers (after transform applied)
  if (!haveMet && avatarLeftContainer && avatarRightContainer) {
    const leftRect = avatarLeftContainer.getBoundingClientRect();
    const rightRect = avatarRightContainer.getBoundingClientRect();
    const gap = rightRect.left - leftRect.right;

    // if they are visually close enough, trigger meeting
    const threshold = vw <= 420 ? 18 : vw <= 768 ? 40 : 80;
    if (gap < threshold || progress >= 0.98) {
      triggerMeeting();
    }
  }
  }
}

window.addEventListener('scroll', () => {
  lastScrollY = window.scrollY;
  // keep rolling movement updates; keep other scroll-up class behavior too
  if (userAvatar && girlfriendAvatar) {
    userAvatar.classList.add('scroll-up');
    girlfriendAvatar.classList.add('scroll-up');
    clearTimeout(window.scrollTimeout);
    window.scrollTimeout = setTimeout(() => {
      userAvatar.classList.remove('scroll-up');
      girlfriendAvatar.classList.remove('scroll-up');
    }, 300);
  }

  handleAvatarsOnScroll();
}, { passive: true });

// If GSAP ScrollTrigger is available we can also sync smoothly
if (typeof gsap !== 'undefined' && gsap.utils && gsap.registerPlugin) {
  // nothing required here, we use simple scroll handler for compatibility
}

// Meeting animation: hearts + confetti
function triggerMeeting() {
  haveMet = true;
  // lock final positions roughly center bottom
  const vw = window.innerWidth;
  const aw = avatarLeftContainer ? avatarLeftContainer.offsetWidth || 120 : 120;
  // Larger responsive gaps to prevent overlap on narrow screens
  const gapBetween = vw <= 420 ? 70 : vw <= 768 ? 100 : 160;

  // compute left/right desired left coordinates
  const centerXLeft = (vw / 2) - aw - (gapBetween / 2);
  const centerXRight = (vw / 2) + (gapBetween / 2);

  // stop expression rotation
  if (avatarExprInterval) {
    clearInterval(avatarExprInterval);
    avatarExprInterval = null;
  }

  // set blush expressions
  if (userAvatar) userAvatar.src = 'assets/stickers/ublush.PNG';
  if (girlfriendAvatar) girlfriendAvatar.src = 'assets/stickers/fblush.PNG';

  // animate avatars to final positions
  gsap.to(avatarLeftContainer, { x: centerXLeft - avatarLeftContainer.getBoundingClientRect().left, y: -60, duration: 0.8, ease: 'power3.out' });
  gsap.to(avatarRightContainer, { x: centerXRight - avatarRightContainer.getBoundingClientRect().left, y: -60, duration: 0.8, ease: 'power3.out' });

  // create heart pop elements
  const popRoot = document.createElement('div');
  popRoot.className = 'heart-pop';
  document.body.appendChild(popRoot);

  // create small confetti root
  const confRoot = document.createElement('div');
  confRoot.className = 'pop-confetti';
  document.body.appendChild(confRoot);

  // hearts
  const heartChars = ['❤', '💖', '💕', '💗', '💞'];
  for (let i = 0; i < 12; i++) {
    const h = document.createElement('div');
    h.className = 'heart';
    h.textContent = heartChars[i % heartChars.length];
    // random position near center
    h.style.left = `${(Math.random() * 160) - 80}px`;
    h.style.bottom = `20px`;
    popRoot.appendChild(h);

    // staggered animation
    const delay = i * 0.06;
    h.style.opacity = '0';
    gsap.to(h, { y: -120 - Math.random() * 60, opacity: 1, duration: 0.9, delay, ease: 'power2.out', onComplete: () => {
      gsap.to(h, { opacity: 0, duration: 0.4, delay: 0.2 });
    }});
  }

  // confetti dots
  const colors = ['#ffd6d6', '#ffb3d1', '#ffe9b3', '#ffd1e6', '#fff1f3'];
  for (let i = 0; i < 18; i++) {
    const d = document.createElement('div');
    d.className = 'dot';
    d.style.background = colors[i % colors.length];
    const angle = (Math.random() * 120 - 60) * (Math.PI/180);
    const dist = 80 + Math.random() * 140;
    d.style.left = `${(Math.random() * 160) - 80}px`;
    d.style.bottom = `8px`;
    confRoot.appendChild(d);
    gsap.to(d, { x: Math.cos(angle) * dist, y: - (50 + Math.random() * 120), opacity: 1, duration: 0.9, ease: 'power3.out', delay: i * 0.03, onComplete: () => {
      gsap.to(d, { opacity: 0, duration: 0.4 });
    }});
  }

  // cleanup after animation
  setTimeout(() => {
    popRoot.remove();
    confRoot.remove();
  }, 1600);
}

