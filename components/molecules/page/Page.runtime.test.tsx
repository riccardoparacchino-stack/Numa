import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Page } from "./Page";

afterEach(cleanup);

describe("Page", () => {
  it("uses semantic page background and spacing tokens for its layout", () => {
    const { getByText } = render(<Page>Page content</Page>);
    const page = getByText("Page content").closest(".numa-page") as HTMLDivElement;

    expect(page.tagName).toBe("DIV");
    expect(page.style.getPropertyValue("--numa-page-background")).toBe(
      "var(--numa-color-context-background-default)",
    );
    expect(page.style.getPropertyValue("--numa-color-context-background-default")).toBe("#f1f5f9");
    expect(page.style.getPropertyValue("--numa-page-padding-top")).toBe("80px");
    expect(page.style.getPropertyValue("--numa-page-padding-inline")).toBe("20px");
    expect(page.style.getPropertyValue("--numa-page-padding-bottom")).toBe("120px");
    expect(page.style.borderRadius).toBe("");
    expect(page.getAttribute("role")).toBeNull();
  });

  it("forwards native attributes and user style overrides", () => {
    const { getByText } = render(
      <Page data-testid="page" style={{ maxWidth: "960px" }}>
        Content
      </Page>,
    );
    const page = getByText("Content").closest(".numa-page") as HTMLDivElement;

    expect(page.dataset.testid).toBe("page");
    expect(page.style.maxWidth).toBe("960px");
  });
});
