import { readFileSync } from "node:fs";
import { articles, people, renderPeople, escapeText } from "./content.mjs";
export const site = JSON.parse(
  readFileSync(new URL("../content/site.json", import.meta.url), "utf8"),
);
export const escape = (text) =>
  String(text).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const arrow =
  '<svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 19 19 5M5 5h14v14"/></svg>';
const iconPaths = {
  intelligence:
    '<path d="M12 3v4m0 10v4M3 12h4m10 0h4M5.6 5.6l2.8 2.8m7.2 7.2 2.8 2.8M5.6 18.4l2.8-2.8m7.2-7.2 2.8-2.8"/><circle cx="12" cy="12" r="5"/>',
  web: '<path d="m12 3 8 5v8l-8 5-8-5V8Z"/><path d="m4 8 8 5 8-5m-8 5v8"/>',
  systems: '<path d="M3 12h4l3-7 4 14 3-7h4"/>',
  link: '<path d="M7 17 17 7M7 7h10v10"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18"/>',
};
export const icon = (name) =>
  `<svg class="line-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${iconPaths[name] || iconPaths.link}</svg>`;
const eyebrow = (text) => `<p class="eyebrow">${text}</p>`;
const button = (href, text, secondary = false) =>
  `<a class="button${secondary ? " secondary" : ""}" href="${href}">${text}${arrow}</a>`;

export const orbitExplorer = `<div class="orbit-explorer" data-orbit-explorer><div class="orbit-switches" role="group" aria-label="Explore the lab’s focus areas"><button type="button" data-orbit-focus="ai" aria-pressed="false">${icon("intelligence")}AI</button><button type="button" data-orbit-focus="web3" aria-pressed="true">${icon("web")}Web3</button><button type="button" data-orbit-focus="systems" aria-pressed="false">${icon("systems")}Systems</button></div><div class="orbit-insight" aria-live="polite" aria-atomic="true"><span class="micro-label" data-orbit-kicker>01 / ORIGINAL PRODUCTS</span><h2 data-orbit-heading>Ideas, onchain.</h2><p data-orbit-description>Explore Elpida: a multichain launchpad in development, starting with a clearer journey for creators and communities.</p><a data-orbit-link class="text-link" href="elpida.html">Explore Elpida ${arrow}</a></div></div>`;

export function diagram(kind, compact = false) {
  const elpida = kind === "elpida";
  const steps = elpida
    ? [
        ["01", "Creator context", "What is being built?"],
        ["02", "Clear review", "What am I choosing?"],
        ["03", "Community", "What happens next?"],
      ]
    : [
        ["01", "Hypothesis", "State expected behavior."],
        ["02", "Bounded disruption", "Change one condition."],
        ["03", "Observation", "Compare, restore, learn."],
      ];
  return `<figure class="system-diagram${compact ? " compact-diagram" : ""} ${elpida ? "" : "cyan-diagram"}"><figcaption>${icon(elpida ? "web" : "systems")}<span>${elpida ? "A proposed creator journey" : "A proposed experiment loop"}</span><span class="micro-label">CONCEPT MAP</span></figcaption><ol>${steps.map(([n, title, desc]) => `<li><span class="diagram-number">${n}</span><strong>${title}</strong><span>${desc}</span></li>`).join("")}</ol><p>${elpida ? "An interface can clarify the journey. Network support and launch functionality remain unconfirmed." : "A learning loop for an isolated environment. This website does not connect to infrastructure."}</p></figure>`;
}

