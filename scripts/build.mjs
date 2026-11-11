import {
  articles,
  articleRecords,
  renderContentArticleBody,
  escapeText,
  mediaPath,
} from "./content.mjs";
import { writeFileSync, readFileSync, rmSync } from "node:fs";
import { createHash } from "node:crypto";
import { mkdirSync } from "node:fs";
import { output, origin, basePath } from "./deployment.mjs";
import {
  site,
  enhanceContent,
  contactPage,
  journalEntries,
} from "./enhancements.mjs";
const generatedPages = [];
const { key: indexNowKey } = JSON.parse(
  readFileSync(new URL("../content/indexnow.json", import.meta.url), "utf8"),
);
const assetVersion = createHash("sha256")
  .update(
    [
      "styles.css",
      "experience.css",
      "script.js",
      "enhancements.js",
      "demo-model.js",
    ]
      .map((file) =>
        readFileSync(new URL("../" + file, import.meta.url), "utf8").replace(
          /\r\n/g,
          "\n",
        ),
      )
      .join(""),
  )
  .digest("hex")
  .slice(0, 12);
const root = new URL("../", import.meta.url);
mkdirSync(output, { recursive: true });
const write = (file, content) =>
  writeFileSync(new URL(file, output), content.trim() + "\n");
for (const item of articleRecords.filter((item) => !item.published)) {
  // Validated slugs cannot target another route or leave the output directory.
  rmSync(new URL(item.file, output), { force: true });
}
const logo =
  '<img src="assets/elpida-mark.png" width="40" height="40" alt="" />';
const asterisk =
  '<svg class="asterisk" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d="M32 5v54M5 32h54M13 13l38 38M13 51l38-38" fill="none" stroke="currentColor" stroke-width="5"/></svg>';
const arrow =
  '<svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 19 19 5M5 5h14v14"/></svg>';
const arrowUp = arrow.replace("M5 19 19 5M5 5h14v14", "M12 20V4M5 11l7-7 7 7");
const btn = (href, label, outline = false) =>
  `<a class="button ${outline ? "secondary" : ""}" href="${href}">${label}${arrow}</a>`;
const label = (text) => `<p class="eyebrow">${text}</p>`;
const status = (text) =>
  `<span class="status"><i aria-hidden="true"></i>${text}</span>`;
const sectionHead = (n, title, text) =>
  `<div class="section-head"><div>${label(n)}<h2>${title}</h2></div><p>${text}</p></div>`;
