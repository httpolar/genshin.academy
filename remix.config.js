/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  future: {
    v2_routeConvention: true,
    v2_normalizeFormMethod: true,
    v2_meta: true,
  },
  serverMinify: true,
  cacheDirectory: "./.cache/remix",
  ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
  serverDependenciesToBundle: [
    /nanoid/,
    /github-slugger/,
    /^rehype.*/,
    /^remark.*/,
    /^unified.*/,
    /^micromark.*/,
    /^hast-util.*/,
    /^mdast-util.*/,
    /^unist-util.*/,
    "unist-builder",
    /^vfile.*/,
    /^character-entities.*/,
    /.*separated-tokens$/,
    "bail",
    "property-information",
    "is-plain-obj",
    "html-void-elements",
    "zwitch",
    "trough",
    "ccount",
    "web-namespaces",
    "stringify-entities",
    "decode-named-character-reference",
    "dled",
    "markdown-table",
    "hastscript",
    "hast-to-hyperscript",
    "trim-lines",
  ],
};
