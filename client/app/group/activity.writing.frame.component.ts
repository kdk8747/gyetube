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
            <label>Photos:</label>          <input type="file" multiple (change)="onChangePhotos($event)" />
            <label>Documents:</label>       <input type="file" multiple (change)="onChangeDocuments($event)" />
            <button (click)="onNewActivity() ? content.value='' : '';">
                Done
            </button>
            <button (click)="selectedNewActivity=false; content.value=''">
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
    newActivityImageUrls: string;
    newActivityDocumentUrls: string;


    onChangePhotos(event: any) {
        var files = event.srcElement.files;
        console.log(files);
    }

    onChangeDocuments(event: any) {
        var files = event.srcElement.files;
        console.log(files);
    }

    onNewActivity(content: string, expiryDate: string): boolean {
        content = content.trim();
        if (!content || !expiryDate) return false;
        this.selectedNewActivity = false;
        return true;
    }
}