export const elpidaDemo = `<section class="section wrap product-experience" id="product-preview" aria-labelledby="elpida-preview-title">${eyebrow("INTERFACE STUDY / ELPIDA")}<div class="section-head"><div><h2 id="elpida-preview-title">An idea you can<br><span class="serif lime">step inside.</span></h2></div><p>Try a proposed project-information flow. This interactive study uses sample content and does not create tokens, connect a wallet, or make transactions.</p></div><div class="demo-window elpida-demo" data-elpida-demo><div class="demo-toolbar"><span class="window-lights" aria-hidden="true"><i></i><i></i><i></i></span><span>elpida / creator workspace</span><span class="demo-badge">CONCEPT PREVIEW</span></div><div class="demo-layout"><div class="demo-sidebar"><img src="assets/elpida-mark.png" width="36" height="36" alt="" loading="lazy"/><p class="micro-label">A PROJECT’S FIRST CHAPTER</p><div class="step-controls" role="group" aria-label="Preview steps"><button type="button" data-demo-step="0" aria-pressed="true" aria-controls="create-panel"><span>01</span>Tell the story</button><button type="button" data-demo-step="1" aria-pressed="false" aria-controls="review-panel"><span>02</span>Review the context</button><button type="button" data-demo-step="2" aria-pressed="false" aria-controls="discover-panel"><span>03</span>See the preview</button></div><p class="demo-side-note">Illustrative interface.<br>Your edits stay on this page.</p></div><div class="demo-main"><section data-demo-panel="0" id="create-panel"><p class="micro-label">01 / MAKE THE IDEA UNDERSTANDABLE</p><h3>Start with the story.</h3><p>Give this sample project a name and a purpose. See the information carry through the proposed journey.</p><label for="sample-name">Project name</label><input id="sample-name" type="text" maxlength="60" value="Sample project" autocomplete="off"/><label for="sample-purpose">What is the project exploring?</label><textarea id="sample-purpose" maxlength="240" rows="3">A community bringing curious people together around a shared idea.</textarea><button class="button" type="button" data-demo-next="1">Review the context ${arrow}</button></section><section data-demo-panel="1" id="review-panel"><p class="micro-label">02 / CONTEXT BEFORE A COMMITMENT</p><h3>Clarity before action.</h3><div class="review-block"><span class="micro-label">PROJECT</span><strong data-sample-name>Sample project</strong><p data-sample-purpose>A community bringing curious people together around a shared idea.</p></div><ul class="review-checklist"><li>${icon("check")}Project description visible</li><li>${icon("check")}Development status stated</li><li><span class="review-pending" aria-hidden="true">○</span>Network and launch mechanics: still to be defined</li></ul><p class="demo-note">This review is illustrative. It is not a security check, approval, or launch-readiness assessment.</p><button class="button" type="button" data-demo-next="2">See the preview ${arrow}</button></section><section data-demo-panel="2" id="discover-panel"><p class="micro-label">03 / A CLEARER FIRST IMPRESSION</p><h3>A place for the idea.</h3><div class="sample-project"><div class="sample-cover" aria-hidden="true">${icon("web")}</div><div><span class="demo-badge">SAMPLE / NOT A REAL LAUNCH</span><h4 data-sample-name>Sample project</h4><p data-sample-purpose>A community bringing curious people together around a shared idea.</p><span class="sample-stage">Concept · community information preview</span></div></div><p class="demo-note">The direction: make project context easier to understand. The product is still in development.</p><button class="button secondary" type="button" data-demo-next="0">Start again ${arrow}</button></section></div></div><div class="demo-footer"><span>DESIGN STUDY / NO ONCHAIN ACTIONS</span><span data-demo-position aria-live="polite">Step 1 of 3</span></div></div>${diagram("elpida")}</section>`;

