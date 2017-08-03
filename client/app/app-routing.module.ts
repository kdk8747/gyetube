import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GroupComponent } from './group';
import { GreetingComponent } from './greeting.component';
import { LoginComponent } from './login.component';
import { MyPageComponent } from './mypage.component';
 
const routes: Routes = [
  //{ path: '', redirectTo: 'suwongreenparty', pathMatch: 'full' },
  { path: '',  component: GreetingComponent },
  { path: 'mypage',  component: MyPageComponent },
  { path: 'suwongreenparty',  component: GroupComponent },
  { path: 'login',  component: LoginComponent },
  { path: 'oauth',  component: LoginComponent }
];
 
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }