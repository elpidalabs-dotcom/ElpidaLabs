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
let frame = 0;
let targetX = 0,
  targetY = 0,
  x = 0,
  y = 0;
function updateMotion() {
  scene?.classList.toggle("paused", paused);
  motionButton?.setAttribute("aria-pressed", String(paused));
  if (motionButton)
    motionButton.textContent = paused ? "Resume orbit ↻" : "Pause orbit Ⅱ";
  if (paused || reduced.matches) {
    cancelAnimationFrame(frame);
    frame = 0;
    scene?.style.setProperty("--rx", "0deg");
    scene?.style.setProperty("--ry", "0deg");
  }
}
function animate() {
  x += (targetX - x) * 0.075;
  y += (targetY - y) * 0.075;
  scene.style.setProperty("--rx", `${y}deg`);
  scene.style.setProperty("--ry", `${x}deg`);
  if (Math.abs(x - targetX) + Math.abs(y - targetY) > 0.02)
    frame = requestAnimationFrame(animate);
  else frame = 0;
}
scene?.addEventListener("pointermove", (event) => {
  if (paused || reduced.matches || event.pointerType === "touch") return;
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
