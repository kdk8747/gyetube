import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from './header';
@NgModule({
	declarations: [
    HeaderComponent
  ],
	imports: [
    CommonModule,
    IonicModule.forRoot(HeaderComponent),
    TranslateModule.forChild()
  ],
	exports: [
    HeaderComponent
  ]
})
export class HeaderComponentModule {}
