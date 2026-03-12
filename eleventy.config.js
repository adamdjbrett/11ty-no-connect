const path = require("node:path");

function normalizeDate(value, fallback = new Date(0)) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  if (typeof value === "string") {
    const isoDateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoDateOnly) {
      const [, y, m, d] = isoDateOnly;
      return new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), 12, 0, 0));
    }

    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return fallback;
}

function ensureIndexHtml(urlPath) {
  if (!urlPath || urlPath === "/") {
    return "index.html";
  }

  const trimmed = urlPath.replace(/^\/+/, "");
  if (path.posix.extname(trimmed)) {
    return trimmed;
  }

  return trimmed.endsWith("/") ? `${trimmed}index.html` : `${trimmed}/index.html`;
}

function relativeLink(fromUrl, toUrl) {
  if (!toUrl) {
    return "";
  }

  if (/^(?:[a-z]+:)?\/\//i.test(toUrl) || toUrl.startsWith("file://")) {
    return toUrl;
  }

  const fromPath = ensureIndexHtml(fromUrl || "/");
  const toPath = ensureIndexHtml(toUrl);
  const fromDir = path.posix.dirname(fromPath);

  let rel = path.posix.relative(fromDir === "." ? "" : fromDir, toPath);
  if (!rel || rel === ".") {
    rel = path.posix.basename(toPath);
  }

  return rel;
}

function absoluteSiteLink(siteBase, toUrl) {
  if (!toUrl) {
    return "";
  }

  if (/^(?:[a-z]+:)?\/\//i.test(toUrl) || toUrl.startsWith("file://")) {
    return toUrl;
  }

  const normalizedBase = String(siteBase || "").replace(/\/+$/, "");
  if (!normalizedBase) {
    return "";
  }

  const toPath = ensureIndexHtml(toUrl);
  return `${normalizedBase}/${toPath}`;
}

function xmlEscape(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });

  eleventyConfig.addFilter("displayDate", (value) => {
    const date = normalizeDate(value);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  });

  eleventyConfig.addFilter("rfc822Date", (value) => {
    return normalizeDate(value).toUTCString();
  });

  eleventyConfig.addFilter("xmlEscape", xmlEscape);
  eleventyConfig.addFilter("relLink", relativeLink);
  eleventyConfig.addFilter("siteLink", (toUrl, fromUrl, siteBase) => {
    if (siteBase) {
      return absoluteSiteLink(siteBase, toUrl);
    }

    return relativeLink(fromUrl, toUrl);
  });

  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi.getFilteredByTag("posts").sort((a, b) => {
      const bDate = normalizeDate(b.data.date, b.date).getTime();
      const aDate = normalizeDate(a.data.date, a.date).getTime();
      return bDate - aDate;
    });
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
