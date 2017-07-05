import { Component, Input } from '@angular/core';
import { Proceeding } from '../_models';

import { PolicyListService } from '../_services';

@Component({
    selector: 'proceeding',
    template: `
        <div class="proceeding">
            <span>date: {{proceeding.date | date:'y-MM-dd'}}</span>
            <span>title: {{proceeding.title}}</span>
            <span>content: {{proceeding.content}}</span>
            <label>changes of activity policies:</label>
        </div>
    `,
    styles: [`
        div {
            border: 1px solid #000000;
            text-align: center;
        }
    `]
})

export class ProceedingComponent {
    isSelected: boolean;
    @Input() proceeding: Proceeding;
    
    constructor(
        private policyListService: PolicyListService
    ) { }
}