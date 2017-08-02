import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GroupComponent, LoginComponent } from './group';
import { GreetingComponent } from './greeting.component';
 
const routes: Routes = [
  //{ path: '', redirectTo: 'suwongreenparty', pathMatch: 'full' },
  { path: '',  component: GreetingComponent },
  { path: 'suwongreenparty',  component: GroupComponent },
  { path: 'login',  component: LoginComponent },
  { path: 'oauth',  component: LoginComponent }
];
 
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }