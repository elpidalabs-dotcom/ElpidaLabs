import { escapeText } from "./content.mjs";

export function chaosArticle(site, arrow) {
  const sections = [
    [
      "overview",
      "What is Chaos Engine?",
      `<p>Chaos Engine is an Elpida Labs research concept focused on software resilience: understanding how an application behaves when a dependency slows down, becomes unavailable, or responds unexpectedly.</p><p>The aim is to make reliability questions easier to investigate through controlled, understandable experiments. It remains research and exploration, rather than a released testing platform.</p>`,
    ],
    [
      "purpose",
      "Why explore failure deliberately?",
      `<p>A system can work well under ordinary conditions while relying on assumptions that are difficult to see. A slow dependency might hold requests open; an unavailable service might leave people without a useful explanation or next step.</p><p>Studying these conditions in an isolated environment can help a team identify those assumptions and decide what to improve. The useful outcome is a clear observation tied to a specific engineering question.</p>`,
    ],
    [
      "workflow",
      "The proposed experiment workflow",
      `<ol><li><strong>State the expectation.</strong> Write down the behavior the application should exhibit under a particular failure condition.</li><li><strong>Define the boundary.</strong> Specify an isolated target, a limited disruption, its duration, and explicit stop conditions.</li><li><strong>Observe the response.</strong> Compare the application’s behavior with the expectation using evidence appropriate to the question.</li><li><strong>Restore and learn.</strong> Verify cleanup, record the result, and identify a change or follow-up experiment.</li></ol><p>This is the intended research workflow, not a list of implemented Chaos Engine capabilities.</p>`,
    ],
    [
      "example",
      "An example reliability question",
      `<p>Suppose an application relies on another service to complete a request. If that service becomes slow, does the application wait indefinitely, show a useful timeout, or provide a bounded fallback?</p><p>A future experiment could compare the observed behavior with a written expectation. It would also need to establish whether the application returns to normal after the disruption ends. This example explains the research direction; it does not report measured results or run an experiment.</p>`,
    ],
    [
      "status",
      "Current development status",
      `<p>Chaos Engine is at the research and concept stage. Its initial audience, experiment types, integrations, deployment model, and reporting format are still being investigated. There is no released downloadable tool, hosted testing service, or public API announced here.</p><p>The next useful milestone is a documented, reproducible experiment in a controlled environment, with a specific hypothesis, trustworthy observations, and verified cleanup. No release date is announced.</p>`,
    ],
    [
      "principles",
      "Boundaries that shape the research",
      `<p>Any future prototype would need explicit authorization, access controls, narrow scope, reliable stop conditions, and a cleanup procedure that can be verified. Initial investigation should favor isolated environments.</p><p>A broader feature set should follow evidence from smaller experiments. The project may become a focused prototype or a narrower tool as the team learns what is useful.</p>`,
    ],
    [
      "reading",
      "Further reading and research feedback",
      `<p>Read <a href="designing-for-failure.html">Designing for failure, before it happens</a> for more background on the questions behind Chaos Engine.</p><p>To discuss a reliability problem or a possible research collaboration, contact <a href="mailto:${escapeText(site.email)}">${escapeText(site.email)}</a>.</p><a class="text-link" href="designing-for-failure.html">Read the research note ${arrow}</a>`,
    ],
  ];
  return `<article class="article wrap product-article chaos-article"><a class="breadcrumb" href="index.html#work">All products</a><p class="eyebrow">ELPIDA LABS / RESEARCH OVERVIEW</p><h1>Chaos Engine<span class="lime">.</span></h1><p class="article-deck">Exploring software resilience through controlled failure experiments.</p><div class="article-meta"><span class="status"><i aria-hidden="true"></i>Research &amp; exploration</span><span>Product information · Updated 25 November 2026</span></div><div class="article-layout"><aside aria-label="Article contents"><p class="eyebrow">IN THIS OVERVIEW</p>${sections.map(([id, title], i) => `<a href="#${id}">${String(i + 1).padStart(2, "0")} / ${title}</a>`).join("")}</aside><div class="article-body">${sections.map(([id, title, body]) => `<section id="${id}"><h2>${title}</h2>${body}</section>`).join("")}</div></div></article>`;
}
