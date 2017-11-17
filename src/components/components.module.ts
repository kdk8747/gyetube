import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { StateLabelComponent } from './state-label/state-label';
import { MenuComponent } from './menu/menu';
import { HeaderComponent } from './header/header';
@NgModule({
	declarations: [
    StateLabelComponent,
    MenuComponent,
    HeaderComponent
  ],
	imports: [
    CommonModule,
    IonicModule.forRoot(MenuComponent),
    IonicModule.forRoot(HeaderComponent),
    TranslateModule.forChild()
  ],
	exports: [
    StateLabelComponent,
    MenuComponent,
    HeaderComponent
  ]
})
export class ComponentsModule {}
