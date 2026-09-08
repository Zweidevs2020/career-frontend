import { htmlToPlainText } from "./htmlToPlainText";

describe("htmlToPlainText", () => {
  it("formats legacy HTML and decodes stored entities", () => {
    expect(
      htmlToPlainText(
        "<p>A practical person who enjoys &ldquo;hands-on work&rdquo;.</p>"
      )
    ).toBe("A practical person who enjoys “hands-on work”.");
  });

  it("supports encoded legacy HTML", () => {
    expect(htmlToPlainText("&lt;p&gt;First paragraph.&lt;/p&gt;"))
      .toBe("First paragraph.");
  });

  it("preserves readable spacing between blocks and list items", () => {
    expect(htmlToPlainText("<p>Intro</p><ul><li>One</li><li>Two</li></ul>"))
      .toBe("Intro\n• One\n• Two");
  });

  it("leaves current plain-text descriptions unchanged", () => {
    expect(htmlToPlainText("A modern plain-text description."))
      .toBe("A modern plain-text description.");
  });
});
