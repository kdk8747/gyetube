import { Component, Input } from '@angular/core';
import { Policy } from '../_models';
import { State } from '../constants';

@Component({
    selector: 'policy-changeset',
    template: `
        <ul>
            <li *ngFor="let policy of policyChangeset">
                <div [ngSwitch]="policy.state">
                    <div *ngSwitchCase="stateEnum.STATE_NEW_ONE">
                        create {{ policy.content }}
                        <button *ngIf="changeMode" (click)="onCancel(policy)" >X</button>
                    </div>
                    <div *ngSwitchCase="stateEnum.STATE_UPDATED">
                        update {{ policy.content }}
                        <button *ngIf="changeMode" (click)="onCancel(policy)" >X</button>
                    </div>
                    <div *ngSwitchCase="stateEnum.STATE_DELETED">
                        delete {{ policy.content }}
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

    onCancel(policy: Policy): void {
        this.policyChangeset = this.policyChangeset.filter(item => item !== policy);
    }
}