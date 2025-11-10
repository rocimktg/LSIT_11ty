import Image from "@11ty/eleventy-img";
import path from "node:path";

const defaultWidths = [400, 800, 1200];
const defaultFormats = ["webp", "jpeg"];

const resolvePath = (src) => {
  if (!src) {
    throw new Error("The image shortcode requires a src argument.");
  }

  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  return path.join("src/assets/img", src);
};

const imageShortcode = async (
  src,
  alt = "",
  {
    widths = defaultWidths,
    formats = defaultFormats,
    sizes = "100vw",
    loading = "lazy",
    decoding = "async",
    className = ""
  } = {}
) => {
  const metadata = await Image(resolvePath(src), {
    widths,
    formats,
    outputDir: "./dist/assets/img",
    urlPath: "/assets/img/"
  });

  const attributes = {
    alt,
    sizes,
    loading,
    decoding
  };

  if (className) {
    attributes.class = className;
  }

  return Image.generateHTML(metadata, attributes);
};

export default imageShortcode;
