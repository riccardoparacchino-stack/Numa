import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Text } from "../../atoms/text";
import { Container } from "../container/Container";
import { TextCompositor } from "../text-compositor/TextCompositor";
import { Stack } from "./Stack";

describe("Stack", () => {
  const overviewTitle = (
    <Text as="strong" variant="headline" size="s" id="overview-title" data-testid="overview-title">
      Overview
    </Text>
  ) as any;
  const overviewDescription = (
    <Text as="span" variant="body" size="m" id="overview-description" data-testid="overview-description">
      Shared context
    </Text>
  ) as any;
  const performanceTitle = (
    <Text as="span" variant="title" size="m" id="performance-title" data-testid="performance-title">
      Performance
    </Text>
  ) as any;
  const performanceDescription = (
    <Text as="small" variant="body" size="s" id="performance-description" data-testid="performance-description">
      Fast delivery
    </Text>
  ) as any;
  const accessTitle = (
    <Text as="em" variant="label" size="s" id="access-title" data-testid="access-title">
      Access
    </Text>
  ) as any;
  const accessDescription = (
    <Text as="span" variant="body" size="m" id="access-description" data-testid="access-description">
      Permissions
    </Text>
  ) as any;
  const reviewTitle = (
    <Text as="span" variant="headline" size="s" id="review-title" data-testid="review-title">
      Review
    </Text>
  ) as any;
  const reviewDescription = (
    <Text as="span" variant="body" size="s" id="review-description" data-testid="review-description">
      Audit trail
    </Text>
  ) as any;
  const notesTitle = (
    <Text as="span" variant="title" size="s" id="notes-title" data-testid="notes-title">
      Notes
    </Text>
  ) as any;
  const notesDescription = (
    <Text as="p" variant="body" size="m" id="notes-description" data-testid="notes-description">
      Layout remains neutral
    </Text>
  ) as any;

  it.each([
    ["vertical", "column", "nowrap", "8px", "0"],
    ["horizontal", "row", "nowrap", "0", "12px"],
    ["wrap-column", "column", "wrap", "8px", "12px"],
    ["wrap-row", "row", "wrap", "8px", "12px"],
  ] as const)("applies %s layout rules", (direction, flexDirection, flexWrap, rowGap, columnGap) => {
    const { container } = render(
      <Stack direction={direction}>
        <span>Item</span>
      </Stack>,
    );
    const stack = container.firstElementChild as HTMLDivElement;

    expect(stack.tagName).toBe("DIV");
    expect(stack.dataset.direction).toBe(direction);
    expect(stack.dataset.effectiveMode).toBe("compact");
    expect(stack.style.display).toBe("flex");
    expect(stack.style.flexDirection).toBe(flexDirection);
    expect(stack.style.flexWrap).toBe(flexWrap);
    expect(stack.style.rowGap).toBe(rowGap);
    expect(stack.style.columnGap).toBe(columnGap);
    expect(stack.getAttribute("role")).toBeNull();
  });

  it("inherits the ancestor Container mode and keeps the default outside Container compact", () => {
    const { getByText } = render(
      <Container mode="spacious">
        <Stack direction="horizontal">
          <span>One</span>
          <span>Two</span>
        </Stack>
      </Container>,
    );
    const stack = getByText("One").closest(".numa-stack") as HTMLDivElement;

    expect(stack.dataset.effectiveMode).toBe("spacious");
    expect(stack.style.columnGap).toBe("24px");
    expect(stack.style.rowGap).toBe("0");
  });

  it("forwards native attributes and merges custom className and style", () => {
    const { getByText } = render(
      <Stack
        data-testid="stack"
        aria-label="Stack demo"
        className="custom-stack"
        style={{ maxWidth: "480px" }}
      >
        <span>Child</span>
      </Stack>,
    );

    const stack = getByText("Child").closest(".numa-stack") as HTMLDivElement;

    expect(stack.className).toContain("numa-stack");
    expect(stack.className).toContain("custom-stack");
    expect(stack.dataset.testid).toBe("stack");
    expect(stack.getAttribute("aria-label")).toBe("Stack demo");
    expect(stack.style.maxWidth).toBe("480px");
  });

  it("keeps five TextCompositor entries in order while preserving each composition's semantics and attributes", () => {
    const { container, getByTestId } = render(
      <Container mode="spacious">
        <Stack direction="wrap-row" data-testid="stack-layout" style={{ width: "100%" }}>
          <TextCompositor
            title={overviewTitle}
            description={overviewDescription}
            align="center"
            gap="numa-spacing-pebbles-s"
            titleTypography={{ variant: "headline", size: "s" }}
            data-testid="overview-copy"
            aria-label="Overview summary"
            style={{ padding: "0.5rem", minWidth: "11rem" }}
          />
          <TextCompositor
            title={performanceTitle}
            description={performanceDescription}
            align="start"
            gap="numa-spacing-pebbles-xs"
            data-testid="performance-copy"
            aria-label="Performance summary"
            style={{ padding: "0.5rem", minWidth: "11rem" }}
          />
          <TextCompositor
            title={accessTitle}
            description={accessDescription}
            align="end"
            gap="numa-spacing-pebbles-m"
            data-testid="access-copy"
            aria-label="Access summary"
            style={{ padding: "0.5rem", minWidth: "11rem" }}
          />
          <TextCompositor
            title={reviewTitle}
            description={reviewDescription}
            align="center"
            gap="numa-spacing-pebbles-xs"
            data-testid="review-copy"
            aria-label="Review summary"
            style={{ padding: "0.5rem", minWidth: "11rem" }}
          />
          <TextCompositor
            title={notesTitle}
            description={notesDescription}
            align="start"
            gap="numa-spacing-pebbles-s"
            data-testid="notes-copy"
            aria-label="Notes summary"
            style={{ padding: "0.5rem", minWidth: "11rem" }}
          />
        </Stack>
      </Container>,
    );

    const stack = container.querySelector(".numa-stack") as HTMLDivElement;
    expect(stack).toBeTruthy();
    expect(stack.children).toHaveLength(5);
    expect(Array.from(stack.children).map((child) => child.textContent)).toEqual([
      "OverviewShared context",
      "PerformanceFast delivery",
      "AccessPermissions",
      "ReviewAudit trail",
      "NotesLayout remains neutral",
    ]);
    expect(stack.getAttribute("role")).toBeNull();
    expect(stack.getAttribute("aria-label")).toBeNull();
    expect(stack.querySelectorAll("ul, ol, li")).toHaveLength(0);
    expect(stack.querySelectorAll("[role]")).toHaveLength(0);
    expect(stack.style.flexDirection).toBe("row");
    expect(stack.style.flexWrap).toBe("wrap");
    expect(stack.style.columnGap).toBe("24px");
    expect(getByTestId("overview-copy").getAttribute("aria-label")).toBe("Overview summary");
    expect(getByTestId("overview-title").tagName).toBe("STRONG");
    expect(getByTestId("overview-description").tagName).toBe("SPAN");
    expect(getByTestId("performance-description").tagName).toBe("SMALL");
    expect(getByTestId("notes-description").tagName).toBe("P");
    expect(getByTestId("access-copy").style.textAlign).toBe("end");
  });
});
