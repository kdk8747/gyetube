import { Component, Input } from '@angular/core';
import { Policy, Activity } from '../_models';

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
    selectedNewActivity: boolean = false;

    dateNow: Date = new Date(Date.now());
    newActivityParentPolicy: string;
    newActivityDate: string = this.dateNow.toISOString().slice(0,10);
    newActivityContent: string;
    newActivityImageUrls: File[];
    newActivityDocumentUrls: File[];


    onChangeFiles(event: any) {
        let fileList = event.target.files;
        this.newActivityImageUrls = this.newActivityDocumentUrls = [];
        for (let i = 0; i < fileList.length; i ++){
            let file = event.target.files[i] as File;
            if (file.type.substr(0,5) == 'image')
                this.newActivityImageUrls.push(file);
            else
                this.newActivityDocumentUrls.push(file);
        }
    }

    onNewActivity(): void {
        if (!this.newActivityParentPolicy || !this.newActivityContent) return;
        this.newActivityContent = this.newActivityContent.trim();
        this.selectedNewActivity = false;
    }

    onCancelNewActivity(): void {
        this.selectedNewActivity = false;
    }
}