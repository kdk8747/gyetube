import { Component, EventEmitter, Input, Output } from '@angular/core';
import { State } from '../constants';
import { Policy } from '../_models';
import { PolicyChangesetService } from '../_services';

@Component({
    selector: 'policy',
    template: `
        <div class="policy">
            <label>content:</label>
            <input [readonly]="!changeMode" [value]="policy.content"
                 #content (blur)="onBlurContent(content.value)" />
            <label>Expiry Date:</label>
            <input [readonly]="!changeMode" [value]="policy.expiryDate.toISOString().substr(0,10)" type="date"
                 #expiryDate (blur)="onBlurExpiryDate(expiryDate.value)" />
            <button *ngIf="changeMode" (click)="onDelete()" >Delete</button>
            <button *ngIf="changeDetected" (click)="onUpdate(content.value, expiryDate.value)" >Update</button>
        </div>
    `,
    styles: [`
        div {
            border: 1px solid #000000;
            text-align: center;
        }
    `]
})

export class PolicyComponent {
    @Input() policy: Policy;
    @Input() changeMode: boolean;
    @Output() policyChangesetRequest = new EventEmitter<void>();
    changeDetected: boolean = false;

    constructor(
        private policyChangesetService: PolicyChangesetService
    ) { }

    onBlurContent(content: string): void {
        if (this.policy.content !== content)
            this.changeDetected = true;
    }

    onBlurExpiryDate(expiryDate: string): void {
        if (this.policy.expiryDate.toISOString().substr(0, 10) !== expiryDate)
            this.changeDetected = true;
    }

    onDelete(): void {
        if (this.policyChangesetService.policies.some(item => item.prevId == this.policy.id)) return;
        this.policyChangesetService.policies.push(
            new Policy(0, this.policy.id, State.STATE_DELETED, new Date(Date.now()), new Date(Date.now()), this.policy.content, 0, []));
        this.policyChangesetRequest.emit();
    }

    onUpdate(content: string, expiryDate: string): void {
        if (this.policyChangesetService.policies.some(item => item.prevId == this.policy.id)) return;
        this.policyChangesetService.policies.push(
            new Policy(0, this.policy.id, State.STATE_UPDATED, new Date(Date.now()), new Date(expiryDate), content, 0, []));
        this.policyChangesetRequest.emit();
    }
}