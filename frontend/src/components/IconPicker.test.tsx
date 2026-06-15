/**
 * IconPicker tests: MDI tab from the generated bundle tables, set-dropdown
 * switching with a mocked window.HArvest icon set, filtering, and the
 * onPick/onClear callbacks.
 */
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { IconPicker } from "./IconPicker";

const FA_SET = {
  icons: {
    "fa:bolt": { body: '<path d="M0 0h448v512z" fill="currentColor"/>', viewBox: "0 0 448 512" },
    "fa:sun": { body: '<path d="M1 1h2v2z" fill="currentColor"/>', viewBox: "0 0 512 512" },
  },
  aliases: { "mdi:flash": "fa:bolt" },
};

const PH_BODY = { body: '<path d="M1 1h2v2z" fill="currentColor"/>', viewBox: "0 0 256 256" };
const PH_SET = {
  icons: {
    "ph:lightbulb": PH_BODY,
    "ph:lightbulb-fill": PH_BODY,
    "ph:lightbulb-duotone": PH_BODY,
    // regular name that happens to end in a weight word; "ph:traffic" does
    // not exist, so this must stay in the Regular tab
    "ph:traffic-light": PH_BODY,
  },
  aliases: { "mdi:lightbulb": "ph:lightbulb" },
};

function mockHarvest() {
  (window as unknown as { HArvest: unknown }).HArvest = {
    getIconSet: (key: string) =>
      key === "fa" ? FA_SET : key === "ph" ? PH_SET : undefined,
    registerIconSet: () => {},
  };
}

afterEach(() => {
  cleanup();
  delete (window as unknown as { HArvest?: unknown }).HArvest;
});

