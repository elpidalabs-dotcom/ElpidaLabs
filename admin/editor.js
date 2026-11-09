/* Decap is loaded only on this admin route, pinned by version and integrity. */
if (!window.CMS) {
  document.querySelector("#editor-loading").textContent =
    "The editor could not load. Check your connection and reload. Your website has not changed.";
} else {
  const localDemo =
    new URLSearchParams(location.search).get("demo") === "1" &&
    ["localhost", "127.0.0.1"].includes(location.hostname);
  fetch("config.json")
    .then((response) => {
      if (!response.ok) throw new Error("Configuration could not be loaded.");
      return response.json();
    })
    .then((config) => {
      config.load_config_file = false;
      if (localDemo) {
        config.backend = { name: "test-repo" };
        config.publish_mode = "simple";
      }
      window.CMS.init({ config });
      document.querySelector("#editor-loading")?.remove();
    })
    .catch(() => {
      document.querySelector("#editor-loading").textContent =
        "The editor configuration could not load. Reload the page or contact the administrator. No content has changed.";
    });
  window.CMS.registerPreviewStyle("preview.css");
  const h = window.h;
  window.CMS.registerPreviewTemplate("people", ({ entry, getAsset }) => {
    const data = entry.get("data"),
      image = data.get("photo");
    return h(
      "article",
      {},
      h(
        "p",
        { className: "preview-note" },
        "Profile preview · Publishing starts website checks before going live.",
      ),
      h("p", { className: "kicker" }, data.get("role") || "Team profile"),
      image
        ? h("img", {
            className: "portrait",
            src: String(getAsset(image)),
            alt: data.get("photoAlt") || "",
          })
        : null,
      h("h1", {}, data.get("name") || "Profile name"),
      h(
        "p",
        { style: { whiteSpace: "pre-wrap" } },
        data.get("bio") || "Biography",
      ),
      ...(data.get("links")?.toJS() || []).map((link, index) =>
        h(
          "p",
          { key: index },
          h(
            "a",
            { href: /^https:\/\//.test(link.url) ? link.url : undefined },
            link.label || "Public link",
          ),
        ),
      ),
    );
  });
  window.CMS.registerPreviewTemplate(
    "articles",
    ({ entry, widgetFor, getAsset }) => {
      const data = entry.get("data"),
        image = data.get("cover");
      return h(
        "article",
        {},
        h(
          "p",
          { className: "preview-note" },
          "Article preview · Check the deployed page after publishing.",
        ),
        h("p", { className: "kicker" }, data.get("categoryLabel") || "Journal"),
        h("h1", {}, data.get("title") || "Article title"),
        h("p", { className: "deck" }, data.get("intro") || "Introduction"),
        image
          ? h("img", {
              src: String(getAsset(image)),
              alt: data.get("coverAlt") || "",
            })
          : null,
        widgetFor("body"),
      );
    },
  );
}
