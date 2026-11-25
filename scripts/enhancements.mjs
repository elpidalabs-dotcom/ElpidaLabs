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
  web: '<path d="m12 3 8 5v8l-8 5-8-5V8Z"/><path d="m4 8 8 5 8-5m-8 5v8"/>',
  systems: '<path d="M3 12h4l3-7 4 14 3-7h4"/>',
  link: '<path d="M7 17 17 7M7 7h10v10"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18"/>',
};
export const icon = (name) =>
  name === "intelligence"
    ? '<img class="line-icon elpida-spinner" src="assets/elpida-mark.png" width="24" height="24" alt="" aria-hidden="true"/>'
    : `<svg class="line-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${iconPaths[name] || iconPaths.link}</svg>`;
const eyebrow = (text) => `<p class="eyebrow">${text}</p>`;
const button = (href, text, secondary = false) =>
  `<a class="button${secondary ? " secondary" : ""}" href="${href}">${text}${arrow}</a>`;

export const orbitExplorer = `<div class="orbit-explorer" data-orbit-explorer><div class="orbit-switches" role="group" aria-label="Explore the lab’s focus areas"><button type="button" data-orbit-focus="ai" aria-pressed="false">${icon("intelligence")}AI</button><button type="button" data-orbit-focus="web3" aria-pressed="true">${icon("web")}Web3</button><button type="button" data-orbit-focus="systems" aria-pressed="false">${icon("systems")}Systems</button></div><div class="orbit-insight" aria-live="polite" aria-atomic="true"><span class="micro-label" data-orbit-kicker>01 / ORIGINAL PRODUCTS</span><h2 data-orbit-heading>Ideas, onchain.</h2><p data-orbit-description>Explore Elpida: a live mainnet token launchpad for creators and communities, with token discovery, portfolio, and analytics tools.</p><a data-orbit-link class="text-link" href="elpida.html">Explore Elpida ${arrow}</a></div></div>`;

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
  return `<figure class="system-diagram${compact ? " compact-diagram" : ""} ${elpida ? "" : "cyan-diagram"}"><figcaption>${icon(elpida ? "web" : "systems")}<span>${elpida ? "A proposed creator journey" : "A proposed experiment loop"}</span><span class="micro-label">CONCEPT MAP</span></figcaption><ol>${steps.map(([n, title, desc]) => `<li><span class="diagram-number">${n}</span><strong>${title}</strong><span>${desc}</span></li>`).join("")}</ol><p>${elpida ? "The creator journey, simplified. The live mainnet launchpad is available at elpida.fun." : "A learning loop for an isolated environment. This website does not connect to infrastructure."}</p></figure>`;
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
      "Product notes distinguish Elpida’s live mainnet experience from Chaos Engine’s research direction. Inside-the-build notes explain this website’s engineering.",
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