describe("IconPicker", () => {
  it("opens on the MDI tab and picks a bundled icon", () => {
    const onPick = vi.fn();
    render(<IconPicker value={null} onPick={onPick} ariaLabel="Pick icon" />);
    fireEvent.click(screen.getByRole("button", { name: "Pick icon" }));
    fireEvent.change(screen.getByPlaceholderText("Filter icons..."), {
      target: { value: "lightbulb-outline" },
    });
    fireEvent.click(screen.getByTitle("mdi:lightbulb-outline"));
    expect(onPick).toHaveBeenCalledWith("mdi:lightbulb-outline");
  });

  it("switches to a loaded icon set via the dropdown and picks from it", () => {
    mockHarvest();
    const onPick = vi.fn();
    render(<IconPicker value={null} onPick={onPick} ariaLabel="Pick icon" />);
    fireEvent.click(screen.getByRole("button", { name: "Pick icon" }));
    fireEvent.change(screen.getByLabelText("Icon set"), { target: { value: "fa" } });
    expect(screen.getByTitle("fa:bolt")).toBeTruthy();
    fireEvent.click(screen.getByTitle("fa:bolt"));
    expect(onPick).toHaveBeenCalledWith("fa:bolt");
  });

  it("opens on the set matching the current value's prefix", () => {
    mockHarvest();
    render(<IconPicker value="fa:sun" onPick={() => {}} ariaLabel="Pick icon" />);
    fireEvent.click(screen.getByRole("button", { name: "Pick icon" }));
    const select = screen.getByLabelText("Icon set") as HTMLSelectElement;
    expect(select.value).toBe("fa");
    expect(screen.getByTitle("fa:sun").className).toContain("selected");
  });

  it("shows Reset to default only when a value and onClear are present", () => {
    mockHarvest();
    const onClear = vi.fn();
    render(
      <IconPicker value="fa:bolt" onPick={() => {}} onClear={onClear} ariaLabel="Pick icon" />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Pick icon" }));
    fireEvent.click(screen.getByText("Reset to default"));
    expect(onClear).toHaveBeenCalled();
  });

  it("splits Phosphor weights into separate dropdown entries", () => {
    mockHarvest();
    render(<IconPicker value={null} onPick={() => {}} ariaLabel="Pick icon" />);
    fireEvent.click(screen.getByRole("button", { name: "Pick icon" }));
    const select = screen.getByLabelText("Icon set") as HTMLSelectElement;

    fireEvent.change(select, { target: { value: "ph" } });
    expect(screen.getByTitle("ph:lightbulb")).toBeTruthy();
    expect(screen.getByTitle("ph:traffic-light")).toBeTruthy();
    expect(screen.queryByTitle("ph:lightbulb-fill")).toBeNull();

    fireEvent.change(select, { target: { value: "ph-fill" } });
    expect(screen.getByTitle("ph:lightbulb-fill")).toBeTruthy();
    expect(screen.queryByTitle("ph:lightbulb")).toBeNull();
    expect(screen.queryByTitle("ph:traffic-light")).toBeNull();

    fireEvent.change(select, { target: { value: "ph-duotone" } });
    expect(screen.getByTitle("ph:lightbulb-duotone")).toBeTruthy();
  });

  it("opens on the matching Phosphor weight entry for a weighted value", () => {
    mockHarvest();
    render(<IconPicker value="ph:lightbulb-duotone" onPick={() => {}} ariaLabel="Pick icon" />);
    fireEvent.click(screen.getByRole("button", { name: "Pick icon" }));
    const select = screen.getByLabelText("Icon set") as HTMLSelectElement;
    expect(select.value).toBe("ph-duotone");
    expect(screen.getByTitle("ph:lightbulb-duotone").className).toContain("selected");
  });

  it("opens on the widget's effective set when no value is set", () => {
    mockHarvest();
    render(
      <IconPicker value={null} onPick={() => {}} ariaLabel="Pick icon" defaultSetId="fa" />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Pick icon" }));
    expect((screen.getByLabelText("Icon set") as HTMLSelectElement).value).toBe("fa");
  });

  it("auto-applies the equivalent icon when the set dropdown changes", async () => {
    mockHarvest();
    const onPick = vi.fn();
    render(
      <IconPicker value={null} onPick={onPick} ariaLabel="Pick icon" defaultIcon="mdi:flash" />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Pick icon" }));
    fireEvent.change(screen.getByLabelText("Icon set"), { target: { value: "fa" } });
    await waitFor(() => expect(onPick).toHaveBeenCalledWith("fa:bolt"));
  });

  it("auto-applies the weighted equivalent for Phosphor weight entries", async () => {
    mockHarvest();
    const onPick = vi.fn();
    render(
      <IconPicker value={null} onPick={onPick} ariaLabel="Pick icon" defaultIcon="mdi:lightbulb" />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Pick icon" }));
    fireEvent.change(screen.getByLabelText("Icon set"), { target: { value: "ph-duotone" } });
    await waitFor(() => expect(onPick).toHaveBeenCalledWith("ph:lightbulb-duotone"));
  });

  it("switching back to Material Design clears a set-equivalent override", async () => {
    mockHarvest();
    const onPick = vi.fn();
    const onClear = vi.fn();
    render(
      <IconPicker
        value="fa:bolt"
        onPick={onPick}
        onClear={onClear}
        ariaLabel="Pick icon"
        defaultIcon="mdi:flash"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Pick icon" }));
    fireEvent.change(screen.getByLabelText("Icon set"), { target: { value: "mdi" } });
    // fa:bolt reverse-translates to mdi:flash, which IS the default icon,
    // so the override clears instead of pinning the same glyph.
    await waitFor(() => expect(onClear).toHaveBeenCalled());
    expect(onPick).not.toHaveBeenCalled();
  });

  it("filters set names without their prefix", () => {
    mockHarvest();
    render(<IconPicker value={null} onPick={() => {}} ariaLabel="Pick icon" />);
    fireEvent.click(screen.getByRole("button", { name: "Pick icon" }));
    fireEvent.change(screen.getByLabelText("Icon set"), { target: { value: "fa" } });
    fireEvent.change(screen.getByPlaceholderText("Filter icons..."), {
      target: { value: "sun" },
    });
    expect(screen.queryByTitle("fa:bolt")).toBeNull();
    expect(screen.getByTitle("fa:sun")).toBeTruthy();
  });
});
