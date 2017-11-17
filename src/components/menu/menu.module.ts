import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { MenuComponent } from './menu';
@NgModule({
	declarations: [
    MenuComponent
  ],
	imports: [
    CommonModule,
    IonicModule.forRoot(MenuComponent),
    TranslateModule.forChild()
  ],
	exports: [
    MenuComponent
  ]
})
export class MenuComponentModule {}
