const startBtn = document.getElementById("startBtn");
const story = document.getElementById("historia");

startBtn?.addEventListener("click", () => {
  story?.scrollIntoView({ behavior: "smooth", block: "start" });
});

const reveals = document.querySelectorAll(".reveal");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reducedMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach((el) => observer.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("visible"));
}

/* Galeria e lightbox */
const photos = [...document.querySelectorAll(".polaroid")];
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeBtn = document.getElementById("lightboxClose");
const prevBtn = document.getElementById("prevPhoto");
const nextBtn = document.getElementById("nextPhoto");

let currentIndex = 0;

function showPhoto(index) {
  currentIndex = (index + photos.length) % photos.length;

  const button = photos[currentIndex];

  lightboxImage.src = button.dataset.full;
  lightboxImage.alt =
    button.querySelector("img")?.alt || "Foto da memória";

  lightboxCaption.textContent =
    button.querySelector("span")?.textContent || "";
}

function openLightbox(index) {
  showPhoto(index);

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";

  closeBtn.focus();
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";
}

photos.forEach((photo, index) => {
  photo.addEventListener("click", () => {
    openLightbox(index);
  });
});

closeBtn.addEventListener("click", closeLightbox);

prevBtn.addEventListener("click", () => {
  showPhoto(currentIndex - 1);
});

nextBtn.addEventListener("click", () => {
  showPhoto(currentIndex + 1);
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    showPhoto(currentIndex - 1);
  }

  if (event.key === "ArrowRight") {
    showPhoto(currentIndex + 1);
  }
});

/* Música opcional */
const musicFile = document.getElementById("musicFile");
const musicBtn = document.getElementById("musicBtn");
const audioPlayer = document.getElementById("audioPlayer");

musicBtn.addEventListener("click", () => {
  if (!audioPlayer.src) {
    musicFile.click();
    return;
  }

  if (audioPlayer.paused) {
    audioPlayer.play().then(() => {
      musicBtn.classList.add("playing");
      musicBtn.innerHTML = "♫ <span>Pausar música</span>";
    }).catch(() => {});
  } else {
    audioPlayer.pause();
    musicBtn.classList.remove("playing");
    musicBtn.innerHTML = "♫ <span>Continuar música</span>";
  }
});

musicFile.addEventListener("change", () => {
  const file = musicFile.files?.[0];

  if (!file) return;

  audioPlayer.src = URL.createObjectURL(file);

  audioPlayer.play().then(() => {
    musicBtn.classList.add("playing");
    musicBtn.innerHTML = "♫ <span>Pausar música</span>";
  }).catch(() => {
    musicBtn.innerHTML = "♫ <span>Reproduzir música</span>";
  });
});

audioPlayer.addEventListener("ended", () => {
  musicBtn.classList.remove("playing");
});
