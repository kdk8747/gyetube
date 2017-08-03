import { Component, EventEmitter, Input, Output } from '@angular/core';
import { State } from '../constants';
import { Proceeding, Decision } from '../_models';

import { ProceedingService, DecisionService, DecisionChangesetService } from '../_services';

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

            <label>Decision Changeset:</label>
            <button *ngIf="!decisionChangesetService.isActivated" (click)="onAddDecisionChangeset()"> Add </button>
            <button *ngIf="decisionChangesetService.isActivated" (click)="onCancelDecisionChangeset()"> Cancel </button>
            <decision-changeset [decisionChangeset]="decisionChangesetService.decisions" [changeMode]="true"></decision-changeset>
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
    @Input() decisions: Decision[];
    @Input() proceedings: Proceeding[];
    @Output() decisionsRefreshRequested = new EventEmitter<void>();
    @Output() proceedingsRefreshRequested = new EventEmitter<void>();
    selectedNewProceeding: boolean = false;

    dateNow: Date = new Date(Date.now());
    newProceedingMeetingDate: string = this.dateNow.toISOString().slice(0, 10);
    newProceedingMeetingTime: string = this.dateNow.getHours() + ':' + this.dateNow.getMinutes();
    newProceedingTitle: string;
    newProceedingContent: string;

    constructor(
        private proceedingService: ProceedingService,
        private decisionService: DecisionService,
        private decisionChangesetService: DecisionChangesetService
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
                return Promise.all(this.decisionChangesetService.decisions.map(decision => {
                    decision.parentProceeding = newProceeding.id;
                    return this.decisionService.create(decision);
                }));
            })
            .then((decisions: Decision[]) => {
                newProceeding.childDecisions = decisions.map(decision => { this.decisions.push(decision); return decision.id });
                return this.proceedingService.update(newProceeding);
            })
            .then((proceeding: Proceeding) => {
                this.proceedings.push(proceeding);
                this.proceedingsRefreshRequested.emit();
                this.newProceedingMeetingDate = this.dateNow.toISOString().slice(0, 10);
                this.newProceedingMeetingTime = this.dateNow.getHours() + ':' + this.dateNow.getMinutes();
                this.newProceedingTitle = this.newProceedingContent = '';
                this.onCancelNewProceeding();
            })
            .catch(() => { console.log('new proceeding failed') });
    }

    onCancelNewProceeding(): void {
        this.selectedNewProceeding = false;
        this.onCancelDecisionChangeset();
    }

    onAddDecisionChangeset(): void {
        this.decisionChangesetService.isActivated = true;
    }

    onCancelDecisionChangeset(): void {
        this.decisionChangesetService.isActivated = false;
        this.decisionChangesetService.decisions = [];
        this.decisionsRefreshRequested.emit();
    }
}