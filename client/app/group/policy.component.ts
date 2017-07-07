import { Component, EventEmitter, Input, Output } from '@angular/core';
import { State } from '../constants';
import { Policy } from '../_models';
import { PolicyChangesetService } from '../_services';

@Component({
    selector: 'policy',
    template: `
        <div class="policy">
            <span>createdDate: {{policy.createdDate | date:'y-MM-dd'}}</span>
            <label>content:</label>
            <input [readonly]="!changeMode" [value]="policy.content"
                 #content (blur)="onBlurContent(content.value, expiryDate.value)" />
            <label>Expiry Date:</label>
            <input [readonly]="!changeMode" [value]="policy.expiryDate.toISOString().substr(0,10)" type="date"
                 #expiryDate (blur)="onBlurExpiryDate(content.value, expiryDate.value)" />
            <button *ngIf="changeDetected" (click)="onUpdate(content.value, expiryDate.value)" >Update</button>
            <button *ngIf="changeMode" (click)="onDelete()" >Delete</button>
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

    isChanged(content: string, expiryDate: string): boolean {
        return this.policy.content !== content || this.policy.expiryDate.toISOString().substr(0, 10) !== expiryDate;
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
        this.policyChangesetService.policies = this.policyChangesetService.policies
            .filter(item => item.prevId != this.policy.id || item.state != State.STATE_UPDATED);

        this.policyChangesetRequest.emit();
    }

    onDelete(): void {
        let found = this.policyChangesetService.policies.findIndex(item => item.prevId == this.policy.id);
        let policy = new Policy(0, this.policy.id, State.STATE_DELETED, new Date(Date.now()), new Date(Date.now()), this.policy.content, 0, []);

        if (found != -1)
            this.policyChangesetService.policies[found] = policy;
        else 
            this.policyChangesetService.policies.push(policy);

        this.policyChangesetRequest.emit();
    }

    onUpdate(content: string, expiryDate: string): void {
        let found = this.policyChangesetService.policies.findIndex(item => item.prevId == this.policy.id);
        let policy = new Policy(0, this.policy.id, State.STATE_UPDATED, new Date(Date.now()), new Date(expiryDate), content, 0, []);

        if (found != -1) 
            this.policyChangesetService.policies[found] = policy;
        else
            this.policyChangesetService.policies.push(policy);

        this.policyChangesetRequest.emit();
    }
}