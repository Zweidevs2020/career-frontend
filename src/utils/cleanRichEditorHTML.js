export function cleanRichEditorHTML(htmlString) {
  if (typeof window === "undefined") return htmlString; // SSR safety

  const wrapper = document.createElement("div");
  wrapper.innerHTML = htmlString;

  // Remove &nbsp;
  wrapper.innerHTML = wrapper.innerHTML.replace(/&nbsp;/g, ' ');

  // Fix long <li> that has comma-separated values
  const listItems = wrapper.querySelectorAll("li");

  listItems.forEach((li) => {
    if (
      li.childElementCount === 0 &&
      li.textContent &&
      li.textContent.includes(",")
    ) {
      const parent = li.parentElement;
      const items = li.textContent
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      items.forEach((item) => {
        const newLi = document.createElement("li");
        newLi.textContent = item;
        parent?.insertBefore(newLi, li);
      });

      parent?.removeChild(li); // Remove original malformed one
    }
  });

  // Clean up excessive <br>
  wrapper.innerHTML = wrapper.innerHTML.replace(/<br\s*\/?>/gi, '');

  return wrapper.innerHTML.trim();
}
