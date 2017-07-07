import { Component, Input } from '@angular/core';
import { Policy } from '../_models';
import { State } from '../constants';
import { PolicyChangesetService } from '../_services';

@Component({
    selector: 'policy-changeset',
    template: `
        <ul>
            <li *ngFor="let policy of policyChangeset">
                <div [ngSwitch]="policy.state">
                    <div *ngSwitchCase="stateEnum.STATE_NEW_ONE">
                        create {{ policy.content }} expiryDate {{ policy.expiryDate.toISOString().substr(0,10) }}
                        <button *ngIf="changeMode" (click)="onCancel(policy)" >X</button>
                    </div>
                    <div *ngSwitchCase="stateEnum.STATE_UPDATED">
                        update {{ policy.content }} expiryDate {{ policy.expiryDate.toISOString().substr(0,10) }}
                        <button *ngIf="changeMode" (click)="onCancel(policy)" >X</button>
                    </div>
                    <div *ngSwitchCase="stateEnum.STATE_DELETED">
                        delete {{ policy.content }} expiryDate {{ policy.expiryDate.toISOString().substr(0,10) }}
                        <button *ngIf="changeMode" (click)="onCancel(policy)" >X</button>
                    </div>
                    <div *ngSwitchDefault > unknown </div>
                </div>
            </li>
        </ul>
    `,
    styles: [`
        div {
            border: 1px solid #000000;
            text-align: center;
        }
    `]
})

export class PolicyChangesetComponent {
    @Input() policyChangeset: Policy[];
    @Input() changeMode: boolean;
    stateEnum = State;

    constructor(
        private policyChangesetService: PolicyChangesetService
    ) { }

    onCancel(policy: Policy): void {
        this.policyChangesetService.policies = this.policyChangeset = this.policyChangeset.filter(item => item !== policy);
    }
}