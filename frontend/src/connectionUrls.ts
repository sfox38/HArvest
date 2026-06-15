/**
 * Resolve the script and live transport origins used by generated snippets.
 */

export interface WidgetConnectionUrls {
  haUrl: string;
  scriptUrl: string;
}

function alternateOrigin(haUrl: string, port: number): string {
  try {
    const url = new URL(haUrl);
    url.port = String(port);
    return url.origin;
  } catch {
    return `${haUrl.replace(/\/+$/, "")}:${port}`;
  }
}

export function resolveWidgetConnectionUrls(
  haUrl: string,
  widgetScriptUrl: string,
  externalPort: number,
): WidgetConnectionUrls {
  const baseUrl = haUrl.replace(/\/+$/, "");
  const customScriptUrl = widgetScriptUrl.trim();
  if (customScriptUrl) {
    return { haUrl: baseUrl, scriptUrl: customScriptUrl };
  }
  if (externalPort > 0) {
    const alternateUrl = alternateOrigin(baseUrl, externalPort);
    return {
      haUrl: alternateUrl,
      scriptUrl: `${alternateUrl}/harvest.min.js`,
    };
  }
  return {
    haUrl: baseUrl,
    scriptUrl: `${baseUrl}/harvest_assets/harvest.min.js`,
  };
}
