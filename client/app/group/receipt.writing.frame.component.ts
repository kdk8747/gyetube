import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Activity, Receipt, AmazonSignature } from '../_models';

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
            <label>Receipt:</label>         <input type="file"   (change)="onChangeReceiptPhoto($event)" accept="image/*"/>
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
    @Output() receiptsRefreshRequested = new EventEmitter<void>();
    selectedNewReceipt: boolean = false;

    dateNow: Date = new Date(Date.now());
    newReceiptParentActivity: string = null;
    newReceiptPaymentDate: string = this.dateNow.toISOString().slice(0, 10);
    newReceiptMemo: string;
    newReceiptDifference: string = '0';
    newReceiptImageFile: File = null;

    constructor(
        private receiptService: ReceiptService,
        private activityService: ActivityService,
        private amazonService: AmazonService
    ) { }

    onChangeReceiptPhoto(event: any) {
        this.newReceiptImageFile = event.target.files[0] as File;
    }

    onNewReceipt(): void {
        if (!this.newReceiptParentActivity || !this.newReceiptPaymentDate || !this.newReceiptDifference || +this.newReceiptDifference == 0) return;
        this.newReceiptMemo = this.newReceiptMemo.trim();

        let newReceipt = new Receipt(0, new Date(Date.now()), new Date(this.newReceiptPaymentDate),
            this.newReceiptMemo, +this.newReceiptDifference,
            '', +this.newReceiptParentActivity);

        let dateForSign = this.amazonService.getISO8601Date(new Date(Date.now()));
        this.amazonService.getAmazonSignatureForReceiptPOST(dateForSign)
            .then((amzSign: AmazonSignature) => this.amazonService.postFile(this.newReceiptImageFile, dateForSign, amzSign))
            .then((xml: string) => {
                let regexp = /<Location>(.+)<\/Location>/;
                let result = regexp.exec(xml);
                if (result.length < 2) return Promise.reject('Unknown XML format');
                newReceipt.imageUrl = result[1];
                return this.receiptService.create(newReceipt);
            })
            .then((receipt: Receipt) => {
                this.receipts.push(receipt);
                let activity = this.activities.find(activity => activity.id == +this.newReceiptParentActivity); // FIX ME
                activity.childReceipts.push(receipt.id);
                return this.activityService.update(activity);
            })
            .then(() => {
                this.receiptsRefreshRequested.emit();
                this.newReceiptParentActivity = null;
                this.newReceiptMemo = '';
                this.newReceiptDifference = '0';
                this.newReceiptPaymentDate = this.dateNow.toISOString().slice(0, 10);
                this.selectedNewReceipt = false;
            })
            .catch(() => { console.log('new receipt failed') });

    }

    onCancelNewReceipt(): void {
        this.selectedNewReceipt = false;
    }
}