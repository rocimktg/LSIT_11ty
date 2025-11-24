// .eleventy.js
const Image = require("@11ty/eleventy-img");
const path = require("path");

// ---- IMAGE SHORTCODE ----
async function imageShortcode(src, alt, sizes = "100vw") {
  if (!alt) {
    throw new Error(`Missing \`alt\` text for image: ${src}`);
  }

  // Make the image path root-relative
  const fullSrc = path.join("./", src);

  let metadata = await Image(fullSrc, {
    widths: [320, 640, 960, 1200],
    formats: ["avif", "webp", "jpeg"],
    urlPath: "/img/",        // How it appears in the final site
    outputDir: "./_site/img/" // Where optimized images are written
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async"
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
