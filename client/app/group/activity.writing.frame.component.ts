import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Policy, Activity, AmazonSignature } from '../_models';

import { PolicyService, ActivityService, AmazonService } from '../_services';

@Component({
    selector: 'activity-writing-frame',
    template: `
        <div *ngIf="!selectedNewActivity" (click)="selectedNewActivity = true">+</div>
        <div *ngIf="selectedNewActivity">
            <label>Basis: </label>
            <select [(ngModel)]="newActivityParentPolicy" >
                <option *ngFor="let policy of policies" [value]="policy.id"> {{policy.content}} </option>
            </select>
            <label>Activity Date:</label>   <input type="date" [(ngModel)]="newActivityDate" />
            <label>Content:</label>         <input type="text" [(ngModel)]="newActivityContent" />
            <label>Files:</label>           <input type="file" multiple (change)="onChangeFiles($event)" />
            <button (click)="onNewActivity()">
                Done
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
    @Input() policies: Policy[];
    @Output() activitiesRefreshRequested = new EventEmitter<void>();
    selectedNewActivity: boolean = false;

    dateNow: Date = new Date(Date.now());
    newActivityParentPolicy: string;
    newActivityDate: string = this.dateNow.toISOString().slice(0, 10);
    newActivityContent: string;
    newActivityFiles: File[];

    constructor(
        private policyService: PolicyService,
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
        if (!this.newActivityParentPolicy || !this.newActivityContent) return;
        this.newActivityContent = this.newActivityContent.trim();

        let newActivity = new Activity(0, new Date(Date.now()), new Date(this.newActivityDate),
            this.newActivityContent, [], [], +this.newActivityParentPolicy, []);

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
                let policy = this.policies.find(policy => policy.id == +this.newActivityParentPolicy); // FIX ME
                policy.childActivities.push(activity.id);
                return this.policyService.update(policy);
            })
            .then(() => {
                this.activitiesRefreshRequested.emit();
                this.newActivityParentPolicy = null;
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