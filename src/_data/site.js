module.exports = {
  title: "No Connect (11ty)",
  email: "your-email@domain.com",
  siteBase: (process.env.SITE_BASE || "").trim().replace(/\/+$/, ""),
  description:
    "A minimal offline-first static site for local disk or USB browsing with no local server.",
};
