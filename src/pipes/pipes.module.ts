import { NgModule } from '@angular/core';
import { LocalizedDatePipe } from './localized-date/localized-date';
@NgModule({
	declarations: [LocalizedDatePipe],
	imports: [],
	exports: [LocalizedDatePipe]
})
export class PipesModule {}
