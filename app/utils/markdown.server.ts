import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remark2Rehype from "remark-rehype";
import { unified } from "unified";

export const markdownParser = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remark2Rehype, { allowDangerousHtml: true })
  .use(rehypeRaw, { passThrough: ["details", "summary"] })
  // .use(rehypeSanitize, { tagNames: [...sanitizeDefault.tagNames, "details", "iframe", "summary"] })
  .use(rehypeSlug)
  .use(rehypeStringify);