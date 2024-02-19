import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { CookiePolicyComponent } from './components/cookie-policy/cookie-policy.component';
import { Home2Component } from './components/home2/home2.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: '2', component: Home2Component, pathMatch: 'full' },
  { path: 'cookie-policy', component: CookiePolicyComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
