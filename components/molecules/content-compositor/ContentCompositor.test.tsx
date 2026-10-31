import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TextCompositor } from "../text-compositor";
import { ContentCompositor } from "./ContentCompositor";

afterEach(cleanup);

describe("ContentCompositor", () => {
  it("composes leading, TextCompositor children, trailing, and footer", () => {
    const { container, getByText } = render(
      <ContentCompositor leading="Leading" trailing="Trailing" footer="Footer">
        <TextCompositor title="Title" description="Description" />
      </ContentCompositor>,
    );
    const content = container.firstElementChild as HTMLDivElement;
    const main = content.querySelector(".numa-content-compositor__main") as HTMLDivElement;

    expect(main.children).toHaveLength(3);
    expect(main.firstElementChild?.textContent).toBe("Leading");
    expect(main.lastElementChild?.textContent).toBe("Trailing");
    expect(getByText("Title")).toBeTruthy();
    expect(content.lastElementChild?.textContent).toBe("Footer");
    expect(main.style.gap).toBe("12px");
  });

  it("omits empty slots so no empty children or gaps remain", () => {
    const { container, rerender } = render(
      <ContentCompositor leading={null} trailing={false} footer="">
        {null}
      </ContentCompositor>,
    );
    const content = container.firstElementChild as HTMLDivElement;

    expect(content.children).toHaveLength(0);

    rerender(<ContentCompositor leading="Only leading" />);
    expect(content.querySelector(".numa-content-compositor__main")?.children).toHaveLength(1);
  });

  it("supports vertical composition and token-based gaps", () => {
    const { container } = render(
      <ContentCompositor
        layout="vertical"
        leading="Leading"
        trailing="Trailing"
        gap="numa-spacing-pebbles-l"
      >
        Main
      </ContentCompositor>,
    );
    const wrapper = container.firstElementChild as HTMLDivElement;
    const main = wrapper.querySelector(".numa-content-compositor__main") as HTMLDivElement;

    expect(wrapper.className).toContain("numa-content-compositor--vertical");
    expect(main.children).toHaveLength(3);
    expect(main.style.gap).toBe("16px");
  });

  it("keeps the main content flexible and forwards attributes", () => {
    const { container } = render(
      <ContentCompositor data-testid="content">
        A long piece of flexible content
      </ContentCompositor>,
    );
    const root = container.firstElementChild as HTMLDivElement;
    const mainContent = root.querySelector(".numa-content-compositor__content") as HTMLDivElement;

    expect(root.dataset.testid).toBe("content");
    expect(mainContent.textContent).toBe("A long piece of flexible content");
  });

  it("can render phrasing wrappers for use inside a native button", () => {
    const { container } = render(
      <button type="button">
        <ContentCompositor as="span" leading="Leading" trailing="Trailing">
          <TextCompositor title="Button label" />
        </ContentCompositor>
      </button>,
    );
    const button = container.querySelector("button");

    expect(button?.querySelectorAll("div")).toHaveLength(0);
    expect(button?.querySelector(".numa-content-compositor")?.tagName).toBe("SPAN");
  });
});
