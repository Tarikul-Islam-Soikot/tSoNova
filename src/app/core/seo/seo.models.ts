export type RobotsDirective = 'index, follow' | 'noindex, follow' | 'noindex, nofollow';

/** Attached as a route's `data.seo` — read by `SeoService` on every
 * navigation to (re)populate the description/robots/OG/JSON-LD tags for
 * whichever route just activated. */
export interface SeoRouteData {
  description: string;
  /** Defaults to `'index, follow'` when omitted. */
  robots?: RobotsDirective;
  /** Schema.org JSON-LD payload, injected as-is if present. */
  jsonLd?: Record<string, unknown>;
}
