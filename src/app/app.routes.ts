import { Routes } from '@angular/router';
import type { SeoRouteData } from './core/seo/seo.models';
import { SITE_URL } from './core/seo/seo.constants';

const HOME_DESCRIPTION =
  'tSoNova builds practical software for everyday life — AI, microchip design and everyday ' +
  'utilities, thoughtfully made, free to use, with nothing to buy and nothing to sign up for. ' +
  'First up: ChessMentor.';

const HOME_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'tSoNova',
  description: HOME_DESCRIPTION,
  url: SITE_URL,
  sameAs: ['https://chessmentor.tsonova.com'],
};

export const routes: Routes = [
  {
    path: '',
    title: 'tSoNova — Practical Software for Everyday Life',
    data: {
      seo: {
        description: HOME_DESCRIPTION,
        jsonLd: HOME_JSON_LD,
      } satisfies SeoRouteData,
    },
    loadComponent: () => import('./features/home/home-page/home-page').then((m) => m.HomePage),
  },
  {
    path: 'team',
    title: 'Team — tSoNova',
    data: {
      seo: {
        description:
          'Meet the small team building tSoNova — working across AI, microchip design and ' +
          'everyday utilities.',
      } satisfies SeoRouteData,
    },
    loadComponent: () => import('./features/team/team-page/team-page').then((m) => m.TeamPage),
  },
  { path: '**', redirectTo: '' },
];
