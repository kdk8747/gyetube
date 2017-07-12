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
            <label>Payment Date:</label>    <input type="date" #paymentDate />
            <label>Memo:</label>            <input type="text" #memo />
            <label>Receipt:</label>         <input type="file" (change)="onChangeReceiptPhoto($event)" />
            <button (click)="onNewReceipt(memo.value, expiryDate.value) ? memo.value='' : '';">
                Done
            </button>
            <button (click)="selectedNewReceipt=false; memo.value=''">
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


    onChangeReceiptPhoto(event: any) {
        var files = event.srcElement.files;
        console.log(files);
    }

    onNewReceipt(memo: string, expiryDate: string): boolean {
        /*
        content = content.trim();
        if (!content || !expiryDate) return false;
        this.selectedNewReceipt = false;*/
        return true;
    }
}