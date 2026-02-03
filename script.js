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
const birthdayMessage = document.getElementById("birthdayMessage");

function candleOff() {
  if (!flame.classList.contains("off")) {
    flame.classList.add("off");

    // SHOW SPARKLES
    sparklesBox.classList.remove("hidden");

    for (let i = 0; i < 40; i++) {
      const s = document.createElement("div");
      s.className = "sparkle";
      s.style.left = Math.random() * 100 + "vw";
      s.style.top = Math.random() * 100 + "vh";
      sparklesBox.appendChild(s);

      setTimeout(() => s.remove(), 1200);
    }

    // SHOW MESSAGE
    setTimeout(() => {
      birthdayMessage.classList.remove("hidden");
      afterCake.classList.remove("hidden");
    }, 800);
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
  document.querySelectorAll('.balloon').forEach((balloon) => {
    // random size & opacity
    balloon.style.fontSize = `${Math.random() * 1.2 + 1.8}rem`;
    balloon.style.opacity = `${Math.random() * 0.4 + 0.6}`;

    // set initial Y position and rotation randomly
    gsap.set(balloon, { y: Math.random() * 200, rotation: Math.random() * 360 });

    // vertical float + continuous rotation
    gsap.to(balloon, {
      y: "-120vh",
      rotation: "+=720", // continuous spin
      duration: Math.random() * 6 + 8,
      repeat: -1,
      ease: "linear",
    });

    // horizontal wiggle ONLY
    gsap.to(balloon, {
      x: `+=${Math.random() * 40 - 20}px`,
      duration: Math.random() * 1 + 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });
}


