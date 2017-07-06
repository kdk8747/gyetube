import { Component, OnInit, Input } from '@angular/core';
import { Proceeding, Policy } from '../_models';

import { PolicyListService } from '../_services';

@Component({
    selector: 'proceeding',
    template: `
        <div class="proceeding">
            <span>date: {{proceeding.date | date:'y-MM-dd'}}</span>
            <span>title: {{proceeding.title}}</span>
            <span>content: {{proceeding.content}}</span>
            <label>Policy Changeset:</label>
            <policy-changeset [policyChangeset]="policyChangeset" [changeMode]="false"></policy-changeset>
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
    policyChangeset: Policy[] = [];
    isSelected: boolean;
    @Input() proceeding: Proceeding;
    
    constructor(
        private policyListService: PolicyListService
    ) { }

    ngOnInit(): void {
        // FIX ME //
        this.policyChangeset = this.policyListService.get().filter(policy => {
            return this.proceeding.childPolicies.some(id => id === policy.id)
        });
    }
}