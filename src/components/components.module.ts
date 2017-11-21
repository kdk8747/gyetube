import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { HeaderComponent } from './header/header';
import { MenuComponent } from './menu/menu';
import { StateLabelComponent } from './state-label/state-label';
import { UserComponent } from './user/user';
@NgModule({
	declarations: [
    HeaderComponent,
    MenuComponent,
    StateLabelComponent,
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
    StateLabelComponent,
    UserComponent
  ]
})
export class ComponentsModule {}
