import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { HeaderComponent } from './header/header';
import { MenuComponent } from './menu/menu';
import { UserComponent } from './user/user';
@NgModule({
	declarations: [
    HeaderComponent,
    MenuComponent,
    UserComponent
  ],
	imports: [
    CommonModule,
    TranslateModule.forChild(),
    IonicPageModule.forChild(HeaderComponent),
    IonicPageModule.forChild(MenuComponent),
    IonicPageModule.forChild(UserComponent)
  ],
  exports: [
    HeaderComponent,
    MenuComponent,
    UserComponent
  ]
})
export class ComponentsModule {}
