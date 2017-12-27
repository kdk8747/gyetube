import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { HeaderComponent } from './header/header';
import { MenuComponent } from './menu/menu';
import { UserComponent } from './user/user';
import { PermissionComponent } from './permission/permission';
@NgModule({
	declarations: [
    HeaderComponent,
    MenuComponent,
    UserComponent,
    PermissionComponent
  ],
	imports: [
    CommonModule,
    TranslateModule.forChild(),
    IonicPageModule.forChild(HeaderComponent),
    IonicPageModule.forChild(MenuComponent),
    IonicPageModule.forChild(UserComponent),
    IonicPageModule.forChild(PermissionComponent)
  ],
  exports: [
    HeaderComponent,
    MenuComponent,
    UserComponent,
    PermissionComponent
  ]
})
export class ComponentsModule {}
