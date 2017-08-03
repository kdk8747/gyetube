import { Component, OnInit, Input } from '@angular/core';
import { Proceeding, Decision } from '../_models';

import { DecisionService } from '../_services';

@Component({
    selector: 'proceeding',
    template: `
        <div class="proceeding">
            <span>createdDate: {{proceeding.createdDate | date:'y-MM-dd'}}</span>
            <span>meetingDate: {{proceeding.meetingDate | date:'y-MM-dd'}}</span>
            <span>title: {{proceeding.title}}</span>
            <span>content: {{proceeding.content}}</span>
            <label>Decision Changeset:</label>
            <decision-changeset [decisionChangeset]="decisionChangeset" [changeMode]="false"></decision-changeset>
        </div>
    `,
    styles: [`
        div {
            border: 1px solid #000000;
            text-align: center;
        }
    `]
})

export class ProceedingComponent implements OnInit{
    decisionChangeset: Decision[] = [];
    isSelected: boolean;
    @Input() proceeding: Proceeding;
    
    constructor(
        private decisionService: DecisionService
    ) { }

    ngOnInit(): void {
        this.proceeding.childDecisions.forEach(childDecisionId => {
            this.decisionService.getDecision(childDecisionId)
                .then(decision => {
                    this.decisionChangeset.push(decision)
                })
        });
    }
}