import { Component, Input } from '@angular/core';
import { State } from '../constants';
import { Proceeding, Decision } from '../_models';

import { DecisionChangesetService } from '../_services';

@Component({
    selector: 'decision-writing-frame',
    template: `
        <div *ngIf="!selectedNewDecision && decisionChangesetService.isActivated" (click)="selectedNewDecision = true">+</div>
        <div *ngIf="selectedNewDecision && decisionChangesetService.isActivated">
            <label>Content:</label> <input #content />
            <label>Expiry Date:</label> <input type="date" #expiryDate [value]="initialExpiryDate.toISOString().slice(0,10)" />
            <button (click)="onNewDecision(content.value, expiryDate.value) ? content.value='' : '';">
                Create
            </button>
            <button (click)="selectedNewDecision=false; content.value=''">
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

export class DecisionWritingFrameComponent {
    selectedNewDecision: boolean = false;
    
    dateNow: Date = new Date(Date.now());
    initialExpiryDate: Date = new Date(this.dateNow.setMonth(this.dateNow.getMonth() + 1));

    constructor(
        private decisionChangesetService: DecisionChangesetService
    ) { }

    onNewDecision(content: string, expiryDate: string): boolean {
        if (!content || !expiryDate) return false;
        content = content.trim();
        this.decisionChangesetService.decisions.push(new Decision(0, 0, State.STATE_NEW_ONE, new Date(Date.now()), new Date(expiryDate), content, 0, []));
        this.selectedNewDecision = false;
        return true;
    }
}