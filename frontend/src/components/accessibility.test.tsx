/**
 * Focused accessibility regression tests for shared panel interactions.
 */
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Token } from "../types";

vi.mock("./CodeSection", () => ({ CodeSection: () => <div>Embed panel</div> }));
vi.mock("./SessionsPanel", () => ({ SessionsPanel: () => <div>Sessions panel</div> }));
vi.mock("./ActivityPanel", () => ({ ActivityPanel: () => <div>Activity panel</div> }));
vi.mock("./DisplaySettings", () => ({ DisplaySettings: () => <div>Preferences panel</div> }));
vi.mock("./EntitiesEditor", () => ({ EntitiesEditor: () => <div>Entities panel</div> }));
vi.mock("./SecurityEditor", () => ({ SecurityEditor: () => <div>Security panel</div> }));

import { ConfigTabCard } from "./ConfigTabCard";
import { CopyablePre, ErrorBanner } from "./Shared";

const token = {
  token_id: "hwt_a3F9bC2d114eF5A6b7c8dE",
  token_version: 1,
  entities: [],
  active_sessions: 0,
} as unknown as Token;

afterEach(cleanup);

describe("panel accessibility", () => {
  it("implements keyboard navigation for configuration tabs", () => {
    render(
      <ConfigTabCard
        token={token}
        tokenId={token.token_id}
        readonly={false}
        saving={false}
        setSaving={vi.fn()}
        setToken={vi.fn()}
        setError={vi.fn()}
        hmacSecret={null}
        setHmacSecret={vi.fn()}
        hmacSecretAcked={false}
        setHmacSecretAcked={vi.fn()}
        setSavedMsg={vi.fn()}
      />,
    );

    const entities = screen.getByRole("tab", { name: "Entities" });
    entities.focus();
    fireEvent.keyDown(entities, { key: "ArrowRight" });

    expect(screen.getByRole("tab", { name: "Embed" })).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Embed panel");
  });

  it("dismisses modal errors with Escape and has no basic axe violations", async () => {
    const dismiss = vi.fn();
    const { container } = render(
      <ErrorBanner message="Example failure" onDismiss={dismiss} onRetry={vi.fn()} />,
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(dismiss).toHaveBeenCalledOnce();

    const result = await axe.run(container);
    await waitFor(() => expect(result.violations).toEqual([]));
  });

  it("uses the copy button as the only code-copy interaction", () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    render(<CopyablePre text="example code" label="Copy example" />);

    fireEvent.click(screen.getByText("example code"));
    expect(writeText).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Copy example" }));
    expect(writeText).toHaveBeenCalledWith("example code");
  });
});
