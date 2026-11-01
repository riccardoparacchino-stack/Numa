import { cleanup, render } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { Text } from "./Text";
import {
  getTextTypography,
  textVariants,
} from "./text.variants";
import {
  letterSpacingOptions,
  resolveAbsoluteLetterSpacing,
  resolveLetterSpacing,
  type FontSizeToken,
} from "../../../foundation/typography/letter-spacing";
import type { TextProps } from "./Text";

afterEach(cleanup);

const cases = [
  {
    name: "label/s",
    element: <Text variant="label" size="s">Example</Text>,
    fontSize: "0.75rem",
    lineHeight: "1rem",
    fontWeight: "500",
  },
  {
    name: "label/m",
    element: <Text variant="label" size="m">Example</Text>,
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    fontWeight: "500",
  },
  {
    name: "label/l",
    element: <Text variant="label" size="l">Example</Text>,
    fontSize: "1rem",
    lineHeight: "1.5rem",
    fontWeight: "500",
  },
  {
    name: "body/s",
    element: <Text variant="body" size="s">Example</Text>,
    fontSize: "0.75rem",
    lineHeight: "1rem",
    fontWeight: "400",
  },
  {
    name: "body/m",
    element: <Text variant="body" size="m">Example</Text>,
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    fontWeight: "400",
  },
  {
    name: "body/l",
    element: <Text variant="body" size="l">Example</Text>,
    fontSize: "1rem",
    lineHeight: "1.5rem",
    fontWeight: "400",
  },
  {
    name: "button/s",
    element: <Text variant="button" size="s">Example</Text>,
    fontSize: "0.875rem",
    lineHeight: "100%",
    fontWeight: "500",
  },
  {
    name: "button/m",
    element: <Text variant="button" size="m">Example</Text>,
    fontSize: "1rem",
    lineHeight: "100%",
    fontWeight: "500",
  },
  {
    name: "button/l",
    element: <Text variant="button" size="l">Example</Text>,
    fontSize: "1.25rem",
    lineHeight: "100%",
    fontWeight: "500",
  },
  {
    name: "button/xl",
    element: <Text variant="button" size="xl">Example</Text>,
    fontSize: "1.5rem",
    lineHeight: "100%",
    fontWeight: "500",
  },
  {
    name: "title/s",
    element: <Text variant="title" size="s">Example</Text>,
    fontSize: "1rem",
    lineHeight: "1.5rem",
    fontWeight: "500",
  },
  {
    name: "title/m",
    element: <Text variant="title" size="m">Example</Text>,
    fontSize: "1.375rem",
    lineHeight: "1.75rem",
    fontWeight: "500",
  },
  {
    name: "headline/s",
    element: <Text variant="headline" size="s">Example</Text>,
    fontSize: "1.5rem",
    lineHeight: "2rem",
    fontWeight: "600",
  },
  {
    name: "headline/m",
    element: <Text variant="headline" size="m">Example</Text>,
    fontSize: "2rem",
    lineHeight: "2.5rem",
    fontWeight: "600",
  },
  {
    name: "display/s",
    element: <Text variant="display" size="s">Example</Text>,
    fontSize: "2.25rem",
    lineHeight: "2.75rem",
    fontWeight: "400",
  },
  {
    name: "display/m",
    element: <Text variant="display" size="m">Example</Text>,
    fontSize: "2.8125rem",
    lineHeight: "3.25rem",
    fontWeight: "400",
  },
  {
    name: "display/l",
    element: <Text variant="display" size="l">Example</Text>,
    fontSize: "3.5625rem",
    lineHeight: "4rem",
    fontWeight: "400",
  },
] as const;

const letterSpacingBySize = {
  12: { compact: "0em", relaxed: "0.01em", spacious: "0.02em" },
  14: { compact: "0em", relaxed: "0.005em", spacious: "0.01em" },
  16: { compact: "-0.005em", relaxed: "0em", spacious: "0.01em" },
  22: { compact: "-0.02em", relaxed: "-0.01em", spacious: "0em" },
  24: { compact: "-0.02em", relaxed: "-0.01em", spacious: "0em" },
  32: { compact: "-0.025em", relaxed: "-0.015em", spacious: "-0.005em" },
  36: { compact: "-0.03em", relaxed: "-0.02em", spacious: "-0.01em" },
  45: { compact: "-0.03em", relaxed: "-0.02em", spacious: "-0.01em" },
  57: { compact: "-0.03em", relaxed: "-0.02em", spacious: "-0.01em" },
} as const;

