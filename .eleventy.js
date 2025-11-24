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
    "load-footer.js": "load-footer.js",
    "load-nav.js": "load-nav.js"
  });

  // ---- REGISTER SHORTCODES ----
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addLiquidShortcode("image", imageShortcode);
  eleventyConfig.addJavaScriptFunction("image", imageShortcode);

  // ---- RETURN DIRECTORIES ----
  return {
    dir: {
      input: ".",
      output: "_site"
    }
  };
};
