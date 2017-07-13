import { Component, Input } from '@angular/core';
import { Receipt } from '../_models';


@Component({
    selector: 'receipt',
    template: `
        <div class="receipt">
            <span>activity: {{receipt.parentActivity}}</span>
            <span>modifiedDate: {{receipt.modifiedDate | date:'y-MM-dd'}}</span>
            <span>paymentDate: {{receipt.paymentDate | date:'y-MM-dd'}}</span>
            <span>memo: {{receipt.memo}}</span>
            <span>difference: {{receipt.difference}}</span>
            <span>imageUrl: {{receipt.imageUrl}}</span>
        </div>
    `,
    styles: [`
        div {
            border: 1px solid #000000;
            text-align: center;
        }
    `]
})

export class ReceiptComponent {
    @Input() receipt: Receipt;
    //@Input() balance: number;
}