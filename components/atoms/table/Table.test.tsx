import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Table } from "./Table";

describe("Table", () => {
  it("retains native table sections and headers, forwards attributes, and accepts Numa content", () => {
    render(
      <Table aria-label="Token values" data-table="tokens" className="custom" style={{ width: "80%" }}>
        <caption>Spacing tokens</caption>
        <thead><tr><th scope="col">Name</th><th scope="col">Value</th></tr></thead>
        <tbody><tr><th scope="row">small</th><td><code>8px</code></td></tr></tbody>
      </Table>,
    );
    const table = screen.getByRole("table", { name: "Token values" });
    expect(table.classList.contains("numa-table") && table.classList.contains("custom")).toBe(true);
    expect(table.getAttribute("data-table")).toBe("tokens");
    expect(screen.getByRole("columnheader", { name: "Name" }).getAttribute("scope")).toBe("col");
    expect(screen.getByRole("rowheader", { name: "small" }).getAttribute("scope")).toBe("row");
    expect(screen.getByText("8px").tagName).toBe("CODE");
    expect(table.style.width).toBe("80%");
    expect(table.parentElement?.classList.contains("numa-table__overflow")).toBe(true);
  });
});
