const arrow =
  '<svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 19 19 5M5 5h14v14"/></svg>';
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches)
    document
      .querySelector("[data-orbit-explorer]")
      ?.getAnimations()
      .forEach((animation) => animation.cancel());
});

const explorer = document.querySelector("[data-orbit-explorer]");
if (explorer) {
  const focus = {
    ai: [
      "03 / METHODS & EXPLORATION",
      "Human judgment, amplified.",
      "Intelligent tools can accelerate exploration. Review, understanding, and responsibility stay with the people doing the work.",
      "about.html#ai-approach",
      "Explore our approach to AI",
    ],
    web3: [
      "01 / ORIGINAL PRODUCTS",
      "Ideas, onchain.",
      "Explore Elpida: a multichain launchpad in development, starting with a clearer journey for creators and communities.",
      "elpida.html",
      "Explore Elpida",
    ],
    systems: [
      "02 / SYSTEMS RESEARCH",
      "Understand the unexpected.",
      "Explore Chaos Engine: a research concept asking how bounded failure experiments could help teams understand recovery.",
      "chaos-engine.html",
      "Explore Chaos Engine",
    ],
  };
  const controls = [...explorer.querySelectorAll("[data-orbit-focus]")];
  controls.forEach((control) => {
    control.addEventListener("click", () => {
      control.focus({ preventScroll: true });
      const key = control.dataset.orbitFocus;
      const [kicker, heading, description, href, link] = focus[key];
      controls.forEach((button) =>
        button.setAttribute("aria-pressed", String(button === control)),
      );
      document.querySelector(".hero-visual").dataset.orbitFocus = key;
      explorer.querySelector("[data-orbit-kicker]").textContent = kicker;
      explorer.querySelector("[data-orbit-heading]").textContent = heading;
      explorer.querySelector("[data-orbit-description]").textContent =
        description;
      const anchor = explorer.querySelector("[data-orbit-link]");
      anchor.href = href;
      anchor.replaceChildren(document.createTextNode(link + " "));
      anchor.insertAdjacentHTML("beforeend", arrow);
      if (!reducedMotion.matches && explorer.animate) {
        explorer.getAnimations().forEach((animation) => animation.cancel());
        explorer.animate(
          [{ transform: "translateY(7px)" }, { transform: "translateY(0)" }],
          { duration: 360, easing: "cubic-bezier(.16,1,.3,1)" },
        );
      }
    });
    control.addEventListener("keydown", (event) => {
      const current = controls.indexOf(control);
      const next =
        event.key === "ArrowRight"
          ? (current + 1) % controls.length
          : event.key === "ArrowLeft"
            ? (current + controls.length - 1) % controls.length
            : event.key === "Home"
              ? 0
              : event.key === "End"
                ? controls.length - 1
                : -1;
      if (next !== -1) {
        event.preventDefault();
        controls[next].focus();
        controls[next].click();
      }
    });
  });
}

const creator = document.querySelector("[data-elpida-demo]");
if (creator) {
  const steps = [...creator.querySelectorAll("[data-demo-step]")];
  const panels = [...creator.querySelectorAll("[data-demo-panel]")];
  function showStep(index, moveFocus = false) {
    panels.forEach((panel, i) => {
      panel.hidden = i !== index;
    });
    steps.forEach((step, i) =>
      step.setAttribute("aria-pressed", String(i === index)),
    );
    creator.querySelector("[data-demo-position]").textContent =
      `Step ${index + 1} of ${panels.length}`;
    if (moveFocus) {
      const heading = panels[index].querySelector("h3");
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      heading.scrollIntoView({
        block: "start",
        behavior: reducedMotion.matches ? "instant" : "smooth",
      });
    }
  }
  steps.forEach((step) =>
    step.addEventListener("click", () =>
      showStep(Number(step.dataset.demoStep)),
    ),
  );
  creator
    .querySelectorAll("[data-demo-next]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        showStep(Number(button.dataset.demoNext), true),
      ),
    );
  function updateSample() {
    const name =
      creator.querySelector("#sample-name").value.trim() || "Sample project";
    const purpose =
      creator.querySelector("#sample-purpose").value.trim() ||
      "A project idea, still taking shape.";
    creator.querySelectorAll("[data-sample-name]").forEach((el) => {
      el.textContent = name;
    });
    creator.querySelectorAll("[data-sample-purpose]").forEach((el) => {
      el.textContent = purpose;
    });
  }
  creator
    .querySelectorAll("input,textarea")
    .forEach((field) => field.addEventListener("input", updateSample));
  showStep(0);
}

