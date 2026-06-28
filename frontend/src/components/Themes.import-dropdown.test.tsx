/**
 * Regression test: the Themes "Import .zip" dropdown must work inside the
 * panel's shadow root.
 *
 * The panel renders inside a shadow root, so a document-level mousedown
 * listener sees e.target retargeted to the shadow host. An outside-click check
 * using contains(e.target) therefore treats clicks on the menu as "outside"
 * and closes the menu on mousedown - before the item's click fires - so both
 * import options silently do nothing. The fix uses e.composedPath().
 *
 * These tests render Themes in a real shadow root and dispatch composed mouse
 * events (as real browsers do) so the retargeting path is exercised. They fail
 * against the contains(e.target) implementation and pass with composedPath().
 */
import { act, cleanup, fireEvent, render, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  themesList: vi.fn(),
  tokensList: vi.fn(),
  renderersList: vi.fn(),
  githubList: vi.fn(),
  githubDownload: vi.fn(),
  importZip: vi.fn(),
}));

vi.mock("../api", () => ({
  api: {
    themes: {
      list: mocks.themesList,
      githubList: mocks.githubList,
      githubDownload: mocks.githubDownload,
      importZip: mocks.importZip,
    },
    tokens: { list: mocks.tokensList },
    renderers: { list: mocks.renderersList },
  },
}));

vi.mock("./WidgetPreview", () => ({
  WidgetPreview: () => null,
  clearRendererCache: vi.fn(),
}));

import { Themes } from "./Themes";

const hosts: HTMLElement[] = [];

function renderInShadow() {
  const host = document.createElement("div");
  document.body.appendChild(host);
  hosts.push(host);
  const shadow = host.attachShadow({ mode: "open" });
  const container = document.createElement("div");
  shadow.appendChild(container);
  render(<Themes onSelectToken={vi.fn()} />, { container });
  return { container, shadow, q: within(container) };
}

// Real mouse events are composed (they cross shadow boundaries). The default
// MouseEvent is not, so we set it explicitly to reproduce the retargeting.
function composedMouse(type: string): MouseEvent {
  return new MouseEvent(type, { bubbles: true, composed: true });
}

async function openMenu(q: ReturnType<typeof within>) {
  const importBtn = await q.findByRole("button", { name: /import \.zip/i });
  fireEvent.click(importBtn);
  return importBtn;
}

beforeEach(() => {
  mocks.themesList.mockResolvedValue([]);
  mocks.tokensList.mockResolvedValue([]);
  mocks.renderersList.mockResolvedValue({ renderers: [], agreed: true });
  mocks.githubList.mockResolvedValue([
    { name: "neu.zip", size: 1024, download_url: "https://example.com/neu.zip" },
  ]);
});

afterEach(() => {
  cleanup();
  while (hosts.length) hosts.pop()?.remove();
  vi.clearAllMocks();
});

describe("Themes import dropdown (shadow DOM)", () => {
  it("survives a composed mousedown and opens the GitHub picker", async () => {
    const { q } = renderInShadow();
    await openMenu(q);

    const githubItem = await q.findByText(/Download from HArvest GitHub/i);
    act(() => { githubItem.dispatchEvent(composedMouse("mousedown")); });

    // Menu is still open - the buggy contains(e.target) check would have closed
    // it on mousedown, unmounting this item before the click below.
    expect(q.getByText(/Download from HArvest GitHub/i)).toBeInTheDocument();

    fireEvent.click(githubItem);

    // The item's action fired: the GitHub picker dialog is shown.
    expect(await q.findByText(/Import from HArvest GitHub/i)).toBeInTheDocument();
  });

  it("survives a composed mousedown and triggers the local file input", async () => {
    const { q, container } = renderInShadow();
    await openMenu(q);

    const localItem = await q.findByText(/Choose a local file/i);
    const fileInput = container.querySelector(
      'input[type="file"][aria-label="Import theme file"]',
    ) as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, "click").mockImplementation(() => {});

    act(() => { localItem.dispatchEvent(composedMouse("mousedown")); });
    expect(q.getByText(/Choose a local file/i)).toBeInTheDocument();

    fireEvent.click(localItem);
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it("still closes the menu on a genuine outside click", async () => {
    const { q, shadow } = renderInShadow();
    await openMenu(q);
    expect(q.getByText(/Choose a local file/i)).toBeInTheDocument();

    // An element in the tray but outside the dropdown subtree.
    const outside = shadow.querySelector(".theme-tray-main")!;
    act(() => { outside.dispatchEvent(composedMouse("mousedown")); });

    await waitFor(() =>
      expect(q.queryByText(/Choose a local file/i)).not.toBeInTheDocument(),
    );
  });
});
