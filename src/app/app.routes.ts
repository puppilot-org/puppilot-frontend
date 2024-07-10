import { Routes } from '@angular/router';
import { CollectionsComponent } from './collections/collections.component';
import { MarketComponent } from './market/market.component';
import { RoutinesComponent } from './routines/routines.component';

export const routes: Routes = [
  { path: '', redirectTo: '/collections', pathMatch: 'full' },
  { path: 'collections', component: CollectionsComponent },
  { path: 'routines', component: RoutinesComponent },
  { path: 'market', component: MarketComponent },
];
