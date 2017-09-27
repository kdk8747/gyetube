import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';

import { Receipt } from '../models';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ReceiptService {
  private receiptsUrl = '/api/v1.0/receipts';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    public http: AuthHttp
  ) { }

  getReceipts(group_id: string): Observable<Receipt[]> {
    const url = `${this.receiptsUrl}/${group_id}`;
    return this.http.get(url)
      .map(response => {
        let receipts = response.json() as Receipt[];
        return receipts.map(receipt => {
          receipt.modifiedDate = new Date(receipt.modifiedDate);
          receipt.paymentDate = new Date(receipt.paymentDate);
          return receipt;
        })
      })
      .take(1);
  }

  getReceipt(group_id: string, id: number): Observable<Receipt> {
    const url = `${this.receiptsUrl}/${group_id}/${id}`;
    return this.http.get(url)
      .map(response => {
        let receipt = response.json() as Receipt;
        receipt.modifiedDate = new Date(receipt.modifiedDate);
        receipt.paymentDate = new Date(receipt.paymentDate);
        return receipt;
      })
      .take(1);

  }

  update(group_id: string, receipt: Receipt): Observable<Receipt> {
    const url = `${this.receiptsUrl}/${group_id}/${receipt.id}`;
    return this.http
      .put(url, JSON.stringify(receipt), { headers: this.headers })
      .map(() => receipt)
      .take(1);
  }

  create(group_id: string, receipt: Receipt): Observable<Receipt> {
    const url = `${this.receiptsUrl}/${group_id}`;
    return this.http
      .post(url, JSON.stringify(receipt), { headers: this.headers })
      .map(response => {
        let receipt = response.json() as Receipt;
        receipt.modifiedDate = new Date(receipt.modifiedDate);
        receipt.paymentDate = new Date(receipt.paymentDate);
        return receipt;
      })
      .take(1);
  }

  delete(group_id: string, id: number): Observable<void> {
    const url = `${this.receiptsUrl}/${group_id}/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .map(() => null)
      .take(1);
  }
}