export const chaosDemo = `<section class="section wrap product-experience chaos-experience" id="resilience-sandbox" aria-labelledby="chaos-preview-title">${eyebrow("INTERACTIVE EXPLAINER / CHAOS ENGINE")}<div class="section-head"><div><h2 id="chaos-preview-title">Change a condition.<br><span class="serif">See the question.</span></h2></div><p>A deterministic browser illustration of a failure-and-recovery story. Values are generated for this explainer, not measured from a service.</p></div><div class="demo-window chaos-demo" data-chaos-demo><div class="demo-toolbar"><span class="window-lights" aria-hidden="true"><i></i><i></i><i></i></span><span>chaos engine / resilience sandbox</span><span class="demo-badge">ILLUSTRATIVE MODEL</span></div><div class="sandbox-layout"><div class="sandbox-controls"><p class="micro-label">DEFINE THE SCENARIO</p><label for="failure-mode">Disruption</label><select id="failure-mode"><option value="latency">A dependency slows down</option><option value="outage">A dependency becomes unavailable</option></select><label for="latency">Added delay <output id="latency-value" for="latency">300 ms</output></label><input id="latency" type="range" min="0" max="800" step="50" value="300"/><label for="recovery-mode">Illustrative response</label><select id="recovery-mode"><option value="wait">Wait for the dependency</option><option value="fallback">Use a bounded fallback</option></select><button type="button" class="button" id="run-scenario" disabled>Draw the scenario ${arrow}</button><button type="button" class="reset-button" id="reset-scenario" disabled>Reset illustration</button><p class="demo-note">No network requests. No real failures injected. Adjustments only change the model drawn here.</p></div><div class="sandbox-results"><div class="chart-heading"><div><span class="micro-label">SYNTHETIC RESPONSE TIME</span><h3>A bounded disruption.</h3></div><span class="chart-unit">ms</span></div><svg class="scenario-chart" viewBox="0 0 640 260" role="img" aria-labelledby="scenario-chart-title scenario-chart-description"><title id="scenario-chart-title">Illustrative response-time scenario</title><desc id="scenario-chart-description">Generated sample response times increase during a simulated disruption and return to the baseline afterward. This is not live telemetry.</desc><path class="chart-grid" d="M40 30H620M40 90H620M40 150H620M40 210H620"/><rect class="disruption-zone" x="230" y="20" width="190" height="195"/><text x="236" y="40" class="chart-label">DISRUPTION WINDOW</text><path id="scenario-line" class="chart-line" d="M40 195L160 192L230 195L250 122L400 126L430 194L620 192"/></svg><div class="chart-stages" aria-hidden="true"><span>BEFORE</span><span>DURING</span><span>AFTER</span></div><div class="scenario-summary" role="status" aria-live="polite" aria-atomic="true"><h4 id="scenario-result">A slowdown, then a return.</h4><p id="scenario-explanation">The default illustration adds 300 ms during the disruption window. The line returns to the generated baseline afterward.</p></div><div class="scenario-question"><span>THE USEFUL QUESTION</span><p id="scenario-question">Would a person using the application understand the delay and know what to do next?</p></div></div></div><div class="demo-footer"><span>EXPLAINER / NOT A TESTING SERVICE</span><span id="scenario-state">Default illustration</span></div></div><noscript><p class="demo-note">The default scenario is shown above. Enable JavaScript to change its generated values.</p></noscript>${diagram("chaos")}</section>`;

export function productProgress(elpida) {
  return `<section class="section wrap progress-section"><div>${eyebrow("DEVELOPMENT / THE NEXT USEFUL STEP")}<h2>Progress with<br><span class="muted">the context attached.</span></h2><p>Direction is useful. A clearly defined next objective is better.</p></div><ol class="development-track"><li class="is-current"><span class="track-dot" aria-hidden="true"></span><div><span class="micro-label">CURRENT STAGE</span><h3>${elpida ? "Product in development" : "Research & concept exploration"}</h3><p>${elpida ? "The multichain launchpad direction is described here. This website now includes an interactive interface study." : "The resilience-testing direction is described here. This website now includes a synthetic scenario explainer."}</p></div></li><li><span class="track-dot" aria-hidden="true"></span><div><span class="micro-label">NEXT OBJECTIVE / PLANNED</span><h3>${elpida ? "Define a testable first journey" : "Define one reproducible experiment"}</h3><p>${elpida ? "Narrow the creator experience, specify its constraints, and test whether the project information is understandable." : "Document a hypothesis, an isolated environment, a bounded disruption, and a verified cleanup procedure."}</p></div></li><li><span class="track-dot" aria-hidden="true"></span><div><span class="micro-label">FUTURE / NOT YET CONFIRMED</span><h3>${elpida ? "Validate an implementation" : "Evaluate a working prototype"}</h3><p>Scope, readiness criteria, and actual results need to be documented before claiming a released capability. No release date is announced.</p></div></li></ol></section>`;
}

export const journalEntries = articles;
const entryCard = (entry, i) =>
  `<article class="editorial-card" data-journal-category="${entry.tag}"><a class="editorial-art editorial-${entry.art}" href="${entry.file}" aria-label="EL / NOTE ${String(i + 1).padStart(2, "0")} — ${escape(entry.title)}"><span class="editorial-index" aria-hidden="true">EL / NOTE ${String(i + 1).padStart(2, "0")}</span>${entry.art === "elpida" ? '<img src="assets/elpida-mark.png" width="100" height="100" alt="" loading="lazy"/>' : icon(entry.art === "chaos" ? "systems" : entry.art === "screen" ? "web" : "code")}</a><div class="editorial-copy"><span class="micro-label">${escape(entry.category)}</span><h3><a href="${entry.file}">${escape(entry.title)}</a></h3><p>${escape(entry.summary)}</p><a class="text-link" href="${entry.file}">Read the note ${arrow}</a></div></article>`;
