import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ReceiptListElement, ReceiptDetailElement, ReceiptEditorElement } from '../models';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/publishLast';


@Injectable()
export class ReceiptService {
  private receiptsUrl = '/api/v1.0/receipts';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    public http: AuthHttp
  ) { }

  getReceipts(group_id: number): Observable<ReceiptListElement[]> {
    const url = `${this.receiptsUrl}/${group_id}`;
    return this.http.get(url)
      .map(response => {
        let receipts = response.json() as ReceiptListElement[];
        receipts.map(receipt => {
          receipt.modified_datetime += 'Z'; //https://github.com/sidorares/node-mysql2/issues/262  // If this issue is closed, remove this workaround and add timezone=Z to JAWSDB_MARIA_URL
          receipt.settlement_datetime += 'Z';
        })
        return receipts;
      })
      .take(1);
  }

  getReceipt(group_id: number, receipt_id: number): Observable<ReceiptDetailElement> {
    const url = `${this.receiptsUrl}/${group_id}/${receipt_id}`;
    return this.http.get(url)
      .map(response => {
        let receipt = response.json() as ReceiptDetailElement;
        receipt.modified_datetime += 'Z'; //https://github.com/sidorares/node-mysql2/issues/262  // If this issue is closed, remove this workaround and add timezone=Z to JAWSDB_MARIA_URL
        receipt.settlement_datetime += 'Z';
        return receipt;
      })
      .take(1);
  }

  update(group_id: number, receipt: ReceiptEditorElement): Observable<ReceiptEditorElement> {
    const url = `${this.receiptsUrl}/${group_id}/${receipt.receipt_id}`;
    return this.http
      .put(url, JSON.stringify(receipt), { headers: this.headers })
      .map(() => receipt)
      .take(1);
  }

  create(group_id: number, receipt: ReceiptEditorElement): Observable<void> {
    const url = `${this.receiptsUrl}/${group_id}`;
    return this.http
      .post(url, JSON.stringify(receipt), { headers: this.headers })
      .map(() => null)
      .take(1);
  }

  delete(group_id: number, id: number): Observable<void> {
    const url = `${this.receiptsUrl}/${group_id}/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .map(() => null)
      .take(1);
  }
}
