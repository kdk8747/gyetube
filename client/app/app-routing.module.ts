import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GroupComponent, LoginComponent } from './group';
 
const routes: Routes = [
  { path: '', redirectTo: 'suwongreenparty', pathMatch: 'full' },
  { path: 'suwongreenparty',  component: GroupComponent },
  { path: 'login',  component: LoginComponent }
];
 
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }