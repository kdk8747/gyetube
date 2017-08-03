import { Component, Input } from '@angular/core';
import { State } from '../constants';
import { Decision } from '../_models';
import { DecisionChangesetService } from '../_services';

@Component({
    selector: 'decision',
    template: `
        <div class="decision">
            <span>createdDate: {{decision.createdDate | date:'y-MM-dd'}}</span>
            <label>content:</label>
            <input [readonly]="!decisionChangesetService.isActivated" [value]="decision.content"
                 #content (blur)="onBlurContent(content.value, expiryDate.value)" />
            <label>Expiry Date:</label>
            <input [readonly]="!decisionChangesetService.isActivated" [value]="decision.expiryDate.toISOString().substr(0,10)" type="date"
                 #expiryDate (blur)="onBlurExpiryDate(content.value, expiryDate.value)" />
            <button *ngIf="decisionChangesetService.isActivated && changeDetected" (click)="onUpdate(content.value, expiryDate.value)" >Update</button>
            <button *ngIf="decisionChangesetService.isActivated" (click)="onDelete()" >Delete</button>
        </div>
    `,
    styles: [`
        div {
            border: 1px solid #000000;
            text-align: center;
        }
    `]
})

export class DecisionComponent {
    @Input() decision: Decision;
    changeDetected: boolean = false;

    constructor(
        private decisionChangesetService: DecisionChangesetService
    ) { }

    isChanged(content: string, expiryDate: string): boolean {
        return this.decision.content !== content || this.decision.expiryDate.toISOString().substr(0, 10) !== expiryDate;
    }

    onBlurContent(content: string, expiryDate: string): void {
        this.changeDetected = this.isChanged(content, expiryDate);
        if (this.changeDetected)
            this.onUpdate(content, expiryDate);
        else
            this.onCancel();
    }

    onBlurExpiryDate(content: string, expiryDate: string): void {
        this.changeDetected = this.isChanged(content, expiryDate);
        if (this.changeDetected)
            this.onUpdate(content, expiryDate);
        else
            this.onCancel();
    }

    onCancel(): void {
        this.decisionChangesetService.decisions = this.decisionChangesetService.decisions
            .filter(item => item.prevId != this.decision.id || item.state != State.STATE_UPDATED);
    }

    onDelete(): void {
        let found = this.decisionChangesetService.decisions.findIndex(item => item.prevId == this.decision.id);
        let decision = new Decision(0, this.decision.id, State.STATE_DELETED, new Date(Date.now()), new Date(Date.now()), this.decision.content, 0, []);

        if (found != -1)
            this.decisionChangesetService.decisions[found] = decision;
        else 
            this.decisionChangesetService.decisions.push(decision);
    }

    onUpdate(content: string, expiryDate: string): void {
        let found = this.decisionChangesetService.decisions.findIndex(item => item.prevId == this.decision.id);
        let decision = new Decision(0, this.decision.id, State.STATE_UPDATED, new Date(Date.now()), new Date(expiryDate), content, 0, []);

        if (found != -1) 
            this.decisionChangesetService.decisions[found] = decision;
        else
            this.decisionChangesetService.decisions.push(decision);
    }
}