import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./auctions/auctions.component').then(m => m.AuctionsComponent);
    }
  },
];
