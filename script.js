document.documentElement.classList.add("js");
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#primary-nav");
function closeMenu() {
  toggle?.setAttribute("aria-expanded", "false");
}
toggle?.addEventListener("click", () =>
  toggle.setAttribute(
    "aria-expanded",
    String(toggle.getAttribute("aria-expanded") !== "true"),
  ),
);
nav
  ?.querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    toggle?.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu();
    toggle.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});
matchMedia("(min-width: 901px)").addEventListener("change", closeMenu);
const scene = document.querySelector(".orbital");
const motionButton = document.querySelector(".motion-toggle");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
let paused = reduced.matches;
let sceneVisible = true;
let previousFrame = 0;
let frame = 0;
let targetX = 0,
  targetY = 0,
  x = 0,
  y = 0;
function updateMotion() {
  scene?.classList.toggle("paused", paused);
  scene?.classList.toggle("motion-idle", document.hidden || !sceneVisible);
  motionButton?.setAttribute("aria-pressed", String(paused));
  if (motionButton)
    motionButton.textContent = paused ? "Resume orbit" : "Pause orbit";
  if (paused || reduced.matches || document.hidden || !sceneVisible) {
    cancelAnimationFrame(frame);
    frame = 0;
    scene?.style.setProperty("--rx", "0deg");
    scene?.style.setProperty("--ry", "0deg");
  }
}
function animate(time) {
  if (!scene || paused || reduced.matches || document.hidden || !sceneVisible) {
    frame = 0;
    return;
  }
  const elapsed = previousFrame ? Math.min(64, time - previousFrame) : 16.7;
  previousFrame = time;
  const easing = 1 - Math.exp(-elapsed / 155);
  x += (targetX - x) * easing;
  y += (targetY - y) * easing;
  scene.style.setProperty("--rx", `${y}deg`);
  scene.style.setProperty("--ry", `${x}deg`);
  if (Math.abs(x - targetX) + Math.abs(y - targetY) > 0.02)
    frame = requestAnimationFrame(animate);
  else frame = 0;
}
scene?.addEventListener("pointermove", (event) => {
  if (
    paused ||
    reduced.matches ||
    document.hidden ||
    !sceneVisible ||
    event.pointerType === "touch"
  )
    return;
  const box = scene.getBoundingClientRect();
  targetX = ((event.clientX - box.left) / box.width - 0.5) * 16;
  targetY = -((event.clientY - box.top) / box.height - 0.5) * 12;
  if (!frame) frame = requestAnimationFrame(animate);
});
scene?.addEventListener("pointerleave", () => {
  targetX = targetY = 0;
  if (!paused && !reduced.matches && !frame)
    frame = requestAnimationFrame(animate);
});
motionButton?.addEventListener("click", () => {
  paused = !paused;
  updateMotion();
});
reduced.addEventListener("change", () => {
  paused = reduced.matches;
  updateMotion();
});
updateMotion();

document.addEventListener("visibilitychange", updateMotion);
if (scene && "IntersectionObserver" in window) {
  const orbitVisibility = new IntersectionObserver(
    ([entry]) => {
      sceneVisible = entry.isIntersecting;
      previousFrame = 0;
      updateMotion();
    },
    { rootMargin: "80px" },
  );
  orbitVisibility.observe(scene);
}

// Animate elements as they enter; content is never hidden awaiting JavaScript.
// WAAPI animations can be cancelled immediately when the motion preference changes.
const entranceAnimations = new Set();
function reveal(element, delay = 0) {
  if (reduced.matches || !element.animate) return;
  const animation = element.animate(
    [
      { transform: "translateY(20px)" },
      { transform: "translateY(0)" },
    ],
    { duration: 680, delay, easing: "cubic-bezier(.16,1,.3,1)" },
  );
  entranceAnimations.add(animation);
  animation.finished
    .catch(() => {})
    .finally(() => entranceAnimations.delete(animation));
}
if ("IntersectionObserver" in window && !reduced.matches) {
  const entranceObserver = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry, index) => {
          entranceObserver.unobserve(entry.target);
          reveal(entry.target, Math.min(index, 3) * 65);
        });
    },
    { threshold: 0.08 },
  );
  document
    .querySelectorAll(
      ".section-head, .product-card, .note-card, .record-card, .capability-grid > article, .cta, .page-hero > h1, .hero-copy > h1",
    )
    .forEach((element) => entranceObserver.observe(element));
  reduced.addEventListener("change", () => {
    if (reduced.matches) {
      entranceObserver.disconnect();
      entranceAnimations.forEach((animation) => animation.cancel());
    }
  });
}
