import { Component, Input } from '@angular/core';
import { State } from '../constants';
import { Proceeding, Policy } from '../_models';

import { PolicyChangesetService } from '../_services';

@Component({
    selector: 'policy-writing-frame',
    template: `
        <div *ngIf="!selectedNewPolicy && policyChangesetService.isActivated" (click)="selectedNewPolicy = true">+</div>
        <div *ngIf="selectedNewPolicy && policyChangesetService.isActivated">
            <label>Content:</label> <input #content />
            <label>Expiry Date:</label> <input type="date" #expiryDate [value]="initialExpiryDate.toISOString().slice(0,10)" />
            <button (click)="onNewPolicy(content.value, expiryDate.value) ? content.value='' : '';">
                Done
            </button>
            <button (click)="selectedNewPolicy=false; content.value=''">
                Cancel
            </button>
        </div>
    `,
    styles: [`
        div {
            border: 1px solid #000000;
            text-align: center;
        }
    `]
})

export class PolicyWritingFrameComponent {
    selectedNewPolicy: boolean = false;
    
    dateNow: Date = new Date(Date.now());
    initialExpiryDate: Date = new Date(this.dateNow.setMonth(this.dateNow.getMonth() + 1));

    constructor(
        private policyChangesetService: PolicyChangesetService
    ) { }

    onNewPolicy(content: string, expiryDate: string): boolean {
        if (!content || !expiryDate) return false;
        content = content.trim();
        this.policyChangesetService.policies.push(new Policy(0, 0, State.STATE_NEW_ONE, new Date(Date.now()), new Date(expiryDate), content, 0, []));
        this.selectedNewPolicy = false;
        return true;
    }
}