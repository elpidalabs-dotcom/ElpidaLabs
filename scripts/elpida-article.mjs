import { escapeText } from "./content.mjs";

export function elpidaArticle(site, arrow) {
  const sections = [
    [
      "overview",
      "What is Elpida?",
      `<p>Elpida is a multichain token launchpad built and operated by Elpida Labs. It brings token creation, project discovery, and related onchain tools together at <a href="https://elpida.fun">elpida.fun</a>.</p><p>The product is live on mainnet. Its focus is the journey from preparing a token and its project information to reviewing the launch and finding projects through a shared explorer.</p>`,
    ],
    [
      "creation",
      "How token creation works",
      `<p>The live creation flow is organized into five stages:</p><ol><li><strong>Token details.</strong> Add the name, symbol, description, logo, and optional community links that describe a project.</li><li><strong>Trading pair.</strong> Choose from the pairing options available on the selected network.</li><li><strong>Creator rewards.</strong> Review and configure the creator-reward details presented by the product.</li><li><strong>Optional creator purchase.</strong> Review an initial purchase when that option is available.</li><li><strong>Review and create.</strong> Inspect the network, launch summary, fees, and transaction details before proceeding in the live app.</li></ol><p>The creation page includes a project preview and launch summary. Current options and amounts are shown by the live product rather than fixed in this article.</p>`,
    ],
    [
      "discovery",
      "Discovery and the wider product",
      `<p>The explorer helps visitors find indexed launches. It supports filtering by a token’s name, ticker, or address, with chain and pairing filters and several sorting views.</p><p>Elpida also provides destinations for <a href="https://elpida.fun/#/portfolio">portfolio</a>, <a href="https://elpida.fun/#/rewards">creator rewards</a>, <a href="https://elpida.fun/#/swap">swap</a>, and <a href="https://elpida.fun/#/analytics">analytics</a>. These views serve different parts of the product journey; their current data, network coverage, and account requirements are shown in the app.</p>`,
    ],
    [
      "networks",
      "Mainnet networks",
      `<p>On 25 November 2026, Elpida’s network selector listed Base, BNB Chain, Robinhood Chain, and Ethereum as Mainnet options. The <a href="https://elpida.fun/api/public/status">public status endpoint</a> reported all four configurations as enabled at the time of review.</p><p>Network availability and individual operations can change. The selected network, live status, and transaction review in elpida.fun provide the current details.</p>`,
    ],
    [
      "development",
      "A live product that keeps evolving",
      `<p>Mainnet is Elpida’s current deployment stage. Development continues as the team improves the product and documents its capabilities. Future features and additional network coverage will be described as they become available.</p><p>This article is an introduction to the product. For current operating details, refer to the live app, its <a href="https://elpida.fun/#/terms">terms</a>, and its <a href="https://elpida.fun/#/docs/risk">risk information</a>.</p>`,
    ],
    [
      "visit",
      "Explore Elpida",
      `<p>Token creation and other product actions take place at elpida.fun. This page explains the product without collecting project information or connecting a wallet.</p><div class="actions"><a class="button" href="https://elpida.fun">Open Elpida ${arrow}</a><a class="button secondary" href="https://elpida.fun/#/launch">View the creation flow ${arrow}</a></div><p>For product questions or feedback, contact <a href="mailto:${escapeText(site.email)}">${escapeText(site.email)}</a>.</p>`,
    ],
  ];
  return `<article class="article wrap product-article elpida-article"><a class="breadcrumb" href="index.html#work">All products</a><p class="eyebrow">ELPIDA LABS / PRODUCT OVERVIEW</p><h1>Elpida<span class="lime">.</span></h1><p class="article-deck">A multichain token launchpad. Live on mainnet. Built by Elpida Labs.</p><div class="article-meta"><span class="status"><i aria-hidden="true"></i>Live on mainnet</span><span>Product information · Updated 25 November 2026</span></div><div class="article-layout"><aside aria-label="Article contents"><p class="eyebrow">IN THIS OVERVIEW</p>${sections.map(([id, title], i) => `<a href="#${id}">${String(i + 1).padStart(2, "0")} / ${title}</a>`).join("")}</aside><div class="article-body">${sections.map(([id, title, body]) => `<section id="${id}"><h2>${title}</h2>${body}</section>`).join("")}</div></div></article>`;
}
