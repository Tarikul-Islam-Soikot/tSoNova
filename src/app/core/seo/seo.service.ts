import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SITE_NAME, SITE_URL } from './seo.constants';
import type { SeoRouteData } from './seo.models';

const JSON_LD_ELEMENT_ID = 'seo-json-ld';

/** Drives per-route description/canonical/robots/OG/Twitter/JSON-LD tags
 * off each route's `data.seo` (see `SeoRouteData`). Root-provided, single
 * instance for the app's lifetime — constructed once from `App`'s
 * constructor so its `Router.events` subscription is live before the
 * first navigation resolves.
 *
 * Works identically during the build-time prerender pass and in a real
 * browser after hydration — same design as ChessMentor's own
 * `SeoService` (see that repo's `docs/SEO-PROGRESS.md` Phase 2 notes for
 * the og:title/twitter:title timing bug this already avoids by reading
 * the title off the route snapshot rather than `Title.getTitle()`). */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        const { data, title } = this.deepestRouteInfo();
        this.applySeo(data, title);
      });
  }

  private deepestRouteInfo(): { data: SeoRouteData | null; title: string } {
    let route = this.activatedRoute.firstChild;
    let deepest = route;
    while (route?.firstChild) {
      route = route.firstChild;
      deepest = route;
    }
    const snapshot = deepest?.snapshot;
    return {
      data: (snapshot?.data['seo'] as SeoRouteData | undefined) ?? null,
      title: snapshot?.title ?? this.titleService.getTitle(),
    };
  }

  private applySeo(data: SeoRouteData | null, title: string): void {
    const url = `${SITE_URL}${this.router.url}`;
    this.setCanonical(url);

    if (data) {
      this.meta.updateTag({ name: 'description', content: data.description });
      this.meta.updateTag({ name: 'robots', content: data.robots ?? 'index, follow' });
    }

    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: title });

    if (data) {
      this.meta.updateTag({ property: 'og:description', content: data.description });
      this.meta.updateTag({ name: 'twitter:description', content: data.description });
    }

    this.setJsonLd(data?.jsonLd ?? null);
  }

  private setCanonical(url: string): void {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setJsonLd(json: Record<string, unknown> | null): void {
    this.document.getElementById(JSON_LD_ELEMENT_ID)?.remove();
    if (!json) return;

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = JSON_LD_ELEMENT_ID;
    script.text = JSON.stringify(json);
    this.document.head.appendChild(script);
  }
}