const cta = `<section class="cta wrap"><div>${label("GOOD QUESTIONS DESERVE GOOD ENGINEERING")}<h2>What could we<br>build together?</h2></div><div><p>Explore the work. Get to know the thinking.<br>Find your next question.</p>${btn("team.html", "Meet the collective", true)}</div><span class="cta-star" aria-hidden="true">${asterisk}</span></section>`;
const products = `<div class="product-grid"><article class="product-card"><a class="product-art elpida-art" href="elpida.html"><div class="art-rings"></div><img src="assets/elpida-mark.png" alt="" width="240" height="240" loading="lazy"/><span class="art-corner">01 / ELPIDA</span><span class="art-arrow" aria-hidden="true">${arrow}</span></a><div class="card-copy">${status("Live on testnets")}<h3><a href="elpida.html">Elpida</a></h3><p>Our multichain token launchpad, live on five public testnets at elpida.fun. Mainnet follows an independent security audit.</p><div class="card-foot"><span>WEB3 · OUR FIRST PRODUCT</span><a href="elpida.html">Explore product ${arrow}</a></div></div></article><article class="product-card"><a class="product-art chaos-art" href="chaos-engine.html"><div class="chaos-grid"></div><div class="chaos-symbol">⌁</div><span class="signal signal-one"></span><span class="signal signal-two"></span><span class="art-corner">02 / CHAOS ENGINE</span><span class="art-arrow" aria-hidden="true">${arrow}</span></a><div class="card-copy">${status("Research & exploration")}<h3><a href="chaos-engine.html">Chaos Engine</a></h3><p>A resilience-testing concept asking a simple question: how does your software respond when things go wrong?</p><div class="card-foot"><span>DEVTOOLS · SYSTEMS RESEARCH</span><a href="chaos-engine.html">Explore concept ${arrow}</a></div></div></article></div>`;
const notes = `<div class="notes-grid"><a class="note-card" href="building-elpida.html"><span class="note-type">PRODUCT THINKING <span>01</span></span><h3>Building Elpida:<br>from launch to community.</h3><p>The questions shaping a multichain launchpad, and the work still ahead.</p><span class="text-link">Read the article ${arrow}</span></a><a class="note-card" href="designing-for-failure.html"><span class="note-type">ENGINEERING NOTES <span>02</span></span><h3>Designing for failure,<br>before it happens.</h3><p>What we're exploring with Chaos Engine, and why scope and safety come first.</p><span class="text-link">Read the article ${arrow}</span></a></div>`;
function page(file, title, description, content, active = "") {
  content = enhanceContent(file, content);
  const metadataTitle = escapeText(title);
  const metadataDescription = escapeText(description);
  generatedPages.push(file);
  const entry = journalEntries.find((item) => item.file === file);
  const readingMinutes = Math.max(
    1,
    Math.ceil(content.replace(/<[^>]*>/g, " ").split(/\s+/).length / 220),
  );
  if (entry)
    content = content.replace(
      "ELPIDA LABS / PRODUCT NOTES",
      "ELPIDA LABS / " +
        (entry.tag === "engineering" ? "INSIDE THE BUILD" : "PRODUCT NOTES") +
        " · " +
        readingMinutes +
        " MIN READ",
    );
  const shareImage =
    file === "elpida.html" || file === "building-elpida.html"
      ? "social-elpida.png"
      : file === "chaos-engine.html" || file === "designing-for-failure.html"
        ? "social-chaos.png"
        : "social-card.png";
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": origin + "#organization",
        name: "Elpida Labs",
        url: origin,
        email: site.email,
        logo: {
          "@type": "ImageObject",
          url: origin + "assets/elpida-mark.png",
          width: 384,
          height: 384,
        },
        description:
          "An independent technology lab founded by Computer Science students, exploring AI, Web3 and software systems. Builder of Elpida (elpida.fun).",
        sameAs: [site.repository],
      },
      {
        "@type": "WebSite",
        "@id": origin + "#website",
        name: "Elpida Labs",
        url: origin,
        inLanguage: "en",
        publisher: { "@id": origin + "#organization" },
      },
      {
        "@type":
          file === "about.html"
            ? "AboutPage"
            : file === "contact.html"
              ? "ContactPage"
              : file === "journal.html"
                ? "CollectionPage"
                : "WebPage",
        "@id": origin + (file === "index.html" ? "" : file) + "#webpage",
        headline: title,
        name: title,
        description,
        inLanguage: "en",
        url: origin + (file === "index.html" ? "" : file),
        isPartOf: { "@id": origin + "#website" },
        about: { "@id": origin + "#organization" },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: origin + "assets/" + shareImage,
          width: 1200,
          height: 630,
        },
        ...(file !== "index.html" && file !== "404.html"
          ? { breadcrumb: { "@id": origin + file + "#breadcrumb" } }
          : {}),
        ...(entry
          ? {
              publisher: { "@id": origin + "#organization" },
              image: origin + "assets/" + shareImage,
            }
          : {}),
      },
      ...(entry
        ? [
            {
              "@type": "Article",
              "@id": origin + file + "#article",
              headline: title,
              description,
              inLanguage: "en",
              mainEntityOfPage: { "@id": origin + file + "#webpage" },
              author: { "@id": origin + "#organization" },
              publisher: { "@id": origin + "#organization" },
              image: origin + "assets/" + shareImage,
            },
          ]
        : []),
      ...(file !== "index.html" && file !== "404.html"
        ? [
            {
              "@type": "BreadcrumbList",
              "@id": origin + file + "#breadcrumb",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: origin,
                },
                ...(entry
                  ? [
                      {
                        "@type": "ListItem",
                        position: 2,
                        name: "Journal",
                        item: origin + "journal.html",
                      },
                    ]
                  : []),
                {
                  "@type": "ListItem",
                  position: entry ? 3 : 2,
                  name: title,
                  item: origin + file,
                },
              ],
            },
          ]
        : []),
    ],
  };
  if (file !== "index.html" && file !== "404.html") {
    content =
      `<nav class="breadcrumbs wrap" aria-label="Breadcrumb"><ol><li><a href="index.html">Home</a></li>${entry ? '<li><a href="journal.html">Journal</a></li>' : ""}<li><span aria-current="page">${escapeText(title)}</span></li></ol></nav>` +
      content;
  }
  const links = [
    ["index.html", "Home"],
    ["index.html#work", "Our work"],
    ["about.html", "The lab"],
    ["journal.html", "Journal"],
    ["team.html", "People"],
    ["contact.html", "Contact"],
  ];
  write(
    file,
    `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/><meta name="theme-color" content="#0b0e0c"/><title>${metadataTitle} — Elpida Labs</title><meta name="description" content="${metadataDescription}"/><link rel="canonical" href="${origin}${file === "index.html" ? "" : file}"/><meta property="og:type" content="${entry ? "article" : "website"}"/><meta property="og:title" content="${metadataTitle} — Elpida Labs"/><meta property="og:description" content="${metadataDescription}"/><meta property="og:url" content="${origin}${file === "index.html" ? "" : file}"/><meta property="og:image" content="${origin}assets/${shareImage}"/><meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/><meta property="og:image:alt" content="Elpida Labs. Curiosity into code. Code into impact."/><meta property="og:site_name" content="Elpida Labs"/><meta property="og:locale" content="en_US"/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content="${metadataTitle} — Elpida Labs"/><meta name="twitter:description" content="${metadataDescription}"/><meta name="twitter:image" content="${origin}assets/${shareImage}"/><meta name="twitter:image:alt" content="Elpida Labs. Curiosity into code. Code into impact."/><meta name="robots" content="${file === "404.html" ? "noindex, follow" : "index, follow, max-image-preview:large"}"/><link rel="icon" href="assets/favicon-96.png" type="image/png" sizes="96x96"/><link rel="apple-touch-icon" href="assets/apple-touch-icon.png" sizes="180x180"/><link rel="preload" href="assets/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin/><link rel="stylesheet" href="styles.css?v=${assetVersion}"/><link rel="stylesheet" href="experience.css?v=${assetVersion}"/><script src="script.js?v=${assetVersion}" defer></script><script type="module" src="enhancements.js?v=${assetVersion}"></script><script type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, "\\u003c")}</script></head><body data-page="${file.replace(".html", "")}"><a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="wrap nav-shell"><a class="brand" href="index.html">${logo}<span>elpida<span class="brand-muted">labs</span><b>.</b></span></a><button class="menu-toggle" aria-controls="primary-nav" aria-expanded="false">Menu <svg class="menu-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M3 6h14M3 10h14M3 14h14" fill="none" stroke="currentColor" stroke-width="1.4"/></svg></button><nav id="primary-nav" aria-label="Primary navigation">${links.map(([href, name]) => `<a href="${href}"${active === name ? ' aria-current="page"' : ""}>${name}</a>`).join("")}<a class="nav-visit" href="https://elpida.fun">Visit Elpida ${arrow}</a></nav></div></header><main id="main" tabindex="-1">${content}</main><footer class="site-footer"><div class="wrap"><div class="footer-top"><div class="footer-brand"><a class="brand" href="index.html">${logo}<span>elpida<span class="brand-muted">labs</span><b>.</b></span></a><p>Independent minds.<br>Shared momentum.</p></div><nav class="footer-nav" aria-label="Footer navigation"><div class="footer-group"><h2>The lab</h2><a href="about.html">About us</a><a href="team.html">Our people</a><a href="journal.html">Journal</a><a href="contact.html">Contact</a><a href="https://github.com/elpidalabs-dotcom/ElpidaLabs">GitHub ${arrow}</a></div><div class="footer-group"><h2>Our work</h2><a href="elpida.html">Elpida</a><a href="chaos-engine.html">Chaos Engine</a><a href="https://elpida.fun">Visit elpida.fun ${arrow}</a></div></nav></div><div class="footer-bottom"><span>© ${new Date().getUTCFullYear()} Elpida Labs · builder of <a href="https://elpida.fun">Elpida</a> · not yet incorporated</span><span class="footer-tagline">Founded by students. Built to last.</span><a href="#main">Back to top ${arrowUp}</a></div></div></footer></body></html>`,
  );
}
page(
  "index.html",
  "AI, Web3 & Software Research",
  "An independent technology lab founded by Computer Science students. We build Elpida, a multichain token launchpad, and research Chaos Engine.",
  `
<section class="hero wrap"><div class="hero-topline"><span><i class="live-dot" aria-hidden="true"></i> INDEPENDENT MINDS. SHARED MOMENTUM.</span><span>TECHNOLOGY / WITH INTENT</span></div><div class="hero-grid"><div class="hero-copy">${label("AN INDEPENDENT TECHNOLOGY LAB")}<h1>Curiosity into<br><em>code.</em> Code<br>into <span class="serif">impact.</span></h1><p>We turn ambitious questions into thoughtful technology. Exploring AI, Web3, and the systems that connect ideas to the real world.</p><div class="actions">${btn("#work", "Explore our work")}${btn("https://elpida.fun", "Visit elpida.fun", true)}</div><div class="hero-note"><span class="tiny-mark">${asterisk}</span><span>Small team. Open minds.<br><strong>Always a work in progress.</strong></span></div></div><div class="hero-visual"><div class="orbital" role="img" aria-label="An orbital system around the Elpida mark, connecting AI, Web3 and real-world software"><div class="orbital-grid"></div><svg class="orbit-field" viewBox="0 0 500 500" aria-hidden="true" focusable="false"><circle class="field-track" cx="250" cy="250" r="220"/><circle class="field-ticks" cx="250" cy="250" r="202"/><path class="field-arc" d="M250 30a220 220 0 0 1 190 110"/><path class="field-crosshair" d="M250 13v22M250 465v22M13 250h22M465 250h22"/></svg><div class="orbit-stage"><div class="orbit orbit-a"></div><div class="orbit orbit-b"></div><div class="orbit orbit-c"></div><div class="orbit-path path-a"><span class="satellite"></span></div><div class="orbit-path path-b"><span class="satellite"></span></div><div class="orbit-path path-c"><span class="satellite"></span></div><div class="core">${logo}</div><span class="orbit-tag tag-ai">01 <b>AI</b></span><span class="orbit-tag tag-web">02 <b>WEB3</b></span><span class="orbit-tag tag-real">03 <b>REAL WORLD</b></span><span class="coordinate coordinate-a">EL / 001</span><span class="coordinate coordinate-b">IDEAS IN MOTION</span></div></div><div class="visual-caption"><span><i class="live-dot" aria-hidden="true"></i> THE ELPIDA ORBIT</span><button class="motion-toggle" aria-pressed="false">Pause orbit</button></div></div></div><div class="focus-strip"><span>THINK DEEPLY.</span><b>${asterisk}</b><span>BUILD THOUGHTFULLY.</span><b>${asterisk}</b><span>LEARN CONTINUOUSLY.</span><b>${asterisk}</b></div></section>
<section class="section wrap intro">${label("01 / THE WAY WE THINK")}<div class="intro-grid"><h2>Big questions.<br><span class="muted">A builder’s mindset.</span></h2><div><p class="lead">Good technology starts with curiosity. Meaningful technology takes care, craft, and the willingness to keep learning.</p><p>We're a collective of Computer Science students researching, designing, and engineering original products. We pair solid fundamentals with modern tools to move ideas forward.</p><a class="text-link" href="about.html">Inside the lab ${arrow}</a></div></div></section>
<section id="work" class="section wrap">${sectionHead("02 / EXPLORATIONS TAKING SHAPE", 'Our work.<br><span class="muted">A little closer to tomorrow.</span>', "Original ideas at different stages of development. Clear about the ambition. Honest about what is still being built.")}${products}<div class="work-note"><span aria-hidden="true">${arrow}</span><p>Built in the open. Elpida runs on public testnets today; Chaos Engine is research. Neither is on mainnet, and nothing here is an offer.</p></div></section>
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
      ? "Elpida is the multichain token launchpad built by Elpida Labs: live on public testnets today, with mainnet after an independent security audit."
      : "Chaos Engine is an early resilience-testing research concept. Explore the proposed workflow, safety principles and questions still being investigated.",
    `
 <section class="page-hero wrap"><a class="breadcrumb" href="index.html#work">← All explorations</a><div class="product-hero-grid"><div>${label(elpida ? "01 / WEB3 · MULTICHAIN" : "02 / DEVTOOLS · RESILIENCE")}${status(elpida ? "Live on testnets" : "Research & exploration")}<h1>${name}${elpida ? '<span class="lime">.</span>' : ""}</h1><p class="lead">${elpida ? "A new starting point<br>for onchain ideas." : "Understand the failure.<br>Design the recovery."}</p><p>${elpida ? "A multichain token launchpad built by Elpida Labs. Creators launch with liquidity locked from the first trade, and every trading fee is shared with creators, traders and holders. Live today on Ethereum, Base, BNB Chain, Robinhood Chain and Solana test networks." : "A planned testing platform exploring how teams could learn about software reliability through controlled failure experiments."}</p><div class="actions">${btn(elpida ? "https://elpida.fun" : "designing-for-failure.html", elpida ? "Visit elpida.fun" : "Read the research note")}${btn("#direction", "Explore the direction", true)}</div></div><div class="product-art ${elpida ? "elpida-art" : "chaos-art"} detail-art" aria-hidden="true">${elpida ? '<div class="art-rings"></div><img src="assets/elpida-mark.png" width="280" height="280" alt=""/>' : '<div class="chaos-grid"></div><span class="chaos-symbol">⌁</span><span class="signal signal-one"></span><span class="signal signal-two"></span>'}<span class="art-corner">${elpida ? "CREATE / DISCOVER / CONNECT" : "QUESTION / TEST / UNDERSTAND"}</span></div></div></section>
 <section id="direction" class="section wrap"><div class="intro-grid"><div>${label("THE PRODUCT DIRECTION")}<h2>${elpida ? "From a token launch<br>to a lasting community." : "A failure can be<br>a useful question."}</h2></div><div><p class="lead">${elpida ? "Launching is a moment. Building something people can understand and participate in is a longer journey." : "Software depends on systems that can slow down, become unavailable, or behave unexpectedly."}</p><p>${elpida ? "Elpida connects creation, discovery and community growth across chains, and makes each step legible: what a creator chooses, where the fees go, and what holders receive. It does not hide the risk that comes with onchain participation." : "Chaos Engine is a research concept for making those conditions easier to investigate. The intended direction is a deliberate workflow: define expected behavior, introduce a bounded disruption, observe the result, and use the findings to improve the system."}</p></div></div><div class="capability-grid bordered">${(elpida
   ? [
       [
         "Create",
         "Launch a token on a bonding curve whose liquidity is locked from the first trade, paired with the native coin, USDC or a tokenized stock.",
       ],
       [
         "Discover",
         "Charts, trades, holders and fee flows for every token, on Ethereum, Base, BNB Chain, Robinhood Chain and Solana.",
       ],
       [
         "Grow",
         "Every trading fee is split on chain: the creator, a monthly airdrop for traders, rewards for holders, a buyback-and-burn flywheel and the treasury.",
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
       `<article><span>0${i + 1} / ${elpida ? "ON TESTNETS TODAY" : "PROPOSED DIRECTION"}</span><h3>${t}</h3><p>${p}</p></article>`,
   )
   .join("")}</div></section>
 <section class="section wrap development"><div>${label("AN HONEST DEVELOPMENT NOTE")}<h2>Ambition, with<br><span class="muted">the status attached.</span></h2></div><div><h3>${elpida ? "Live on testnets, not yet on mainnet" : "A concept, still taking shape"}</h3><p>${elpida ? "Elpida runs at elpida.fun on Base Sepolia, Ethereum Sepolia, BNB Chain testnet, Robinhood Chain testnet and Solana devnet. Tokens launched there are test tokens with no value. Mainnet follows an independent security audit and the fixes it requires; no date is announced." : "There is no released Chaos Engine platform presented here. Experiment types, integrations, deployment options, reporting, and a release timeline are not confirmed. The research may lead to a prototype, a narrower tool, or a different approach."}</p><p>${elpida ? "This page does not announce a token sale or a financial return. Pairs with tokenized stocks depend on each issuer’s terms and eligibility rules." : "A future prototype would need explicit scope, access controls, stop conditions, and reliable cleanup before any real system experiments. The illustrative graphics on this site do not run tests or connect to infrastructure."}</p><a class="text-link" href="${elpida ? "building-elpida.html" : "designing-for-failure.html"}">Read the detailed product note ${arrow}</a></div></section>${cta}`,
    "Our work",
  );
};
productPage("Elpida");
productPage("Chaos Engine");
page(
  "about.html",
  "The lab",
  "Meet Elpida Labs, an independent technology lab founded by Computer Science students: our approach to original products, practical engineering and continuous learning.",
  `<section class="page-hero wrap">${label("THE LAB / INDEPENDENT BY NATURE")}<h1>Ideas deserve<br>to be <span class="serif lime">built.</span></h1><div class="intro-grid"><p class="lead">A few curious minds.<br>A shared impulse to make things.</p><div><p>Elpida Labs is an independent technology lab, founded by Computer Science students. We build and run Elpida (elpida.fun), and we explore the space between an interesting question and a useful piece of software.</p><p>Our work spans AI, Web3, and real-world applications. We develop original product ideas and explore engineering collaborations, with an emphasis on understanding the problem before choosing the technology.</p></div></div></section><section class="manifesto"><div class="wrap">${label("OUR STARTING POINT")}<p>Build with curiosity.<br>Question with care.<br><span>Learn by doing.</span></p><span class="manifesto-star" aria-hidden="true">${asterisk}</span></div></section><section class="section wrap">${sectionHead("OUR OPERATING PRINCIPLES", "Small lab.<br>Deliberate choices.", "These are the principles guiding our work, from the earliest sketch to the decisions that shape a product.")}<div class="capability-grid"><article><span>01</span><h3>Understand the work.</h3><p>Modern AI tools can amplify our effort. We remain responsible for understanding, reviewing, and testing what we build.</p></article><article><span>02</span><h3>Make progress legible.</h3><p>Describe what exists, what is being explored, and what has not been decided. A clear development status is part of the product.</p></article><article><span>03</span><h3>Keep people in view.</h3><p>Useful software begins with a real problem. Thoughtful interfaces, accessibility, and honest communication belong in the process.</p></article></div></section><section class="section wrap">${sectionHead("THE CURRENT EXPLORATIONS", "Two questions.<br>Room to discover.", "Elpida explores onchain creation and discovery. Chaos Engine explores how software could become more resilient.")}${products}</section>${cta}`,
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
        `<details class="profile"><summary><span class="profile-icon" aria-hidden="true">${n === "01" ? asterisk : n === "02" ? "⌘" : arrow}</span><span><span class="eyebrow">${n} / ${focus}</span><span class="profile-title">${role}</span></span><span class="profile-state">Profile forthcoming</span><span class="expand" aria-hidden="true">+</span></summary><div class="profile-body"><p>${desc}</p><dl><div><dt>Name & biography</dt><dd>To be confirmed</dd></div><div><dt>Public profile & contributions</dt><dd>Links will be added when confirmed.</dd></div></dl></div></details>`,
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
function renderContentArticle(item) {
  const sections = renderContentArticleBody(item.body);
  const cover = mediaPath(item.cover);
  page(
    item.file,
    item.title,
    item.intro,
    `<article class="article wrap"><a class="breadcrumb" href="journal.html">Back to journal</a>${label(escapeText(item.categoryLabel))}<h1>${escapeText(item.title)}</h1><p class="article-deck">${escapeText(item.intro)}</p><div class="article-meta"><span>ELPIDA LABS / PRODUCT NOTES</span>${status("Direction, not a release announcement")}</div>${cover ? `<figure class="article-cover"><img src="${escapeText(cover)}" alt="${escapeText(item.coverAlt)}" width="1200" height="675" decoding="async"/></figure>` : ""}<div class="article-layout"><aside aria-label="Article contents"><p class="eyebrow">IN THIS NOTE</p>${sections.map((section, i) => `<a href="#section-${i + 1}">${String(i + 1).padStart(2, "0")} / ${escapeText(section.heading)}</a>`).join("")}</aside><div class="article-body">${sections.map((section, i) => `<section id="section-${i + 1}"><h2>${escapeText(section.heading)}</h2>${section.html}</section>`).join("")}<div class="article-end">${label("CONTINUE EXPLORING")}${btn(item.product, escapeText(item.productLabel))}<a class="text-link" href="journal.html">All journal notes ${arrow}</a></div></div></div></article>`,
    "Journal",
  );
}
page(
  "contact.html",
  "Start a conversation",
  "Contact Elpida Labs about engineering collaborations, product feedback, and research. Prepare an enquiry for " +
    site.email +
    ".",
  contactPage,
  "Contact",
);
for (const item of articles) renderContentArticle(item);
page(
  "404.html",
  "Page not found",
  "This page could not be found. Return to Elpida Labs to explore our products and journal.",
  `<section class="page-hero wrap">${label("404 / A SMALL DETOUR")}<h1>A little outside<br>the <span class="serif lime">orbit.</span></h1><p>The page you’re looking for could not be found.</p><a class="button" href="${basePath}">Return to the lab ${arrow}</a></section>`,
);
// GitHub Pages serves this document at the original missing URL, including nested paths.
// A fixed base keeps all fallback assets and navigation within the project site.

write(
  "404.html",
  readFileSync(new URL("404.html", output), "utf8").replace(
    "<head>",
    `<head><base href="${basePath}"/>`,
  ),
);
write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${generatedPages
    .filter((file) => file !== "404.html")
    .map((file) => (file === "index.html" ? "" : file))
    .map((p) => `<url><loc>${origin}${p}</loc></url>`)
    .join("")}</urlset>`,
);
write(".nojekyll", "");
write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${origin}sitemap.xml`);
console.log(
  `Generated ${generatedPages.length - 1} content pages, 404 fallback, and sitemap.`,
);

// Public ownership proof, not an authentication credential.
write(`${indexNowKey}.txt`, indexNowKey);
write(
  "indexnow-manifest.json",
  JSON.stringify({
    pages: Object.fromEntries(
      generatedPages
        .filter((file) => file !== "404.html")
        .map((file) => [
          origin + (file === "index.html" ? "" : file),
          createHash("sha256")
            .update(readFileSync(new URL(file, output)))
            .digest("hex"),
        ]),
    ),
  }),
);
