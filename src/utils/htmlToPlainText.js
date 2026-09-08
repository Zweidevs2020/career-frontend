const BLOCK_ELEMENTS = new Set([
  "ADDRESS",
  "ARTICLE",
  "BLOCKQUOTE",
  "DIV",
  "FOOTER",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "HEADER",
  "LI",
  "P",
  "SECTION",
  "TR",
]);

const readNode = (node) => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.nodeValue || "";
  }

  if (node.nodeName === "BR") {
    return "\n";
  }

  const content = Array.from(node.childNodes).map(readNode).join("");

  if (node.nodeName === "LI") {
    return `• ${content.trim()}\n`;
  }

  return BLOCK_ELEMENTS.has(node.nodeName) ? `${content}\n` : content;
};

/**
 * Converts legacy HTML descriptions to display-safe plain text.
 * A second pass supports records whose HTML was encoded before being stored.
 */
export const htmlToPlainText = (value) => {
  if (value === null || value === undefined) return "";

  let text = String(value);

  if (typeof DOMParser === "undefined") {
    return text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }

  for (let pass = 0; pass < 2; pass += 1) {
    const document = new DOMParser().parseFromString(text, "text/html");
    text = Array.from(document.body.childNodes).map(readNode).join("");

    if (!/<\/?[a-z][^>]*>/i.test(text)) break;
  }

  return text
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};
