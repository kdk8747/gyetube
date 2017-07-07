import { Component, OnInit, Input } from '@angular/core';
import { Proceeding, Policy } from '../_models';

import { PolicyService } from '../_services';

@Component({
    selector: 'proceeding',
    template: `
        <div class="proceeding">
            <span>createdDate: {{proceeding.createdDate | date:'y-MM-dd'}}</span>
            <span>meetingDate: {{proceeding.meetingDate | date:'y-MM-dd'}}</span>
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
        private policyService: PolicyService
    ) { }

    ngOnInit(): void {
        this.proceeding.childPolicies.forEach(childPolicyId => {
            this.policyService.getPolicy(childPolicyId)
                .then(policy => {
                    this.policyChangeset.push(policy)
                })
        });
    }
}