export const journalShowcase = `<div class="editorial-grid">${journalEntries.slice(0, 2).map(entryCard).join("")}</div>`;
export const journalIndex = `<div data-journal><div class="journal-tools" role="group" aria-label="Filter journal notes"><button type="button" data-journal-filter="all" aria-pressed="true">All notes <span>${String(journalEntries.length).padStart(2, "0")}</span></button><button type="button" data-journal-filter="elpida" aria-pressed="false">Elpida</button><button type="button" data-journal-filter="systems" aria-pressed="false">Systems</button><button type="button" data-journal-filter="engineering" aria-pressed="false">Inside the build</button></div><p class="filter-status sr-only" role="status" aria-live="polite">Showing ${journalEntries.length} notes</p><div class="editorial-grid">${journalEntries.map(entryCard).join("")}</div></div>`;

export const contactPage = `<section class="page-hero wrap contact-hero">${eyebrow("CONTACT / GOOD QUESTIONS WELCOME")}<h1>Let’s start<br>with a <span class="serif lime">conversation.</span></h1><div class="intro-grid"><p class="lead">An idea, a question,<br>or a problem worth exploring.</p><div><p>Tell us what you have in mind. We’re interested in thoughtful engineering collaborations, product feedback, and research conversations.</p><a class="contact-email" href="mailto:${site.email}">${site.email}${arrow}</a><button type="button" class="copy-email text-link" data-copy-email="${site.email}">Copy email address</button><p class="copy-status" role="status" aria-live="polite"></p></div></div></section><section class="section wrap contact-layout"><div>${eyebrow("A USEFUL FIRST MESSAGE")}<h2>A little context<br>goes a long way.</h2><ol class="contact-prompts"><li><span>01</span><div><h3>The idea</h3><p>What are you trying to build or understand?</p></div></li><li><span>02</span><div><h3>The context</h3><p>What exists already, and where is the challenge?</p></div></li><li><span>03</span><div><h3>The next step</h3><p>What kind of conversation would be useful?</p></div></li></ol><a class="text-link" href="${site.repository}">Prefer to explore the code? ${arrow}</a></div><div class="enquiry-card"><form id="enquiry-form" action="mailto:${site.email}" method="get"><p class="micro-label">PREPARE AN ENQUIRY</p><label for="enquiry-topic">What would you like to discuss?</label><select id="enquiry-topic"><option>Collaboration</option><option>Elpida feedback</option><option>Chaos Engine research</option><option>Something else</option></select><label for="enquiry-subject">Subject <span>(required)</span></label><input type="text" id="enquiry-subject" name="subject" maxlength="100" required autocomplete="off" placeholder="A brief introduction to your idea"/><label for="enquiry-body">Your message <span>(required)</span></label><textarea id="enquiry-body" name="body" rows="7" minlength="20" maxlength="4000" required placeholder="A little context about your idea, challenge, and the next step you have in mind."></textarea><p class="form-help" id="enquiry-help">This prepares a draft in your email app. You review and send it there. Your message is not stored on this website.</p><button class="button" type="submit" aria-describedby="enquiry-help">Prepare email draft ${arrow}</button></form><div id="enquiry-preview" class="enquiry-preview" hidden><h3>Your draft is ready.</h3><p>Open your email app to review and send it, or copy the draft into an app you prefer.</p><pre id="enquiry-text"></pre><div class="actions"><a class="button" id="enquiry-mailto" href="mailto:${site.email}">Open email app ${arrow}</a><button type="button" class="button secondary" id="copy-enquiry">Copy draft</button></div><p id="enquiry-status" role="status" aria-live="polite"></p></div></div></section>`;

const engineeringFigure = `<figure class="system-diagram"><figcaption>${icon("code")}<span>A small website, with clear boundaries</span><span class="micro-label">IMPLEMENTED HERE</span></figcaption><ol><li><span class="diagram-number">01</span><strong>Content & templates</strong><span>Verified copy, shared components, local generation.</span></li><li><span class="diagram-number">02</span><strong>Static output</strong><span>HTML, CSS, and small browser enhancements.</span></li><li><span class="diagram-number">03</span><strong>Static hosting</strong><span>Host-specific output for GitHub Pages or Vercel.</span></li></ol><p>Demonstrations run in the browser. Enquiries open an email draft. No application server is required.</p></figure>`;

