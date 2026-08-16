// .eleventy.js
const Image = require("@11ty/eleventy-img");
const path = require("path");

// ---- IMAGE SHORTCODE ----
async function imageShortcode(src, alt, sizes = "100vw", attrs = {}) {
  // Allow empty-string alt for decorative images, but not undefined/null
  if (alt === undefined || alt === null) {
    throw new Error(`Missing \`alt\` text for image: ${src}`);
  }

  // Make the image path root-relative
  const fullSrc = path.join("./", src);

  const widths = attrs.widths || [320, 640, 960, 1200, 1800];
  const formats = attrs.formats || ["avif", "webp", "jpeg"];
  const cleanAttrs = { ...attrs };
  delete cleanAttrs.widths;
  delete cleanAttrs.formats;

  let metadata = await Image(fullSrc, {
    widths,
    formats,
    urlPath: "/img/",        // How it appears in the final site
    outputDir: "./img"       // Write alongside source so both dev root and _site can serve
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: attrs.loading || "lazy",
    decoding: "async",
    ...cleanAttrs
  };

  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function (eleventyConfig) {

  // ---- GLOBAL DATA ----
  // Computed once at build time, baked into the static HTML — no client-side JS needed.
  eleventyConfig.addGlobalData("currentYear", () => new Date().getFullYear());

  // ---- PASSTHROUGH COPIES (your original config) ----
  eleventyConfig.addPassthroughCopy({
    css: "css",
    js: "js",
    img: "img",
    video: "video",
    textures: "textures",
    pdfs: "pdfs",
    "tenets-marquee.js": "tenets-marquee.js",
    "menu.js": "menu.js",
    "robots.txt": "robots.txt"
  });
  eleventyConfig.addPassthroughCopy({
    "css/hero.css": "css/hero.css"
  });

  // ---- REGISTER SHORTCODES ----
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addLiquidShortcode("image", imageShortcode);
  eleventyConfig.addJavaScriptFunction("image", imageShortcode);

  // ---- MINIFY HTML/CSS/JS OUTPUT ----
  eleventyConfig.addTransform("minify", function (content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      let minified = content;
      // Strip HTML comments (preserve conditional comments if any appear)
      minified = minified.replace(/<!--(?!\s*\[if).*?-->/gs, "");
      // Collapse whitespace between tags and within text nodes
      minified = minified.replace(/>\s+</g, "><").replace(/\s{2,}/g, " ").trim();
      return minified;
    }

    if (outputPath && outputPath.endsWith(".css")) {
      let minified = content;
      // Drop non-license comments
      minified = minified.replace(/\/\*[^!][\s\S]*?\*\//g, "");
      // Tighten spaces around punctuation
      minified = minified.replace(/\s*([{}:;,])\s*/g, "$1");
      // Collapse remaining whitespace
      minified = minified.replace(/\s{2,}/g, " ").trim();
      // Remove optional trailing semicolons
      minified = minified.replace(/;}/g, "}");
      return minified;
    }

    if (outputPath && outputPath.endsWith(".js")) {
      let minified = content;
      // Remove block comments except /*! license */
      minified = minified.replace(/\/\*[^!][\s\S]*?\*\//g, "");
      // Remove simple line comments (avoid # directives)
      minified = minified.replace(/(^|\s)\/\/(?!\s*#|\s*@).*$/gm, "$1");
      // Collapse excessive blank lines
      minified = minified.replace(/\n{2,}/g, "\n");
      return minified.trim();
    }

    return content;
  });

  // ---- RETURN DIRECTORIES ----
  return {
    dir: {
      input: ".",
      output: "_site"
    }
  };
};
