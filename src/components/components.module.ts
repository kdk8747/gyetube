import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { StateLabelComponent } from './state-label/state-label';
@NgModule({
	declarations: [StateLabelComponent],
	imports: [
    CommonModule,
    TranslateModule.forChild()
  ],
	exports: [StateLabelComponent]
})
export class ComponentsModule {}
