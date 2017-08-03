import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Decision, Activity, AmazonSignature } from '../_models';

import { DecisionService, ActivityService, AmazonService } from '../_services';

@Component({
    selector: 'activity-writing-frame',
    template: `
        <div *ngIf="!selectedNewActivity" (click)="selectedNewActivity = true">+</div>
        <div *ngIf="selectedNewActivity">
            <label>Basis: </label>
            <select [(ngModel)]="newActivityParentDecision" >
                <option *ngFor="let decision of decisions" [value]="decision.id"> {{decision.content}} </option>
            </select>
            <label>Activity Date:</label>   <input type="date" [(ngModel)]="newActivityDate" />
            <label>Content:</label>         <input type="text" [(ngModel)]="newActivityContent" />
            <label>Files:</label>           <input type="file" multiple (change)="onChangeFiles($event)" />
            <button (click)="onNewActivity()">
                Create
            </button>
            <button (click)="onCancelNewActivity()">
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

export class ActivityWritingFrameComponent {
    @Input() activities: Activity[];
    @Input() decisions: Decision[];
    @Output() activitiesRefreshRequested = new EventEmitter<void>();
    selectedNewActivity: boolean = false;

    dateNow: Date = new Date(Date.now());
    newActivityParentDecision: string;
    newActivityDate: string = this.dateNow.toISOString().slice(0, 10);
    newActivityContent: string;
    newActivityFiles: File[];

    constructor(
        private decisionService: DecisionService,
        private activityService: ActivityService,
        private amazonService: AmazonService
    ) { }


    onChangeFiles(event: any) {
        let fileList = event.target.files;
        this.newActivityFiles = [];
        for (let i = 0; i < fileList.length; i++) {
            this.newActivityFiles.push(event.target.files[i] as File);
        }
    }

    onNewActivity(): void {
        if (!this.newActivityParentDecision || !this.newActivityContent || !this.newActivityDate) return;
        this.newActivityContent = this.newActivityContent.trim();

        let newActivity = new Activity(0, new Date(Date.now()), new Date(this.newActivityDate),
            this.newActivityContent, [], [], +this.newActivityParentDecision, []);

        let dateForSign = this.amazonService.getISO8601Date(new Date(Date.now()));
        let amzSignForPhoto: AmazonSignature = null;
        this.amazonService.getAmazonSignatureForPhotoPOST(dateForSign)
            .then((amzSign: AmazonSignature) => {
                amzSignForPhoto = amzSign;
                return this.amazonService.getAmazonSignatureForDocumentPOST(dateForSign);
            })
            .then((amzSignForDocument: AmazonSignature) => Promise.all(this.newActivityFiles.map(file => {
                let amzSign = file.type.substr(0, 5) == 'image' ? amzSignForPhoto : amzSignForDocument;
                return this.amazonService.postFile(file, dateForSign, amzSign)
                    .then((xml: string) => {
                        let regexp = /<Location>(.+)<\/Location>/;
                        let result = regexp.exec(xml);
                        if (result.length < 2) return Promise.reject('Unknown XML format');

                        if (file.type.substr(0, 5) == 'image')
                            newActivity.imageUrls.push(result[1]);
                        else
                            newActivity.documentUrls.push(result[1]);
                        return Promise.resolve();
                    })
            })))
            .then(() => this.activityService.create(newActivity))
            .then((activity: Activity) => {
                this.activities.push(activity);
                let decision = this.decisions.find(decision => decision.id == +this.newActivityParentDecision); // FIX ME
                decision.childActivities.push(activity.id);
                return this.decisionService.update(decision);
            })
            .then(() => {
                this.activitiesRefreshRequested.emit();
                this.newActivityParentDecision = null;
                this.newActivityDate = this.dateNow.toISOString().slice(0, 10);
                this.newActivityContent = '';
                this.selectedNewActivity = false;
            })
            .catch(() => { console.log('new activities failed') });
    }

    onCancelNewActivity(): void {
        this.selectedNewActivity = false;
    }
}