const sandbox = document.querySelector("[data-chaos-demo]");
if (sandbox) {
  const { simulateScenario } = await import(
    "./demo-model.js" + new URL(import.meta.url).search
  );
  const delay = sandbox.querySelector("#latency");
  const mode = sandbox.querySelector("#failure-mode");
  const recovery = sandbox.querySelector("#recovery-mode");
  let changed = false;
  function draw() {
    const scenario = simulateScenario({
      delay: delay.value,
      mode: mode.value,
      recovery: recovery.value,
    });
    sandbox.querySelector("#latency-value").textContent = `${delay.value} ms`;
    delay.disabled = mode.value === "outage";
    sandbox.querySelector("#scenario-line").setAttribute("d", scenario.path);
    sandbox.querySelector("#scenario-result").textContent = scenario.headline;
    sandbox.querySelector("#scenario-explanation").textContent =
      scenario.explanation;
    sandbox.querySelector("#scenario-question").textContent = scenario.question;
    sandbox.querySelector("#scenario-chart-description").textContent =
      `${scenario.headline} ${scenario.explanation} Generated illustration, not live telemetry.`;
    sandbox.querySelector("#scenario-state").textContent = changed
      ? "Updated illustration"
      : "Default illustration";
  }
  delay.addEventListener("input", () => {
    sandbox.querySelector("#latency-value").textContent = `${delay.value} ms`;
  });
  mode.addEventListener("change", () => {
    delay.disabled = mode.value === "outage";
  });
  sandbox.querySelector("#run-scenario").addEventListener("click", () => {
    changed = true;
    draw();
  });
  sandbox.querySelector("#reset-scenario").addEventListener("click", () => {
    delay.value = "300";
    mode.value = "latency";
    recovery.value = "wait";
    changed = false;
    draw();
  });
  draw();
  sandbox.querySelector("#run-scenario").disabled = false;
  sandbox.querySelector("#reset-scenario").disabled = false;
  sandbox.dataset.ready = "true";
}

const journal = document.querySelector("[data-journal]");
if (journal) {
  const cards = [...journal.querySelectorAll("[data-journal-category]")];
  const filters = [...journal.querySelectorAll("[data-journal-filter]")];
  filters.forEach((button) =>
    button.addEventListener("click", () => {
      const category = button.dataset.journalFilter;
      cards.forEach((card) => {
        card.hidden =
          category !== "all" && card.dataset.journalCategory !== category;
      });
      filters.forEach((filter) =>
        filter.setAttribute("aria-pressed", String(filter === button)),
      );
      const count = cards.filter((card) => !card.hidden).length;
      journal.querySelector(".filter-status").textContent =
        `Showing ${count} ${count === 1 ? "note" : "notes"}`;
    }),
  );
}

async function copyText(text, status, success) {
  try {
    if (!navigator.clipboard?.writeText)
      throw new Error("Clipboard unavailable");
    await navigator.clipboard.writeText(text);
    status.textContent = success;
  } catch {
    status.textContent =
      "Copy is unavailable here. Select the text to copy it, or use the email link.";
  }
}
document
  .querySelector("[data-copy-email]")
  ?.addEventListener("click", (event) => {
    copyText(
      event.currentTarget.dataset.copyEmail,
      document.querySelector(".copy-status"),
      "Email address copied.",
    );
  });
const enquiry = document.querySelector("#enquiry-form");
if (enquiry) {
  let draftText = "";
  enquiry.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!enquiry.reportValidity()) return;
    const email = enquiry.action.replace(/^mailto:/, "").split("?")[0];
    const subject = `[Elpida Labs / ${enquiry.querySelector("#enquiry-topic").value}] ${enquiry.querySelector("#enquiry-subject").value.trim()}`;
    const body = enquiry.querySelector("#enquiry-body").value.trim();
    draftText = `To: ${email}\nSubject: ${subject}\n\n${body}`;
    document.querySelector("#enquiry-text").textContent = draftText;
    const anchor = document.querySelector("#enquiry-mailto");
    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const longDraft = mailto.length > 1800;
    anchor.href = longDraft
      ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
      : mailto;
    const preview = document.querySelector("#enquiry-preview");
    preview.hidden = false;
    const heading = preview.querySelector("h3");
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    preview.scrollIntoView({
      behavior: reducedMotion.matches ? "instant" : "smooth",
      block: "nearest",
    });
    document.querySelector("#enquiry-status").textContent = longDraft
      ? "Long draft: copy it, then paste it into your email app. Nothing has been sent."
      : "Draft prepared. Nothing has been sent.";
  });
  enquiry.addEventListener("input", () => {
    // A reviewed draft must not silently keep stale text after a form edit.
    document.querySelector("#enquiry-preview").hidden = true;
  });
  document
    .querySelector("#copy-enquiry")
    .addEventListener("click", () =>
      copyText(
        draftText,
        document.querySelector("#enquiry-status"),
        "Draft copied. Paste it into your email app to send.",
      ),
    );
}

const article = document.querySelector(".article");
if (article) {
  const sections = [...article.querySelectorAll(".article-body > section[id]")];
  const links = [...article.querySelectorAll(".article-layout aside a")];
  const progress = document.createElement("div");
  progress.className = "reading-progress";
  progress.setAttribute("aria-hidden", "true");
  progress.innerHTML = "<span></span>";
  document.querySelector(".site-header").append(progress);
  let scheduled = false;
  function measure() {
    const box = article.getBoundingClientRect();
    const fraction = Math.max(
      0,
      Math.min(1, -box.top / Math.max(1, box.height - innerHeight)),
    );
    progress.firstElementChild.style.transform = `scaleX(${fraction})`;
    scheduled = false;
  }
  addEventListener(
    "scroll",
    () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(measure);
      }
    },
    { passive: true },
  );
  addEventListener("resize", measure);
  measure();
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry) => {
            links.forEach((link) => {
              if (link.hash === "#" + entry.target.id)
                link.setAttribute("aria-current", "location");
              else link.removeAttribute("aria-current");
            });
          });
      },
      { rootMargin: "-15% 0px -55% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
  }
}