describe("Text", () => {
  it.each(cases)(
    "renders $name using Foundation typography",
    ({ element, fontSize, lineHeight, fontWeight }) => {
      const { getByText } = render(element);
      const renderedElement = getByText("Example");

      expect(renderedElement.tagName).toBe("SPAN");
      expect(renderedElement.style.fontFamily).toContain("Rubik");
      expect(renderedElement.style.fontSize).toBe(fontSize);
      expect(renderedElement.style.lineHeight).toBe(lineHeight);
      expect(renderedElement.style.fontWeight).toBe(fontWeight);
      const fontSizePx = Number.parseFloat(fontSize) * (fontSize.endsWith("rem") ? 16 : 1);
      const expectedLetterSpacing = fontSizePx in letterSpacingBySize
        ? letterSpacingBySize[fontSizePx as keyof typeof letterSpacingBySize].relaxed
        : "0em";
      expect(renderedElement.style.letterSpacing).toBe(expectedLetterSpacing);
    },
  );

  it("keeps the visual mapping independent from the semantic element", () => {
    const { getByText, rerender } = render(
      <Text variant="display" size="l" as="h1">
        Heading
      </Text>,
    );
    const heading = getByText("Heading");
    const originalStyle = heading.getAttribute("style");

    expect(heading.tagName).toBe("H1");
    expect(heading.getAttribute("role")).toBeNull();

    rerender(
      <Text variant="display" size="l" as="div">
        Heading
      </Text>,
    );

    const nonHeading = getByText("Heading");
    expect(nonHeading.tagName).toBe("DIV");
    expect(nonHeading.getAttribute("style")).toBe(originalStyle);
  });

  it("supports semantic paragraphs, headings, and inline text independently", () => {
    const { getByText } = render(
      <>
        <Text variant="body" size="m" as="p">Paragraph</Text>
        <Text variant="title" size="m" as="h3">Subheading</Text>
        <Text variant="label" size="s" as="span">Inline label</Text>
      </>,
    );

    expect(getByText("Paragraph").tagName).toBe("P");
    expect(getByText("Subheading").tagName).toBe("H3");
    expect(getByText("Inline label").tagName).toBe("SPAN");
  });

  it("forwards native, ARIA, data, and explicit role attributes", () => {
    const { getByText } = render(
      <Text
        variant="label"
        size="s"
        as="span"
        aria-label="Required field"
        data-testid="required"
        role="note"
      >
        Required
      </Text>,
    );
    const element = getByText("Required");

    expect(element.getAttribute("aria-label")).toBe("Required field");
    expect(element.getAttribute("data-testid")).toBe("required");
    expect(element.getAttribute("role")).toBe("note");
  });

  it("supports visual customization without overriding variant dimensions", () => {
    const { getByText } = render(
      <Text
        variant="body"
        size="m"
        fontFamily="Georgia"
        fontWeight={700}
        fontStyle="italic"
        letterSpacing="spacious"
        textDecoration="underline"
        color="rebeccapurple"
        style={{ marginTop: "1rem" }}
      >
        Customized
      </Text>,
    );
    const element = getByText("Customized");

    expect(element.style.fontFamily).toBe("Georgia");
    expect(element.style.fontWeight).toBe("700");
    expect(element.style.fontStyle).toBe("italic");
    expect(element.style.letterSpacing).toBe("0.01em");
    expect(element.style.textDecoration).toBe("underline");
    expect(element.style.color).toBe("rebeccapurple");
    expect(element.style.fontSize).toBe("0.875rem");
    expect(element.style.lineHeight).toBe("1.25rem");
    expect(element.style.marginTop).toBe("1rem");
  });

  it("throws for an invalid variant/size pair supplied by untyped callers", () => {
    expect(() => getTextTypography("title", "l")).toThrow(
      "Unsupported Text variant/size combination: title/l",
    );
  });

  it.each(
    Object.entries(textVariants).flatMap(([variant, sizes]) =>
      Object.entries(sizes).flatMap(([size, pair]) =>
        letterSpacingOptions.map((option) => ({
          variant,
          size,
          option,
          fontSizeToken: pair.fontSize as FontSizeToken,
        })),
      ),
    ),
  )(
    "maps $variant/$size to the $option Foundation tracking token",
    ({ variant, size, option, fontSizeToken }) => {
      const element = createElement(Text, {
        variant,
        size,
        letterSpacing: option,
        children: "Mapped",
      } as TextProps);
      const { getByText } = render(element);
      const fontSize = Number(fontSizeToken.slice("numa-text-size-".length));

      expect(getByText("Mapped").style.letterSpacing).toBe(
        letterSpacingBySize[fontSize as keyof typeof letterSpacingBySize][option],
      );
    },
  );

  it.each(Object.entries(letterSpacingBySize))(
    "resolves each named preset for the %s px font size",
    (fontSize, values) => {
      for (const option of letterSpacingOptions) {
        const tokenName =
          `numa-text-size-${fontSize}` as FontSizeToken;
        expect(resolveLetterSpacing(tokenName, option)).toBe(values[option]);
      }
    },
  );

  it("converts em to an absolute size for a future native adapter", () => {
    expect(resolveAbsoluteLetterSpacing(12, "0.01em")).toBeCloseTo(0.12);
    expect(resolveAbsoluteLetterSpacing(57, "-0.03em")).toBeCloseTo(-1.71);
    expect(
      resolveAbsoluteLetterSpacing(
        32,
        resolveLetterSpacing("numa-text-size-32", "spacious"),
      ),
    ).toBeCloseTo(-0.16);
  });

  it("rejects malformed em values and invalid font sizes", () => {
    expect(() => resolveAbsoluteLetterSpacing(16, "0.01px")).toThrow(
      "Expected an em letter-spacing value",
    );
    expect(() => resolveAbsoluteLetterSpacing(Number.NaN, "0em")).toThrow(
      "Font size must be a non-negative finite number",
    );
  });

  it("declares exactly the supported variant/size combinations", () => {
    expect(
      Object.entries(textVariants).flatMap(([variant, sizes]) =>
        Object.keys(sizes).map((size) => `${variant}/${size}`),
      ),
    ).toHaveLength(13);
  });

  it("declares exactly the supported letter-spacing options", () => {
    expect(letterSpacingOptions).toEqual(["compact", "relaxed", "spacious"]);
  });
});
