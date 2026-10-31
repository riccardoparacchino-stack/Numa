import { describe, expect, it } from "vitest";
import { resolveRadiusPx, resolveSpacingPx } from "./semantic-dimensions";

describe("semantic CSS dimensions", () => {
  it("resolves spacing aliases to CSS pixel values", () => {
    expect(resolveSpacingPx("numa-spacing-pebbles-l")).toBe(16);
    expect(resolveSpacingPx("numa-spacing-bricks-s")).toBe(24);
  });

  it("resolves radius aliases to CSS pixel values", () => {
    expect(resolveRadiusPx("numa-radius-bricks-m")).toBe(32);
    expect(resolveRadiusPx("numa-radius-walls-l")).toBe(80);
    expect(resolveRadiusPx("numa-radius-walls-xl")).toBe(96);
  });
});
