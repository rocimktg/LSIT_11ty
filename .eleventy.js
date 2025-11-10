import eleventyNavigation from "@11ty/eleventy-navigation";
import { DateTime } from "luxon";
import imageShortcode from "./src/_includes/shortcodes/image.js";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigation);

  eleventyConfig.addFilter("readableDate", (dateObj, format = "LLL dd, yyyy") => {
    if (!dateObj) return "";
    const date = dateObj instanceof Date ? dateObj : new Date(dateObj);
    return DateTime.fromJSDate(date).toFormat(format);
  });

  eleventyConfig.addShortcode("year", () => new Date().getFullYear());
  eleventyConfig.addShortcode("limit", (arr = [], count = 5) => {
    if (!Array.isArray(arr)) return [];
    return arr.slice(0, count);
  });
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  eleventyConfig.addPassthroughCopy({ "src/assets/img": "assets/img" });
  eleventyConfig.addPassthroughCopy({ "src/assets/pdfs": "assets/pdfs" });
  eleventyConfig.addPassthroughCopy({ "src/assets/textures": "assets/textures" });
  eleventyConfig.addPassthroughCopy({ "src/assets/video": "assets/video" });
  eleventyConfig.addPassthroughCopy({ "src/docs": "docs" });

  eleventyConfig.addWatchTarget("src/assets/css");
  eleventyConfig.addWatchTarget("src/assets/js");

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true
  };
}