export function articleExtras(file) {
  const entry = journalEntries.find((e) => e.file === file);
  if (!entry) return null;
  const related = journalEntries
    .filter((e) => e.file !== file)
    .slice(
      file === "building-elpida.html" ? 1 : 0,
      file === "building-elpida.html" ? 3 : 2,
    );
  return {
    takeaway: `<aside class="article-takeaway" aria-label="At a glance"><span class="micro-label">THE IDEA IN ONE LINE</span><p>${escape(entry.takeaway)}</p></aside>`,
    figure:
      file === "building-elpida.html"
        ? diagram("elpida", true)
        : file === "designing-for-failure.html"
          ? diagram("chaos", true)
          : engineeringFigure,
    related: `<section class="related-notes" aria-labelledby="related-heading"><p class="eyebrow">FOLLOW THE THREAD</p><h2 id="related-heading">Keep exploring.</h2><div class="related-grid">${related.map((e) => `<a href="${e.file}"><span class="micro-label">${escape(e.category)}</span><h3>${escape(e.title)}</h3><span class="text-link">Read the note ${arrow}</span></a>`).join("")}</div></section>`,
  };
}

export function enhanceContent(file, content) {
  content = content.replaceAll(
    'href="team.html">Meet the collective',
    'href="contact.html">Start a conversation',
  );
  if (file === "index.html") {
    content = content.replace(
      '<div class="hero-visual">',
      '<div class="hero-visual" data-orbit-focus="web3">',
    );
    content = content.replace(
      'class="orbital" role="img" aria-label="An orbital system around the Elpida mark, connecting AI, Web3 and real-world software"',
      'class="orbital" aria-hidden="true"',
    );
    content = content.replace(
      '</div></div></div><div class="focus-strip">',
      `</div>${orbitExplorer}</div></div><div class="focus-strip">`,
    );
    // Preserve the existing product/status copy while giving cards a richer editorial treatment.
    content = content.replace(
      /<div class="notes-grid">[\s\S]*?<\/div><\/section>/,
      `${journalShowcase}</section>`,
    );
  }
  if (file === "elpida.html" || file === "chaos-engine.html") {
    const elpida = file === "elpida.html";
    content = elpida
      ? content.replace(
          'href="#direction">Explore the direction',
          'href="#product-preview">Try the interface study',
        )
      : content.replace(
          'href="designing-for-failure.html">Read the research note',
          'href="#resilience-sandbox">Try the scenario',
        );
    const insert = content.indexOf('<section id="direction"');
    content =
      content.slice(0, insert) +
      (elpida ? elpidaDemo : chaosDemo) +
      content.slice(insert);
    const ctaStart = content.lastIndexOf('<section class="cta wrap">');
    content =
      content.slice(0, ctaStart) +
      productProgress(elpida) +
      content.slice(ctaStart);
  }
  if (file === "about.html") {
    const insert = content.lastIndexOf('<section class="cta wrap">');
    content =
      content.slice(0, insert) +
      `<section class="section wrap" id="ai-approach"><div class="intro-grid"><div>${eyebrow("AI / AN AMPLIFIER OF JUDGMENT")}<h2>More possibility.<br><span class="muted">The same responsibility.</span></h2></div><div><p class="lead">Intelligent tools can help us explore. Understanding the result remains our work.</p><p>Our approach is to use AI to support research, prototyping, and engineering, while keeping review, testing, and decisions with people. We do not present an AI product as released.</p><a class="text-link" href="why-we-build-static.html">Read about this website’s engineering ${arrow}</a></div></div></section>` +
      content.slice(insert);
  }
  if (file === "team.html") {
    if (people.length) {
      content = content.replace(
        /<section class="section wrap profiles">[\s\S]*?<\/section>/,
        renderPeople(people),
      );
      content = content.replace(
        "We\'re preparing individual profiles. Until names, biographies, and public links are confirmed, the spaces below describe the team structure without assigning identities.",
        "Meet the founders and collaborators shaping the lab, with their published biographies and public links.",
      );
    }
  }
  if (file === "journal.html") {
    const start = content.indexOf('<div class="notes-grid">');
    const end = content.indexOf('<p class="work-note">', start);
    if (start !== -1 && end !== -1)
      content = content.slice(0, start) + journalIndex + content.slice(end);
    content = content.replace(
      "These are product direction articles. They describe ongoing exploration and do not announce released capabilities.",
      "Product notes describe development direction. Inside-the-build notes explain decisions in this website. Product capabilities remain in development.",
    );
  }
  const extras = articleExtras(file);
  if (extras) {
    content = content.replace(
      '<div class="article-layout">',
      `${extras.takeaway}<div class="article-layout">`,
    );
    content = content.replace(
      '<div class="article-body">',
      `<div class="article-body">${extras.figure}`,
    );
    content = content.replace("</article>", `${extras.related}</article>`);
  }
  return content;
}
