import { writeFileSync } from "node:fs";
const root = new URL("../", import.meta.url);
const write = (file, content) =>
  writeFileSync(new URL(file, root), content.trim() + "\n");
const origin = "https://elpidalabs-dotcom.github.io/ElpidaLabs/";
const logo =
  '<img src="assets/elpida-mark.png" width="40" height="40" alt="" />';
const asterisk =
  '<svg class="asterisk" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d="M32 5v54M5 32h54M13 13l38 38M13 51l38-38" fill="none" stroke="currentColor" stroke-width="5"/></svg>';
const arrow = '<span aria-hidden="true">↗</span>';
const btn = (href, label, outline = false) =>
  `<a class="button ${outline ? "secondary" : ""}" href="${href}">${label}${arrow}</a>`;
const label = (text) => `<p class="eyebrow">${text}</p>`;
const status = (text) =>
  `<span class="status"><i aria-hidden="true"></i>${text}</span>`;
const sectionHead = (n, title, text) =>
  `<div class="section-head"><div>${label(n)}<h2>${title}</h2></div><p>${text}</p></div>`;
const cta = `<section class="cta wrap"><div>${label("GOOD QUESTIONS DESERVE GOOD ENGINEERING")}<h2>What could we<br>build together?</h2></div><div><p>Explore the work. Get to know the thinking.<br>Find your next question.</p>${btn("team.html", "Meet the collective", true)}</div><span class="cta-star" aria-hidden="true">${asterisk}</span></section>`;
const products = `<div class="product-grid"><article class="product-card"><a class="product-art elpida-art" href="elpida.html"><div class="art-rings"></div><img src="assets/elpida-mark.png" alt="" width="240" height="240" loading="lazy"/><span class="art-corner">01 / ELPIDA</span><span class="art-arrow" aria-hidden="true">↗</span></a><div class="card-copy">${status("In development")}<h3><a href="elpida.html">Elpida</a></h3><p>A multichain token launchpad exploring how creators launch and communities discover what comes next.</p><div class="card-foot"><span>WEB3 · PRODUCT R&D</span><a href="elpida.html">Explore product ${arrow}</a></div></div></article><article class="product-card"><a class="product-art chaos-art" href="chaos-engine.html"><div class="chaos-grid"></div><div class="chaos-symbol">⌁</div><span class="signal signal-one"></span><span class="signal signal-two"></span><span class="art-corner">02 / CHAOS ENGINE</span><span class="art-arrow" aria-hidden="true">↗</span></a><div class="card-copy">${status("Research & exploration")}<h3><a href="chaos-engine.html">Chaos Engine</a></h3><p>A resilience-testing concept asking a simple question: how does your software respond when things go wrong?</p><div class="card-foot"><span>DEVTOOLS · SYSTEMS RESEARCH</span><a href="chaos-engine.html">Explore concept ${arrow}</a></div></div></article></div>`;
const notes = `<div class="notes-grid"><a class="note-card" href="building-elpida.html"><span class="note-type">PRODUCT THINKING <span>01</span></span><h3>Building Elpida:<br>from launch to community.</h3><p>The questions shaping a multichain launchpad, and the work still ahead.</p><span class="text-link">Read the article ${arrow}</span></a><a class="note-card" href="designing-for-failure.html"><span class="note-type">ENGINEERING NOTES <span>02</span></span><h3>Designing for failure,<br>before it happens.</h3><p>What we're exploring with Chaos Engine, and why scope and safety come first.</p><span class="text-link">Read the article ${arrow}</span></a></div>`;
function page(file, title, description, content, active = "") {
  const links = [
    ["index.html", "Home"],
    ["index.html#work", "Our work"],
    ["about.html", "The lab"],
    ["journal.html", "Journal"],
    ["team.html", "People"],
  ];
  write(
    file,
    `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/><meta name="theme-color" content="#0b0e0c"/><title>${title} — Elpida Labs</title><meta name="description" content="${description}"/><link rel="canonical" href="${origin}${file === "index.html" ? "" : file}"/><meta property="og:type" content="${file.includes("building-") || file.includes("designing-") ? "article" : "website"}"/><meta property="og:title" content="${title} — Elpida Labs"/><meta property="og:description" content="${description}"/><meta property="og:url" content="${origin}${file === "index.html" ? "" : file}"/><meta property="og:image" content="${origin}assets/social-card.png"/><meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/><meta property="og:image:alt" content="Elpida Labs. Curiosity into code. Code into impact."/><meta name="twitter:card" content="summary_large_image"/><link rel="icon" href="assets/elpida-mark.png" type="image/png"/><link rel="stylesheet" href="styles.css"/><script src="script.js" defer></script><script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "Elpida Labs", url: origin, logo: origin + "assets/elpida-mark.png", sameAs: ["https://github.com/elpidalabs-dotcom/ElpidaLabs"] })}</script></head><body><a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="wrap nav-shell"><a class="brand" href="index.html">${logo}<span>elpida<span class="brand-muted">labs</span><b>.</b></span></a><button class="menu-toggle" aria-controls="primary-nav" aria-expanded="false">Menu <span aria-hidden="true">☰</span></button><nav id="primary-nav" aria-label="Primary navigation">${links.map(([href, name]) => `<a href="${href}"${active === name ? ' aria-current="page"' : ""}>${name}</a>`).join("")}<a class="nav-visit" href="https://elpida.fun">Visit Elpida ${arrow}</a></nav></div></header><main id="main" tabindex="-1">${content}</main><footer class="site-footer"><div class="wrap"><div class="footer-top"><div class="footer-brand"><a class="brand" href="index.html">${logo}<span>elpida<span class="brand-muted">labs</span><b>.</b></span></a><p>Independent minds.<br>Shared momentum.</p></div><nav class="footer-nav" aria-label="Footer navigation"><div class="footer-group"><h2>The lab</h2><a href="about.html">About us</a><a href="team.html">Our people</a><a href="journal.html">Journal</a><a href="https://github.com/elpidalabs-dotcom/ElpidaLabs">GitHub ${arrow}</a></div><div class="footer-group"><h2>Our work</h2><a href="elpida.html">Elpida</a><a href="chaos-engine.html">Chaos Engine</a><a href="https://elpida.fun">Visit elpida.fun ${arrow}</a></div></nav></div><div class="footer-bottom"><span>© ${new Date().getUTCFullYear()} Elpida Labs</span><span class="footer-tagline">Student-founded. Future-focused.</span><a href="#main">Back to top ↑</a></div></div></footer></body></html>`,
  );
}
page(
  "index.html",
  "Curiosity into code. Code into impact.",
  "A student-founded technology collective exploring AI, Web3 and useful software. Discover Elpida, Chaos Engine and the thinking behind our work.",
  `
<section class="hero wrap"><div class="hero-topline"><span><i class="live-dot" aria-hidden="true"></i> INDEPENDENT MINDS. SHARED MOMENTUM.</span><span>TECHNOLOGY / WITH INTENT</span></div><div class="hero-grid"><div class="hero-copy">${label("A STUDENT-FOUNDED TECHNOLOGY LAB")}<h1>Curiosity into<br><em>code.</em> Code<br>into <span class="serif">impact.</span></h1><p>We turn ambitious questions into thoughtful technology. Exploring AI, Web3, and the systems that connect ideas to the real world.</p><div class="actions">${btn("#work", "Explore our work")}${btn("https://elpida.fun", "Visit elpida.fun", true)}</div><div class="hero-note"><span class="tiny-mark">${asterisk}</span><span>Small team. Open minds.<br><strong>Always a work in progress.</strong></span></div></div><div class="hero-visual"><div class="orbital" role="img" aria-label="An orbital system around the Elpida mark, connecting AI, Web3 and real-world software"><div class="orbital-grid"></div><div class="orbit-stage"><div class="orbit orbit-a"></div><div class="orbit orbit-b"></div><div class="orbit orbit-c"></div><div class="orbit-path path-a"><span class="satellite"></span></div><div class="orbit-path path-b"><span class="satellite"></span></div><div class="core">${logo}</div><span class="orbit-tag tag-ai">01 <b>AI</b></span><span class="orbit-tag tag-web">02 <b>WEB3</b></span><span class="orbit-tag tag-real">03 <b>REAL WORLD</b></span><span class="coordinate coordinate-a">EL / 001</span><span class="coordinate coordinate-b">IDEAS IN MOTION</span></div></div><div class="visual-caption"><span><i class="live-dot" aria-hidden="true"></i> THE ELPIDA ORBIT</span><button class="motion-toggle" aria-pressed="false">Pause orbit Ⅱ</button></div></div></div><div class="focus-strip"><span>THINK DEEPLY.</span><b>${asterisk}</b><span>BUILD THOUGHTFULLY.</span><b>${asterisk}</b><span>LEARN CONTINUOUSLY.</span><b>${asterisk}</b></div></section>
<section class="section wrap intro">${label("01 / THE WAY WE THINK")}<div class="intro-grid"><h2>Big questions.<br><span class="muted">A builder’s mindset.</span></h2><div><p class="lead">Good technology starts with curiosity. Meaningful technology takes care, craft, and the willingness to keep learning.</p><p>We're a collective of Computer Science students researching, designing, and engineering original products. We pair solid fundamentals with modern tools to move ideas forward.</p><a class="text-link" href="about.html">Inside the lab ${arrow}</a></div></div></section>
<section id="work" class="section wrap">${sectionHead("02 / EXPLORATIONS TAKING SHAPE", 'Our work.<br><span class="muted">A little closer to tomorrow.</span>', "Original ideas at different stages of development. Clear about the ambition. Honest about what is still being built.")}${products}<div class="work-note"><span>↳</span><p>Built in the open. Both projects are evolving; descriptions outline direction, not a promise of available features.</p></div></section>
<section class="capabilities section"><div class="wrap">${sectionHead("03 / FROM QUESTION TO POSSIBILITY", "Curious by nature.<br>Practical by design.", "We develop our own products and explore collaborations around useful, technically ambitious problems.")}<div class="capability-grid"><article><span>01 / INTELLIGENCE</span><h3>AI & automation</h3><p>Exploring tools that simplify workflows and make complex information more useful.</p></article><article><span>02 / CONNECTION</span><h3>Web3 & applications</h3><p>Researching onchain experiences and building considered interfaces for the web.</p></article><article><span>03 / FOUNDATION</span><h3>Systems & research</h3><p>Prototyping ideas, understanding constraints, and learning how software behaves.</p></article></div></div></section>
<section class="section wrap">${sectionHead("04 / NOTES FROM THE LAB", 'The thinking<br><span class="muted">behind the building.</span>', "Product direction, engineering questions, and the decisions still ahead. Explore our first two product notes.")}${notes}</section>${cta}`,
  "Home",
);
const productPage = (kind) => {
  const elpida = kind === "Elpida";
  const name = elpida ? "Elpida" : "Chaos Engine";
  page(
    elpida ? "elpida.html" : "chaos-engine.html",
    name,
    elpida
      ? "Elpida is a multichain token launchpad in development. Explore its intended direction, open questions and development status."
      : "Chaos Engine is an early resilience-testing research concept. Explore the proposed workflow, safety principles and questions still being investigated.",
    `
 <section class="page-hero wrap"><a class="breadcrumb" href="index.html#work">← All explorations</a><div class="product-hero-grid"><div>${label(elpida ? "01 / WEB3 · MULTICHAIN" : "02 / DEVTOOLS · RESILIENCE")}${status(elpida ? "In development" : "Research & exploration")}<h1>${name}${elpida ? '<span class="lime">.</span>' : ""}</h1><p class="lead">${elpida ? "A new starting point<br>for onchain ideas." : "Understand the failure.<br>Design the recovery."}</p><p>${elpida ? "A multichain token launchpad exploring better ways for creators to launch and communities to discover and grow around onchain projects." : "A planned testing platform exploring how teams could learn about software reliability through controlled failure experiments."}</p><div class="actions">${btn(elpida ? "https://elpida.fun" : "designing-for-failure.html", elpida ? "Visit elpida.fun" : "Read the research note")}${btn("#direction", "Explore the direction", true)}</div></div><div class="product-art ${elpida ? "elpida-art" : "chaos-art"} detail-art" aria-hidden="true">${elpida ? '<div class="art-rings"></div><img src="assets/elpida-mark.png" width="280" height="280" alt=""/>' : '<div class="chaos-grid"></div><span class="chaos-symbol">⌁</span><span class="signal signal-one"></span><span class="signal signal-two"></span>'}<span class="art-corner">${elpida ? "CREATE / DISCOVER / CONNECT" : "QUESTION / TEST / UNDERSTAND"}</span></div></div></section>
 <section id="direction" class="section wrap"><div class="intro-grid"><div>${label("THE PRODUCT DIRECTION")}<h2>${elpida ? "From a token launch<br>to a lasting community." : "A failure can be<br>a useful question."}</h2></div><div><p class="lead">${elpida ? "Launching is a moment. Building something people can understand and participate in is a longer journey." : "Software depends on systems that can slow down, become unavailable, or behave unexpectedly."}</p><p>${elpida ? "Elpida is exploring a connected experience for creation, discovery, and community growth across chains. The aim is to make the journey easier to understand without hiding the complexity and responsibility that come with onchain participation." : "Chaos Engine is a research concept for making those conditions easier to investigate. The intended direction is a deliberate workflow: define expected behavior, introduce a bounded disruption, observe the result, and use the findings to improve the system."}</p></div></div><div class="capability-grid bordered">${(elpida
   ? [
       [
         "Create",
         "Investigate the steps, information, and controls a creator would need to prepare a token launch.",
       ],
       [
         "Discover",
         "Explore how people could understand projects, compare context, and find communities across supported networks.",
       ],
       [
         "Grow",
         "Consider what creators and communities need after launch, including clearer project information and ongoing communication.",
       ],
     ]
   : [
       [
         "Define",
         "Start with a specific reliability question and an explicit description of expected behavior.",
       ],
       [
         "Experiment",
         "Explore bounded disruptions such as latency or dependency failures in an isolated test environment.",
       ],
       [
         "Learn",
         "Compare observations with expectations and document changes worth testing next.",
       ],
     ]
 )
   .map(
     ([t, p], i) =>
       `<article><span>0${i + 1} / PROPOSED DIRECTION</span><h3>${t}</h3><p>${p}</p></article>`,
   )
   .join("")}</div></section>
 <section class="section wrap development"><div>${label("AN HONEST DEVELOPMENT NOTE")}<h2>Ambition, with<br><span class="muted">the status attached.</span></h2></div><div><h3>${elpida ? "In development" : "A concept, still taking shape"}</h3><p>${elpida ? "The launchpad described here is under development. Supported chains, token standards, launch mechanisms, fees, security reviews, and availability have not been confirmed in this website. The external Elpida site may reflect a different development stage; check its own current information before participating." : "There is no released Chaos Engine platform presented here. Experiment types, integrations, deployment options, reporting, and a release timeline are not confirmed. The research may lead to a prototype, a narrower tool, or a different approach."}</p><p>${elpida ? "This page does not announce a token sale, financial return, audited deployment, or a launch date. The next useful milestone is a clearly scoped, testable product experience." : "A future prototype would need explicit scope, access controls, stop conditions, and reliable cleanup before any real system experiments. The illustrative graphics on this site do not run tests or connect to infrastructure."}</p><a class="text-link" href="${elpida ? "building-elpida.html" : "designing-for-failure.html"}">Read the detailed product note ${arrow}</a></div></section>${cta}`,
    "Our work",
  );
};
productPage("Elpida");
productPage("Chaos Engine");
page(
  "about.html",
  "The lab",
  "Meet the student-founded Elpida Labs collective: our approach to original products, practical engineering and continuous learning.",
  `<section class="page-hero wrap">${label("THE LAB / INDEPENDENT BY NATURE")}<h1>Ideas deserve<br>to be <span class="serif lime">built.</span></h1><div class="intro-grid"><p class="lead">A few curious minds.<br>A shared impulse to make things.</p><div><p>Elpida Labs is a student-founded technology collective. We are Computer Science students exploring the space between an interesting question and a useful piece of software.</p><p>Our work spans AI, Web3, and real-world applications. We develop original product ideas and explore engineering collaborations, with an emphasis on understanding the problem before choosing the technology.</p></div></div></section><section class="manifesto"><div class="wrap">${label("OUR STARTING POINT")}<p>Build with curiosity.<br>Question with care.<br><span>Learn by doing.</span></p><span class="manifesto-star" aria-hidden="true">${asterisk}</span></div></section><section class="section wrap">${sectionHead("OUR OPERATING PRINCIPLES", "Small lab.<br>Deliberate choices.", "These are the principles guiding our work, from the earliest sketch to the decisions that shape a product.")}<div class="capability-grid"><article><span>01</span><h3>Understand the work.</h3><p>Modern AI tools can amplify our effort. We remain responsible for understanding, reviewing, and testing what we build.</p></article><article><span>02</span><h3>Make progress legible.</h3><p>Describe what exists, what is being explored, and what has not been decided. A clear development status is part of the product.</p></article><article><span>03</span><h3>Keep people in view.</h3><p>Useful software begins with a real problem. Thoughtful interfaces, accessibility, and honest communication belong in the process.</p></article></div></section><section class="section wrap">${sectionHead("THE CURRENT EXPLORATIONS", "Two questions.<br>Room to discover.", "Elpida explores onchain creation and discovery. Chaos Engine explores how software could become more resilient.")}${products}</section>${cta}`,
  "The lab",
);
page(
  "team.html",
  "People",
  "The people structure behind Elpida Labs: expandable founder, co-founder and collaborator profiles, ready for verified biographies and links.",
  `<section class="page-hero wrap">${label("THE COLLECTIVE / PEOPLE BEFORE TITLES")}<h1>Different minds.<br>One <span class="serif lime">lab.</span></h1><div class="intro-grid"><p class="lead">Independent thinkers.<br>Collective builders.</p><div><p>Elpida Labs brings together student founders and collaborators with different perspectives and a shared interest in useful technology.</p><p>We're preparing individual profiles. Until names, biographies, and public links are confirmed, the spaces below describe the team structure without assigning identities.</p></div></div></section><section class="section wrap profiles">${label("EXPLORE THE TEAM STRUCTURE")}${[
    [
      "01",
      "Founder",
      "Founding direction",
      "A space for the founder’s introduction, areas of focus, and perspective on the lab.",
    ],
    [
      "02",
      "Co-founder",
      "Shared leadership",
      "A space for the co-founder’s introduction, technical interests, and role in shaping the work.",
    ],
    [
      "03",
      "Collaborators",
      "Contributions across disciplines",
      "A space for contributors working across research, design, and engineering. Individual entries can be added as participation and details are confirmed.",
    ],
  ]
    .map(
      ([n, role, focus, desc]) =>
        `<details class="profile"><summary><span class="profile-icon" aria-hidden="true">${n === "01" ? asterisk : n === "02" ? "⌘" : "↗"}</span><span><span class="eyebrow">${n} / ${focus}</span><span class="profile-title">${role}</span></span><span class="profile-state">Profile forthcoming</span><span class="expand" aria-hidden="true">+</span></summary><div class="profile-body"><p>${desc}</p><dl><div><dt>Name & biography</dt><dd>To be confirmed</dd></div><div><dt>Public profile & contributions</dt><dd>Links will be added when confirmed.</dd></div></dl></div></details>`,
    )
    .join(
      "",
    )}<p class="profile-note">No names, portraits, credentials, or individual social accounts have been published yet.</p></section><section class="section wrap"><div class="intro-grid"><h2>Know us through<br><span class="muted">the work.</span></h2><div><p>The best introduction to the collective is the questions we're investigating and the things we're building.</p>${btn("index.html#work", "Explore our products")}${btn("https://github.com/elpidalabs-dotcom/ElpidaLabs", "View this repository", true)}</div></div></section>`,
  "People",
);
page(
  "journal.html",
  "Journal",
  "Product direction and engineering notes from Elpida Labs. Read about Elpida and the early Chaos Engine research concept.",
  `<section class="page-hero wrap">${label("THE JOURNAL / THINKING IN PUBLIC")}<h1>Before the launch.<br>Behind the <span class="serif lime">build.</span></h1><p class="lead narrow">A place for product direction, engineering questions, and the work that happens between an idea and a release.</p></section><section class="section wrap journal-list">${notes}<p class="work-note">These are product direction articles. They describe ongoing exploration and do not announce released capabilities.</p></section>${cta}`,
  "Journal",
);
function article(file, title, category, intro, sections, product) {
  page(
    file,
    title,
    intro,
    `<article class="article wrap"><a class="breadcrumb" href="journal.html">← Back to journal</a>${label(category)}<h1>${title}</h1><p class="article-deck">${intro}</p><div class="article-meta"><span>ELPIDA LABS / PRODUCT NOTES</span>${status("Direction, not a release announcement")}</div><div class="article-layout"><aside aria-label="Article contents"><p class="eyebrow">IN THIS NOTE</p>${sections.map(([t], i) => `<a href="#section-${i + 1}">${String(i + 1).padStart(2, "0")} / ${t}</a>`).join("")}</aside><div class="article-body">${sections.map(([t, paras], i) => `<section id="section-${i + 1}"><h2>${t}</h2>${paras.map((p) => `<p>${p}</p>`).join("")}</section>`).join("")}<div class="article-end">${label("CONTINUE EXPLORING")}${btn(product[0], product[1])}<a class="text-link" href="journal.html">All journal notes ${arrow}</a></div></div></div></article>`,
    "Journal",
  );
}
article(
  "building-elpida.html",
  "Building Elpida: from launch to community.",
  "PRODUCT THINKING / ELPIDA",
  "Elpida is a multichain token launchpad in development. This note explains the intended product direction, the questions that matter, and what remains unconfirmed.",
  [
    [
      "The question behind Elpida",
      [
        "What would it take to make an onchain launch easier to understand, both for the person creating a project and for the community discovering it? That is the starting question behind Elpida.",
        "A token launch brings together technical decisions, project information, and community expectations. A useful product needs to explain those decisions clearly rather than treat the launch transaction as the whole experience. Elpida is exploring how that broader journey could fit together.",
      ],
    ],
    [
      "Three connected journeys",
      [
        "The first proposed journey is creation: helping a creator understand the information and decisions involved in preparing a launch. This could include project context, network selection, and clear review steps. These are design questions, not confirmed interface features.",
        "The second is discovery: considering how participants could find projects and understand their context across chains. Consistent information and clear network boundaries would matter more than adding a long list of unsupported claims.",
        "The third is continuity: thinking about what happens after a launch. Community information, project communication, and a coherent place to return could support a more useful experience. The scope of any such features is still being determined.",
      ],
    ],
    [
      "Why multichain requires care",
      [
        "Different networks have different transaction behavior, fees, tooling, and operational constraints. A multichain interface should make those differences visible at the moment they affect a decision.",
        "The word multichain describes the direction of the project. This website does not confirm support for any named network, bridge, wallet, token standard, or launch mechanism. Those choices need implementation work and explicit documentation before they can be treated as available capabilities.",
      ],
    ],
    [
      "What must be resolved",
      [
        "The product still needs a defined initial scope, a validated creator journey, and an implementation that can be tested against that scope. Security review, permissions, transaction clarity, failure handling, and operational readiness would need attention before any public launch functionality could be presented as ready.",
        "Fees, supported networks, release dates, and availability are not announced here. Nor does this article claim that any deployment has been audited or that participation provides a financial return. A convincing prototype and a documented set of constraints are more useful next steps than an unsupported timeline.",
      ],
    ],
    [
      "Where to follow the product",
      [
        'The external product destination is <a href="https://elpida.fun">elpida.fun</a>. Its current content and availability may change independently of this company website. Check the product site for its own current status and confirm any claims before taking action.',
        "As the work becomes more concrete, these notes can be updated with verified capabilities, documented limitations, and actual milestones. For now, Elpida remains a product in development, with a clear question and an evolving path toward an answer.",
      ],
    ],
  ],
  ["elpida.html", "Explore Elpida"],
);
article(
  "designing-for-failure.html",
  "Designing for failure, before it happens.",
  "ENGINEERING NOTES / CHAOS ENGINE",
  "Chaos Engine is an early research concept for resilience testing. We are exploring how controlled experiments could help teams understand failure and recovery before an incident.",
  [
    [
      "Start with a question",
      [
        "A dependency slows down. A request times out. A service becomes unavailable. These conditions can reveal assumptions that are hard to see during ordinary operation.",
        "Chaos Engine begins with a question: could a deliberate, understandable experiment help a team learn how its software behaves under pressure? The concept is about learning from controlled conditions. It is not a released testing service or a claim that failure can be eliminated.",
      ],
    ],
    [
      "A proposed experiment loop",
      [
        "A useful experiment would begin with a specific expectation. For example: if a dependency responds slowly, does the application show a useful error and recover once normal conditions return? The expected result should be written down before introducing a disruption.",
        "Next would come a bounded test in an isolated environment. Latency and dependency unavailability are examples of conditions worth researching, not a list of implemented Chaos Engine features.",
        "Finally, the team would compare the observed behavior with its expectation, record what it learned, and decide what to change or test next. A report is useful only if the observations are trustworthy and the next action is understandable.",
      ],
    ],
    [
      "Safety is part of the design",
      [
        "A future prototype would need explicit authorization, a narrow target, a defined duration, and a reliable way to stop and clean up an experiment. The initial research direction should favor isolated test environments.",
        "Access controls, clear experiment boundaries, and recovery checks would need to be designed and validated. No production-readiness or safety guarantees are made here. The terminal-like and signal graphics used on this website are illustrations; they do not connect to systems or inject failures.",
      ],
    ],
    [
      "What is still open",
      [
        "The appropriate first audience, deployment model, observability inputs, integrations, and experiment types remain research questions. There is no confirmed downloadable tool, hosted platform, public API, or release schedule.",
        "The idea may become a narrow prototype before it becomes a platform. That would let the team evaluate whether a simple experiment loop produces useful findings without assuming a large feature set from the beginning.",
      ],
    ],
    [
      "What progress would look like",
      [
        "A meaningful first milestone would be a documented, reproducible experiment in a controlled environment: a stated hypothesis, a bounded disruption, reliable observations, and verified cleanup.",
        "Until such work is demonstrated, Chaos Engine should be understood as a concept under exploration. Future notes can describe actual prototypes and measured results as they exist. This article describes the intended research direction, not work claimed to have been completed.",
      ],
    ],
  ],
  ["chaos-engine.html", "Explore Chaos Engine"],
);
page(
  "404.html",
  "Page not found",
  "This page could not be found. Return to Elpida Labs to explore our products and journal.",
  `<section class="page-hero wrap">${label("404 / A SMALL DETOUR")}<h1>A little outside<br>the <span class="serif lime">orbit.</span></h1><p>The page you’re looking for could not be found.</p><a class="button" href="/ElpidaLabs/">Return to the lab ${arrow}</a></section>`,
);
// GitHub Pages serves this document at the original missing URL, including nested paths.
// A fixed base keeps all fallback assets and navigation within the project site.
const { readFileSync } = await import("node:fs");
write(
  "404.html",
  readFileSync(new URL("404.html", root), "utf8").replace(
    "<head>",
    '<head><base href="/ElpidaLabs/"/><meta name="robots" content="noindex"/>',
  ),
);
write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${["", "elpida.html", "chaos-engine.html", "about.html", "team.html", "journal.html", "building-elpida.html", "designing-for-failure.html"].map((p) => `<url><loc>${origin}${p}</loc></url>`).join("")}</urlset>`,
);
write(".nojekyll", "");
console.log("Generated 8 pages, 404 fallback, and sitemap.");
