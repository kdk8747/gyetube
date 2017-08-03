import { Component, Input } from '@angular/core';
import { Decision } from '../_models';
import { State } from '../constants';
import { DecisionChangesetService } from '../_services';

@Component({
    selector: 'decision-changeset',
    template: `
        <ul>
            <li *ngFor="let decision of decisionChangeset">
                <div [ngSwitch]="decision.state">
                    <div *ngSwitchCase="stateEnum.STATE_NEW_ONE">
                        create {{ decision.content }} expiryDate {{ decision.expiryDate.toISOString().substr(0,10) }}
                        <button *ngIf="changeMode" (click)="onCancel(decision)" >X</button>
                    </div>
                    <div *ngSwitchCase="stateEnum.STATE_UPDATED">
                        update {{ decision.content }} expiryDate {{ decision.expiryDate.toISOString().substr(0,10) }}
                        <button *ngIf="changeMode" (click)="onCancel(decision)" >X</button>
                    </div>
                    <div *ngSwitchCase="stateEnum.STATE_DELETED">
                        delete {{ decision.content }} expiryDate {{ decision.expiryDate.toISOString().substr(0,10) }}
                        <button *ngIf="changeMode" (click)="onCancel(decision)" >X</button>
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

export class DecisionChangesetComponent {
    @Input() decisionChangeset: Decision[];
    @Input() changeMode: boolean;
    stateEnum = State;

    constructor(
        private decisionChangesetService: DecisionChangesetService
    ) { }

    onCancel(decision: Decision): void {
        this.decisionChangesetService.decisions = this.decisionChangeset = this.decisionChangeset.filter(item => item !== decision);
    }
}