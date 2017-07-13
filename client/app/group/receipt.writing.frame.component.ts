import { Component, Input } from '@angular/core';
import { State } from '../constants';
import { Activity, Receipt } from '../_models';


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
            <label>Receipt:</label>         <input type="file" (change)="onChangeReceiptPhoto($event)" />
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
    newReceiptPaymentDate: string = this.dateNow.toISOString().slice(0,10);
    newReceiptMemo: string;
    newReceiptDifference: string;


    onChangeReceiptPhoto(event: any) {
        var files = event.srcElement.files;
        console.log(files);
    }

    onNewReceipt(): void {
        /*
        content = content.trim();
        if (!content || !expiryDate) return false;
        this.selectedNewReceipt = false;*/
    }

    onCancelNewReceipt(): void {
        this.selectedNewReceipt = false;
    }
}