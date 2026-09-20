import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home-page/home-page').then((m) => m.HomePage),
  },
  {
    path: 'team',
    loadComponent: () => import('./features/team/team-page/team-page').then((m) => m.TeamPage),
  },
  { path: '**', redirectTo: '' },
];
