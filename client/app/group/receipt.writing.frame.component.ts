import { Component, Input } from '@angular/core';
import { State } from '../constants';
import { Activity, Receipt } from '../_models';

import { ReceiptService, ActivityService, AmazonService } from '../_services';

@Component({
    selector: 'receipt-writing-frame',
    template: `
        <div *ngIf="!selectedNewReceipt" (click)="selectedNewReceipt = true">+</div>
        <div *ngIf="selectedNewReceipt">
            <label>Activity: </label>
            <select [(ngModel)]="newReceiptParentActivity" >
                <option *ngFor="let activity of activities" [value]="activity.id"> {{activity.content}} </option>
            </select>
            <label>Payment Date:</label>    <input type="date"   [(ngModel)]="newReceiptPaymentDate" />
            <label>Memo:</label>            <input type="text"   [(ngModel)]="newReceiptMemo" />
            <label>Difference:</label>      <input type="number" [(ngModel)]="newReceiptDifference" />
            <label>Receipt:</label>         <input type="file" (change)="onChangeReceiptPhoto($event)" accept="image/*"/>
            <button (click)="onNewReceipt()">
                Done
            </button>
            <button (click)="onCancelNewReceipt()">
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

export class ReceiptWritingFrameComponent {
    @Input() activities: Activity[];
    @Input() receipts: Receipt[];
    selectedNewReceipt: boolean = false;

    dateNow: Date = new Date(Date.now());
    newReceiptParentActivity: string = null;
    newReceiptPaymentDate: string = this.dateNow.toISOString().slice(0, 10);
    newReceiptMemo: string;
    newReceiptDifference: string;
    newReceiptImage: File = null;

    constructor(
        private receiptService: ReceiptService,
        private activityService: ActivityService,
        private amazonService: AmazonService
    ) { }

    onChangeReceiptPhoto(event: any) {
        this.newReceiptImage = event.target.files[0];

        this.amazonService.test(this.newReceiptImage).then(()=>{
            alert('success');
        });;
    }

    onNewReceipt(): void {
        if (!this.newReceiptParentActivity || !this.newReceiptPaymentDate || !this.newReceiptDifference || !this.newReceiptImage) return;
        this.newReceiptMemo = this.newReceiptMemo.trim();

        let newReceipt = new Receipt(0, new Date(Date.now()), new Date(this.newReceiptPaymentDate),
            this.newReceiptMemo, +this.newReceiptDifference,
            '', +this.newReceiptParentActivity);

    }

    onCancelNewReceipt(): void {
        this.selectedNewReceipt = false;
    }
}