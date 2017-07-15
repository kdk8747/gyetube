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
    @Output() proceedingsRefreshRequested = new EventEmitter<void>();
    selectedNewProceeding: boolean = false;

    dateNow: Date = new Date(Date.now());
    newProceedingMeetingDate: string = this.dateNow.toISOString().slice(0,10);
    newProceedingMeetingTime: string = this.dateNow.getHours() + ':' + this.dateNow.getMinutes();
    newProceedingTitle: string;
    newProceedingContent: string;

    constructor(
        private proceedingService: ProceedingService,
        private policyService: PolicyService,
        private policyChangesetService: PolicyChangesetService
    ) { }

    onNewProceeding(): void {
        if (!this.newProceedingTitle || !this.newProceedingContent) return;
        this.newProceedingTitle = this.newProceedingTitle.trim();
        this.newProceedingContent = this.newProceedingContent.trim();

        let newProceeding = new Proceeding(0, 0, State.STATE_NEW_ONE, 
                            new Date(Date.now()),
                            new Date(this.newProceedingMeetingDate + ' ' + this.newProceedingMeetingTime),
                            this.newProceedingTitle, this.newProceedingContent, []);
        this.proceedingService.create(newProceeding)
        .then((proceeding: Proceeding) => {
            newProceeding.id = proceeding.id;
            this.selectedNewProceeding = false;

            Promise.all(this.policyChangesetService.policies.map(policy => this.policyService.create(policy)))
            .then((policies: Policy[]) => {
                newProceeding.childPolicies = policies.map(policy => {this.policies.push(policy); return policy.id});
                this.proceedingService.update(newProceeding)
                .then((proceeding: Proceeding) => {
                    this.proceedings.push(proceeding);
                    this.proceedingsRefreshRequested.emit();
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