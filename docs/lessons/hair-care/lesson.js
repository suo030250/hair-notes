"use strict";
(() => {
  const slides = Array.from(document.querySelectorAll(".lesson-slide"));
  const controls = document.querySelector(".lesson-controls");
  if (!slides.length || !controls) return;
  const select = document.getElementById("slide-select");
  const prev = document.getElementById("prev-slide");
  const next = document.getElementById("next-slide");
  let current = 0;
  const update = (index) => {
    current = Math.max(0, Math.min(slides.length - 1, index));
    select.value = String(current + 1);
    prev.disabled = current === 0;
    next.disabled = current === slides.length - 1;
  };
  const fromHash = () => {
    const match = location.hash.match(/^#slide-(\d+)$/);
    return match && Number(match[1]) >= 1 && Number(match[1]) <= slides.length ? Number(match[1]) - 1 : 0;
  };
  const go = (index) => {
    update(index);
    history.replaceState(null, "", "#slide-" + (current + 1));
    slides[current].scrollIntoView({ behavior: "instant", block: "start" });
  };
  controls.hidden = false;
  prev.addEventListener("click", () => go(current - 1));
  next.addEventListener("click", () => go(current + 1));
  select.addEventListener("change", () => go(Number(select.value) - 1));
  document.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target.closest("input,select,textarea,button,summary,[contenteditable]")) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault(); go(current + (event.key === "ArrowRight" ? 1 : -1));
    }
  });
  let scheduled = false;
  window.addEventListener("scroll", () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      let best = 0;
      slides.forEach((slide, index) => { if (slide.getBoundingClientRect().top <= window.innerHeight * 0.45) best = index; });
      update(best); scheduled = false;
    });
  }, { passive: true });
  window.addEventListener("hashchange", () => go(fromHash()));
  update(fromHash());
  if (location.hash) requestAnimationFrame(() => go(fromHash()));
  const form = document.getElementById("lesson-quiz");
  if (!form) return;
  const quizCopy = JSON.parse(document.getElementById("quiz-copy").textContent);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const answer = new FormData(form).get("answer");
    document.getElementById("quiz-feedback").textContent = !answer ? quizCopy.feedback.empty : answer === quizCopy.correct ? quizCopy.feedback.correct : quizCopy.feedback.incorrect;
  });
})();
