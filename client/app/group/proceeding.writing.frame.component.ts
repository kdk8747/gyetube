import { Component, EventEmitter, Input, Output } from '@angular/core';
import { State } from '../constants';
import { Proceeding, Policy } from '../_models';

import { ProceedingService, PolicyService, PolicyChangesetService } from '../_services';

@Component({
    selector: 'proceeding-writing-frame',
    template: `
        <div *ngIf="!selectedNewProceeding" (click)="selectedNewProceeding = true;">
            +
        </div>
        <div *ngIf="selectedNewProceeding">
            <label>Meeting Date:</label>
            <input [(ngModel)]="newProceedingMeetingDate" type="date" />
            <input [(ngModel)]="newProceedingMeetingTime" type="time" />
            <label>Title:</label> <input [(ngModel)]="newProceedingTitle" />
            <label>Content:</label> <input [(ngModel)]="newProceedingContent" />

            <label>Policy Changeset:</label>
            <button *ngIf="!policyChangesetService.isActivated" (click)="onAddPolicyChangeset()"> Add </button>
            <button *ngIf="policyChangesetService.isActivated" (click)="onCancelPolicyChangeset()"> Cancel </button>
            <policy-changeset [policyChangeset]="policyChangesetService.policies" [changeMode]="true"></policy-changeset>
            <button (click)="onNewProceeding();">
                Create
            </button>
            <button (click)="onCancelNewProceeding();">
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

export class ProceedingWritingFrameComponent {
    @Input() policies: Policy[];
    @Input() proceedings: Proceeding[];
    @Output() policiesRefreshRequested = new EventEmitter<void>();
    //@Output() proceedingsRefreshRequested = new EventEmitter<Proceeding>();
    selectedNewProceeding: boolean = false;
    newProceedingMeetingDate: string;
    newProceedingMeetingTime: string;
    newProceedingTitle: string;
    newProceedingContent: string;

    constructor(
        private proceedingService: ProceedingService,
        private policyService: PolicyService,
        private policyChangesetService: PolicyChangesetService
    ) { }

    onNewProceeding(): void {
        this.newProceedingTitle = this.newProceedingTitle.trim();
        this.newProceedingContent = this.newProceedingContent.trim();
        if (!this.newProceedingTitle || !this.newProceedingContent) return;

        this.proceedingService.create(
            new Proceeding(0, 0, State.STATE_NEW_ONE, 
                            new Date(Date.now()),
                            new Date(this.newProceedingMeetingDate + ' ' + this.newProceedingMeetingTime),
                            this.newProceedingTitle, this.newProceedingContent, [])
        ).then((proceeding: Proceeding) => {
            let proceedingID = proceeding.id;
            this.proceedings.push(proceeding);
            this.selectedNewProceeding = false;

            this.policyChangesetService.policies.forEach(policy => {
                policy.content = policy.content.trim();
                if (!policy.content) return;
                this.policyService.create(
                    new Policy(0, 0, State.STATE_NEW_ONE,
                                new Date(Date.now()), new Date(policy.expiryDate),
                                policy.content, proceedingID, [])
                ).then((policy: Policy) => {
                    this.policies.push(policy);
                    this.newProceedingMeetingDate = this.newProceedingMeetingTime
                        = this.newProceedingTitle = this.newProceedingContent = '';
                    this.onCancelNewProceeding();
                });
            });
        });
    }

    onCancelNewProceeding(): void {
        this.selectedNewProceeding = false;
        this.onCancelPolicyChangeset();
    }

    onAddPolicyChangeset(): void {
        this.policyChangesetService.isActivated = true;
    }

    onCancelPolicyChangeset(): void {
        this.policyChangesetService.isActivated = false;
        this.policyChangesetService.policies = [];
        this.policiesRefreshRequested.emit();
    }
}