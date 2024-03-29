import type { HtmlMetaDescriptor } from "@remix-run/node";

type GenerateMetaOpts = {
  noIndex?: boolean;
  title?: string;
  description?: string;
  imageUrl?: string;
  themeColor?: string;
  keywords?: string;
};

export const generateMeta = (opts: GenerateMetaOpts): HtmlMetaDescriptor => {
  const titleTemplate = "GENSHIN.ACADEMY";
  const realTitle = titleTemplate != null ? `${opts.title} - ${titleTemplate}` : opts.title;

  let metaTags: HtmlMetaDescriptor = { title: realTitle, "og:title": realTitle };

  if (typeof opts.description === "string") {
    metaTags = {
      ...metaTags,
      description: opts.description,
      "og:description": opts.description,
    };
  }

  if (typeof opts.imageUrl === "string") {
    metaTags = { ...metaTags, "og:image": opts.imageUrl };
  }

  if (typeof opts.keywords === "string") {
    metaTags = { ...metaTags, keywords: opts.keywords };
  }

  if (typeof opts.themeColor === "string") {
    metaTags = { ...metaTags, "theme-color": opts.themeColor };
  }

  if (typeof opts.noIndex === "boolean" && opts.noIndex === true) {
    metaTags = { ...metaTags, robots: "noindex" };
  }

  return metaTags;
};
