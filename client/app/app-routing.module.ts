import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GroupComponent } from './group';
 
const routes: Routes = [
  { path: '', redirectTo: '/suwongreenparty', pathMatch: 'full' },
  { path: 'suwongreenparty',  component: GroupComponent }
];
 
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }