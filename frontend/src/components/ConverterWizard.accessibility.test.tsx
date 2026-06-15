/**
 * Accessibility regression tests for the dashboard converter modal.
 */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axe from "axe-core";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("../api", () => ({
  api: {
    config: { get: vi.fn().mockResolvedValue({}) },
    lovelace: { dashboards: vi.fn().mockResolvedValue([]) },
    themes: { list: vi.fn().mockResolvedValue([]) },
  },
}));

import { ConverterWizard } from "./ConverterWizard";

function ConverterHarness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open converter</button>
      {open && <ConverterWizard onClose={() => setOpen(false)} />}
    </>
  );
}

describe("ConverterWizard accessibility", () => {
  it("contains keyboard focus, closes with Escape, and restores focus", async () => {
    const { container } = render(<ConverterHarness />);

    const trigger = screen.getByRole("button", { name: "Open converter" });
    trigger.focus();
    fireEvent.click(trigger);

    const close = await screen.findByRole("button", { name: "Close" });
    await waitFor(() => expect(close).toHaveFocus());
    expect((await axe.run(container)).violations).toEqual([]);

    const cancel = screen.getByRole("button", { name: "Cancel" });
    cancel.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(close).toHaveFocus();

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Convert Dashboard" })).toBeNull());
    expect(trigger).toHaveFocus();
  });
});
