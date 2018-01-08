import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { HeaderComponent } from './header/header';
import { MenuComponent } from './menu/menu';
import { UserComponent } from './user/user';
import { PermissionComponent } from './permission/permission';
import { MemberRegisterButtonComponent } from './member-register-button/member-register-button';
@NgModule({
	declarations: [
    HeaderComponent,
    MenuComponent,
    UserComponent,
    PermissionComponent,
    MemberRegisterButtonComponent
  ],
	imports: [
    CommonModule,
    TranslateModule.forChild(),
    IonicPageModule.forChild(HeaderComponent),
    IonicPageModule.forChild(MenuComponent),
    IonicPageModule.forChild(UserComponent),
    IonicPageModule.forChild(PermissionComponent),
    IonicPageModule.forChild(MemberRegisterButtonComponent)
  ],
  exports: [
    HeaderComponent,
    MenuComponent,
    UserComponent,
    PermissionComponent,
    MemberRegisterButtonComponent
  ]
})
export class ComponentsModule {}
